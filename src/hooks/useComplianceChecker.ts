import { useState, useCallback, useEffect } from 'react';
import { analyzePost } from '../../services/geminiService';
import { AnalysisResult, ComplianceStatus } from '../../types';
import { supabase } from '../services/supabaseClient';

// ─── Constants ────────────────────────────────────────────────────────────────
// Session storage keys for persisting last result across navigation
const SESSION_KEY_RESULT = 'safepost_last_result';
const SESSION_KEY_CONTENT = 'safepost_last_content';

// Session storage keys for caching usage and history data
const CACHE_KEY_USAGE = 'safepost_usage_cache';
const CACHE_KEY_HISTORY = 'safepost_history_cache';
const CACHE_MAX_AGE_MS = 60_000; // 60 seconds

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

function getCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_MAX_AGE_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { timestamp: Date.now(), data };
  sessionStorage.setItem(key, JSON.stringify(entry));
}

function invalidateCache(): void {
  sessionStorage.removeItem(CACHE_KEY_USAGE);
  sessionStorage.removeItem(CACHE_KEY_HISTORY);
}

// Plan check limits — update these when pricing tiers are finalised
export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 3,
  professional: 30,
  proplus: 100,
  ultra: Infinity,
};

// History visibility limits by plan
export const HISTORY_LIMITS: Record<string, number> = {
  free: 10,
  starter: 10,
  professional: 30,
  proplus: 100,
  ultra: 1000,
};

