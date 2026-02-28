import { useState, useCallback, useEffect } from 'react';
import { analyzePost } from '../../services/geminiService';
import { AnalysisResult, ComplianceStatus } from '../../types';
import { supabase } from '../services/supabaseClient';

// ─── Constants ────────────────────────────────────────────────────────────────
// Session storage keys for persisting last result across navigation
const SESSION_KEY_RESULT = 'safepost_last_result';
const SESSION_KEY_CONTENT = 'safepost_last_content';

// Plan check limits — update these when pricing tiers are finalised
export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 3,
  professional: 50,
  proplus: 200,
  ultra: Infinity,
};

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

async function fetchUserComplianceHistory(userId: string): Promise<SavedComplianceCheck[]> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchMonthlyCheckCount(userId: string): Promise<number> {
  // Count checks from the start of the current calendar month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await supabase
    .from('compliance_checks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth);

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

  // ── Load usage count and history on mount ──────────────────────────────
  useEffect(() => {
    const initialLoad = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Load usage count and history in parallel
        setIsLoadingUsage(true);
        setIsLoadingHistory(true);

        const [count, checks] = await Promise.all([
          fetchMonthlyCheckCount(user.id),
          fetchUserComplianceHistory(user.id),
        ]);

        setChecksUsedThisMonth(count);
        setHistory(checks);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoadingUsage(false);
        setIsLoadingHistory(false);
      }
    };

    initialLoad();
  }, []);

  // ── Run a compliance check ─────────────────────────────────────────────
  const runCheck = useCallback(async (content: string) => {
    if (isAtLimit) {
      setError('You have reached your monthly check limit. Please upgrade your plan to continue.');
      return;
    }

    setStep('analyzing');
    setError(null);
    setResult(null);
    setLastContent(content);

    try {
      const analysisResult = await analyzePost(content);

      const normalisedResult = {
        ...analysisResult,
        overall_status: normaliseStatus(analysisResult.status),
      };

      // Persist to sessionStorage so result survives navigation
      sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(normalisedResult));
      sessionStorage.setItem(SESSION_KEY_CONTENT, content);

      setResult(normalisedResult as any);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: newRecord } = await supabase
          .from('compliance_checks')
          .insert({
            user_id: user.id,
            content_text: content,
            content_type: 'social_media_post',
            platform: 'general',
            overall_status: normaliseStatus(analysisResult.status),
            compliance_score: analysisResult.status === ComplianceStatus.COMPLIANT
              ? 100
              : analysisResult.status === ComplianceStatus.NON_COMPLIANT
              ? Math.max(0, 100
                  - (analysisResult.issues.filter(i => i.severity === 'Critical').length * 25)
                  - (analysisResult.issues.filter(i => i.severity === 'Warning').length * 10))
              : 70,
            result_json: analysisResult,
          })
          .select()
          .single();

        // Optimistically update usage count and prepend to history
        setChecksUsedThisMonth(prev => prev + 1);
        if (newRecord) {
          setHistory(prev => [newRecord, ...prev]);
        }
      }

      setStep('complete');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setStep('error');
    }
  }, [isAtLimit]);

  // ── Load history manually (for History page) ───────────────────────────
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const checks = await fetchUserComplianceHistory(user.id);
        setHistory(checks);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // ── Delete a check ─────────────────────────────────────────────────────
  const deleteCheck = useCallback(async (id: string) => {
    await deleteComplianceCheck(id);
    setHistory(prev => prev.filter(c => c.id !== id));
    // Decrement usage count when a check is deleted
    setChecksUsedThisMonth(prev => Math.max(0, prev - 1));
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