function getHistoryLimit(planName: string): number {
  const key = planName?.toLowerCase() ?? 'free';
  return HISTORY_LIMITS[key] ?? HISTORY_LIMITS.free;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SavedComplianceCheck {
  id: string;
  created_at: string;
  user_id: string;
  content_text: string;
  content_type: string;
  platform: string;
  overall_status: string;
  compliance_score: number;
  result_json: any;
  notes?: string;
}

export interface UsageInfo {
  checksUsedThisMonth: number;
  checksRemaining: number;
  planLimit: number;
  isAtLimit: boolean;
  resetDate: string; // Human-readable e.g. "1 Mar 2026"
}

async function fetchUserComplianceHistory(userId: string, limit: number = 20): Promise<SavedComplianceCheck[]> {
  console.log('[DEBUG fetchHistory] Fetching history for user:', userId, 'limit:', limit);
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  console.log('[DEBUG fetchHistory] Result — data:', data?.length ?? 'null', 'error:', error);
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchMonthlyCheckCount(userId: string): Promise<number> {
  // Count checks from the start of the current calendar month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  console.log('[DEBUG fetchCount] Fetching monthly count for user:', userId, 'since:', startOfMonth);
  const { count, error } = await supabase
    .from('compliance_checks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth);

  console.log('[DEBUG fetchCount] Result — count:', count, 'error:', error);
  if (error) {
    console.error('Failed to fetch monthly check count:', error);
    return 0;
  }
  return count ?? 0;
}

async function deleteComplianceCheck(id: string): Promise<void> {
  const { error } = await supabase
    .from('compliance_checks')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

function getResetDateString(): string {
  const now = new Date();
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return firstOfNextMonth.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getPlanLimit(planName: string): number {
  const key = planName?.toLowerCase() ?? 'free';
  return PLAN_LIMITS[key] ?? PLAN_LIMITS.free;
}

// ─── Status normalisation ─────────────────────────────────────────────────────
const STATUS_MAP: Record<string, string> = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  WARNING: 'warning',
  NOT_HEALTHCARE: 'warning',
};

function normaliseStatus(status: string): string {
  return STATUS_MAP[status] ?? 'warning';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export type CheckerStep = 'idle' | 'analyzing' | 'complete' | 'error';

export function useComplianceChecker(planName: string = 'free') {
  // ── Core checker state ──────────────────────────────────────────────────
  const [step, setStep] = useState<CheckerStep>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lastContent, setLastContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // ── History state ───────────────────────────────────────────────────────
  const [history, setHistory] = useState<SavedComplianceCheck[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // ── Usage state ─────────────────────────────────────────────────────────
  const [checksUsedThisMonth, setChecksUsedThisMonth] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  const planLimit = getPlanLimit(planName);
  const historyLimit = getHistoryLimit(planName);
  const checksRemaining = Math.max(0, planLimit - checksUsedThisMonth);
  const isAtLimit = planLimit !== Infinity && checksUsedThisMonth >= planLimit;

  const usage: UsageInfo = {
    checksUsedThisMonth,
    checksRemaining,
    planLimit,
    isAtLimit,
    resetDate: getResetDateString(),
  };

  // ── Restore last result from sessionStorage on mount ───────────────────
  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem(SESSION_KEY_RESULT);
      const savedContent = sessionStorage.getItem(SESSION_KEY_CONTENT);
      if (savedResult && savedContent) {
        setResult(JSON.parse(savedResult));
        setLastContent(savedContent);
        setStep('complete');
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY_RESULT);
      sessionStorage.removeItem(SESSION_KEY_CONTENT);
    }
  }, []);

  // ── Load usage count and history on mount (with sessionStorage cache) ──
  useEffect(() => {
    const initialLoad = async () => {
      // Check for valid cached data first
      const cachedUsage = getCache<number>(CACHE_KEY_USAGE);
      const cachedHistory = getCache<SavedComplianceCheck[]>(CACHE_KEY_HISTORY);

      console.log('[DEBUG initialLoad] Cache check — usage:', cachedUsage, 'history:', cachedHistory?.length ?? 'null');

      if (cachedUsage !== null && cachedHistory !== null) {
        console.log('[DEBUG initialLoad] Using cached data — usage:', cachedUsage, 'history items:', cachedHistory.length);
        setChecksUsedThisMonth(cachedUsage);
        setHistory(cachedHistory);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[DEBUG initialLoad] Supabase user:', user ? user.id : 'NULL — no authenticated user');
        if (!user) return;

        // Load usage count and history in parallel
        setIsLoadingUsage(true);
        setIsLoadingHistory(true);

        const [count, checks] = await Promise.all([
          fetchMonthlyCheckCount(user.id),
          fetchUserComplianceHistory(user.id, historyLimit),
        ]);

        console.log('[DEBUG initialLoad] Fetched from Supabase — count:', count, 'history items:', checks.length);
        setChecksUsedThisMonth(count);
        setHistory(checks);
        setCache(CACHE_KEY_USAGE, count);
        setCache(CACHE_KEY_HISTORY, checks);
      } catch (err) {
        console.error('[DEBUG initialLoad] FAILED to load initial data:', err);
      } finally {
        setIsLoadingUsage(false);
        setIsLoadingHistory(false);
      }
    };

    initialLoad();
  }, []);

  // ── Run a compliance check ─────────────────────────────────────────────
  const runCheck = useCallback(async (content: string) => {
    console.log('[DEBUG runCheck] START — isAtLimit:', isAtLimit, 'planLimit:', planLimit, 'checksUsedThisMonth:', checksUsedThisMonth);
    if (isAtLimit) {
      setError('You have reached your monthly check limit. Please upgrade your plan to continue.');
      return;
    }

    setStep('analyzing');
    setError(null);
    setResult(null);
    setLastContent(content);

    try {
      console.log('[DEBUG runCheck] Calling analyzePost...');
      const analysisResult = await analyzePost(content);
      console.log('[DEBUG runCheck] Claude API response received — status:', analysisResult.status, 'issues:', analysisResult.issues?.length);

      const normalisedResult = {
        ...analysisResult,
        overall_status: normaliseStatus(analysisResult.status),
      };

      // Persist to sessionStorage so result survives navigation
      sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(normalisedResult));
      sessionStorage.setItem(SESSION_KEY_CONTENT, content);

      setResult(normalisedResult as any);

      // Compute compliance score for the record
      const complianceScore = analysisResult.status === ComplianceStatus.COMPLIANT
        ? 100
        : analysisResult.status === ComplianceStatus.NON_COMPLIANT
        ? Math.max(0, 100
            - (analysisResult.issues.filter((i: any) => i.severity === 'Critical').length * 25)
            - (analysisResult.issues.filter((i: any) => i.severity === 'Warning').length * 10))
        : 70;

      // Optimistically update usage counter and history so the sidebar
      // reflects the new check immediately, before the DB write completes
      console.log('[DEBUG runCheck] Optimistic update — setting checksUsedThisMonth to prev+1, prepending to history');
      setChecksUsedThisMonth(prev => {
        console.log('[DEBUG runCheck] setChecksUsedThisMonth updater — prev:', prev, '→ new:', prev + 1);
        return prev + 1;
      });
      setHistory(prev => {
        console.log('[DEBUG runCheck] setHistory updater — prev length:', prev.length, '→ new length:', prev.length + 1);
        return [{
          id: `pending-${Date.now()}`,
          created_at: new Date().toISOString(),
          user_id: '',
          content_text: content,
          content_type: 'social_media_post',
          platform: 'general',
          overall_status: normaliseStatus(analysisResult.status),
          compliance_score: complianceScore,
          result_json: analysisResult,
        }, ...prev];
      });

      // Invalidate cache so other pages fetch fresh data from Supabase
      invalidateCache();
      console.log('[DEBUG runCheck] Cache invalidated, setting step to complete');

      // Signal results are ready — display immediately without waiting for DB
      setStep('complete');

      // Save to Supabase and refresh data in the background (non-blocking)
      (async () => {
        try {
          console.log('[DEBUG bgSave] Background save starting — getting user...');
          const { data: { user } } = await supabase.auth.getUser();
          console.log('[DEBUG bgSave] User:', user ? user.id : 'NULL — aborting save');
          if (!user) return;

          console.log('[DEBUG bgSave] Inserting into compliance_checks...');
          const insertResult = await supabase
            .from('compliance_checks')
            .insert({
              user_id: user.id,
              content_text: content,
              content_type: 'social_media_post',
              platform: 'general',
              overall_status: normaliseStatus(analysisResult.status),
              compliance_score: complianceScore,
              result_json: analysisResult,
            })
            .select()
            .single();

          console.log('[DEBUG bgSave] Insert result — data:', insertResult.data, 'error:', insertResult.error);

          if (insertResult.error) {
            console.error('[DEBUG bgSave] INSERT FAILED:', insertResult.error.message, insertResult.error.details, insertResult.error.hint);
            // BUG DIAGNOSTIC: If insert fails, the refetch below will return stale data
            // and OVERWRITE the optimistic values back to 0 / []
          }

          // Refetch to sync with actual DB state and update cache
          console.log('[DEBUG bgSave] Refetching fresh count and history...');
          const [freshCount, freshHistory] = await Promise.all([
            fetchMonthlyCheckCount(user.id),
            fetchUserComplianceHistory(user.id, historyLimit),
          ]);
          console.log('[DEBUG bgSave] Fresh data — count:', freshCount, 'history items:', freshHistory.length);
          console.log('[DEBUG bgSave] OVERWRITING optimistic state with fresh DB values');
          setChecksUsedThisMonth(freshCount);
          setHistory(freshHistory);
          setCache(CACHE_KEY_USAGE, freshCount);
          setCache(CACHE_KEY_HISTORY, freshHistory);
        } catch (err) {
          console.error('[DEBUG bgSave] EXCEPTION in background save:', err);
        }
      })();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('[DEBUG runCheck] OUTER ERROR:', message);
      setError(message);
      setStep('error');
    }
  }, [isAtLimit, historyLimit]);

  // ── Load history manually (for History page) ───────────────────────────
  const loadHistory = useCallback(async () => {
    console.log('[DEBUG loadHistory] Manual history load triggered');
    setIsLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[DEBUG loadHistory] User:', user ? user.id : 'NULL');
      if (user) {
        const checks = await fetchUserComplianceHistory(user.id, historyLimit);
        console.log('[DEBUG loadHistory] Fetched', checks.length, 'checks from Supabase');
        setHistory(checks);
        setCache(CACHE_KEY_HISTORY, checks);
      }
    } catch (err) {
      console.error('[DEBUG loadHistory] FAILED:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [historyLimit]);

  // ── Delete a check ─────────────────────────────────────────────────────
  const deleteCheck = useCallback(async (id: string) => {
    await deleteComplianceCheck(id);
    setHistory(prev => prev.filter(c => c.id !== id));
    // Decrement usage count when a check is deleted
    setChecksUsedThisMonth(prev => Math.max(0, prev - 1));
    invalidateCache();
  }, []);

  // ── Reset checker state (new check) ───────────────────────────────────
  const resetChecker = useCallback(() => {
    setStep('idle');
    setResult(null);
    setLastContent('');
    setError(null);
    // Clear session storage so navigating back shows fresh input
    sessionStorage.removeItem(SESSION_KEY_RESULT);
    sessionStorage.removeItem(SESSION_KEY_CONTENT);
  }, []);

  return {
    step,
    result,
    lastContent,
    error,
    history,
    isLoadingHistory,
    usage,
    isLoadingUsage,
    runCheck,
    loadHistory,
    deleteCheck,
    resetChecker,
  };
}
