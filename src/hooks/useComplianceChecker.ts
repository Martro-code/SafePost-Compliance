import { useState, useCallback, useEffect, useRef } from 'react';
import { analyzePost, SessionExpiredError } from '../services/complianceService';
import { AnalysisResult, ComplianceStatus } from '../types';
import { supabase } from '../services/supabaseClient';

// ─── Constants ────────────────────────────────────────────────────────────────
// Session storage keys for persisting last result across navigation
const SESSION_KEY_RESULT = 'safepost_last_result';
const SESSION_KEY_CONTENT = 'safepost_last_content';
const SESSION_KEY_CHECK_ID = 'safepost_last_check_id';

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

// Plan check limits — used as fallback when account context is not available
export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 3,
  professional: 30,
  pro_plus: 100,
  ultra: Infinity,
};

// History visibility limits by plan
export const HISTORY_LIMITS: Record<string, number> = {
  free: 10,
  starter: 10,
  professional: 30,
  pro_plus: 100,
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
  account_id?: string;
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

async function fetchAccountComplianceHistory(accountId: string, limit: number = 20): Promise<SavedComplianceCheck[]> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Fallback: fetch by user_id for accounts not yet migrated
async function fetchUserComplianceHistory(userId: string, limit: number = 20): Promise<SavedComplianceCheck[]> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
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

// ─── Status normalisation ─────────────────────────────────────────────────────
const STATUS_MAP: Record<string, string> = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  WARNING: 'requires_review',
  REQUIRES_REVIEW: 'requires_review',
  NOT_HEALTHCARE: 'requires_review',
  CONDUCT_RISK: 'conduct_risk',
};

function normaliseStatus(status: string): string {
  return STATUS_MAP[status] ?? 'requires_review';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export type CheckerStep = 'idle' | 'analyzing' | 'complete' | 'error';

interface UseComplianceCheckerOptions {
  planName?: string;
  accountId?: string | null;
  checksUsed?: number;
  checksLimit?: number | null;
  onCheckComplete?: () => Promise<void>;
}

export function useComplianceChecker(planNameOrOptions: string | UseComplianceCheckerOptions = 'free') {
  // Support both legacy string arg and new options object
  const options: UseComplianceCheckerOptions = typeof planNameOrOptions === 'string'
    ? { planName: planNameOrOptions }
    : planNameOrOptions;

  const {
    planName = 'free',
    accountId = null,
    checksUsed: accountChecksUsed,
    checksLimit: accountChecksLimit,
    onCheckComplete,
  } = options;

  // ── Core checker state ──────────────────────────────────────────────────
  const [step, setStep] = useState<CheckerStep>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lastContent, setLastContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  // ── Check ID ref (tracks the Supabase ID of the current check) ──────
  const lastCheckIdRef = useRef<string | null>(null);

  // ── History state ───────────────────────────────────────────────────────
  const [history, setHistory] = useState<SavedComplianceCheck[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // ── Usage state ─────────────────────────────────────────────────────────
  const [checksUsedThisMonth, setChecksUsedThisMonth] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  // Determine limits: prefer account-level values, fall back to plan-based
  const hasAccountLimits = accountChecksLimit !== undefined && accountChecksUsed !== undefined;
  const effectiveChecksUsed = hasAccountLimits ? accountChecksUsed! : checksUsedThisMonth;
  const planLimit = hasAccountLimits
    ? (accountChecksLimit === null ? Infinity : accountChecksLimit!)
    : (PLAN_LIMITS[planName?.toLowerCase() ?? 'free'] ?? PLAN_LIMITS.free);

  const historyLimit = getHistoryLimit(planName);
  const checksRemaining = Math.max(0, planLimit - effectiveChecksUsed);
  const isAtLimit = planLimit !== Infinity && effectiveChecksUsed >= planLimit;

  const usage: UsageInfo = {
    checksUsedThisMonth: effectiveChecksUsed,
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
      const savedCheckId = sessionStorage.getItem(SESSION_KEY_CHECK_ID);
      if (savedResult && savedContent) {
        setResult(JSON.parse(savedResult));
        setLastContent(savedContent);
        setStep('complete');
      }
      if (savedCheckId) {
        lastCheckIdRef.current = savedCheckId;
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY_RESULT);
      sessionStorage.removeItem(SESSION_KEY_CONTENT);
      sessionStorage.removeItem(SESSION_KEY_CHECK_ID);
    }
  }, []);

  // ── Load history on mount (with sessionStorage cache) ──
  useEffect(() => {
    const initialLoad = async () => {
      // Check for valid cached data first
      const cachedHistory = getCache<SavedComplianceCheck[]>(CACHE_KEY_HISTORY);

      if (cachedHistory !== null) {
        setHistory(cachedHistory);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setIsLoadingHistory(true);

        // Fetch history by account_id if available, otherwise by user_id
        const checks = accountId
          ? await fetchAccountComplianceHistory(accountId, historyLimit)
          : await fetchUserComplianceHistory(user.id, historyLimit);

        setHistory(checks);
        setCache(CACHE_KEY_HISTORY, checks);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    initialLoad();
  }, [historyLimit, accountId]);

  // ── Guard ref to prevent concurrent checks from bypassing the limit ──
  const checkInProgressRef = useRef(false);

  // ── Run a compliance check ─────────────────────────────────────────────
  const runCheck = useCallback(async (content: string, contentType: string = 'social_media_post', platform: string = 'general', options?: { pdfBase64?: string; onExtractedText?: (text: string) => void }) => {
    // Prevent concurrent checks from bypassing the limit
    if (checkInProgressRef.current) return;
    checkInProgressRef.current = true;

    try {
      // Use getSession() (reads from local storage) instead of getUser() (network call)
      // to avoid false negatives from network errors, especially on Edge
      let { data: { session } } = await supabase.auth.getSession();
      let user = session?.user ?? null;

      if (!session?.access_token || !user) {
        // Session missing locally — attempt a refresh before giving up
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session?.access_token || !refreshData.session?.user) {
          // Double-check: the session may have been restored by autoRefreshToken
          // between our getSession() call and now (race condition)
          const { data: { session: recheckedSession } } = await supabase.auth.getSession();
          if (recheckedSession?.access_token && recheckedSession?.user) {
            session = recheckedSession;
            user = recheckedSession.user;
          } else {
            setError('Your session has expired. Please save your content and log in again.');
            setAuthError(true);
            setStep('error');
            return;
          }
        } else {
          session = refreshData.session;
          user = refreshData.session.user;
        }
      }

      // Check limit using account-level data
      if (planLimit !== Infinity && effectiveChecksUsed >= planLimit) {
        setError('You have reached your monthly check limit. Please upgrade your plan to continue.');
        return;
      }

      setStep('analyzing');
      setError(null);
      setResult(null);
      setLastContent(content);

      const pdfBase64 = options?.pdfBase64;
      const trimmed = content.trim();

      // Guard: reject empty or very short content (skip for PDF uploads — Claude extracts the text)
      if (!pdfBase64) {
        if (!trimmed || trimmed.length < 10) {
          setError("We couldn't extract text from your file. Please check the file is not empty or try copying the content into the text area directly.");
          setStep('error');
          return;
        }
      }

      // Guard: truncate excessively long content to stay within API token limits.
      // .docx files can be very large; truncate aggressively to avoid response truncation.
      const MAX_CONTENT_LENGTH = 3_000;
      let contentToAnalyze = trimmed;
      if (!pdfBase64 && trimmed.length > MAX_CONTENT_LENGTH) {
        console.warn(
          `[useComplianceChecker] Content length (${trimmed.length} chars) exceeds limit. Truncating to ${MAX_CONTENT_LENGTH} chars.`,
        );
        contentToAnalyze = trimmed.slice(0, MAX_CONTENT_LENGTH) + '... [content truncated]';
      }

      const analysisResult = await analyzePost(contentToAnalyze, { pdfBase64 });

      // For PDF uploads, pass extracted text back to the caller to populate the input field
      const extractedText = analysisResult.extractedText;
      if (extractedText && options?.onExtractedText) {
        options.onExtractedText(extractedText);
      }

      const normalisedResult = {
        ...analysisResult,
        overall_status: normaliseStatus(analysisResult.status),
      };

      // Persist to sessionStorage so result survives navigation
      const contentForStorage = extractedText ?? content;
      sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(normalisedResult));
      sessionStorage.setItem(SESSION_KEY_CONTENT, contentForStorage);

      setResult(normalisedResult as any);

      // Compute compliance score for the record
      const complianceScore = analysisResult.status === ComplianceStatus.CONDUCT_RISK
        ? 0
        : analysisResult.status === ComplianceStatus.COMPLIANT
        ? 100
        : analysisResult.status === ComplianceStatus.NON_COMPLIANT
        ? Math.max(0, 100
            - (analysisResult.issues.filter((i: any) => i.severity === 'Critical').length * 25)
            - (analysisResult.issues.filter((i: any) => i.severity === 'Warning').length * 10))
        : 70;

      // Optimistically update usage counter and history
      setChecksUsedThisMonth(prev => prev + 1);
      setHistory(prev => [{
        id: `pending-${Date.now()}`,
        created_at: new Date().toISOString(),
        user_id: user.id,
        account_id: accountId ?? undefined,
        content_text: content,
        content_type: contentType,
        platform: platform,
        overall_status: normaliseStatus(analysisResult.status),
        compliance_score: complianceScore,
        result_json: analysisResult,
      }, ...prev]);

      // Invalidate cache so other pages fetch fresh data from Supabase
      invalidateCache();

      // Signal results are ready — display immediately without waiting for DB
      setStep('complete');

      // Save to Supabase and refresh data in the background (non-blocking)
      (async () => {
        try {
          const insertPayload: Record<string, any> = {
            user_id: user.id,
            content_text: extractedText ?? content,
            content_type: contentType,
            platform: platform,
            overall_status: normaliseStatus(analysisResult.status),
            compliance_score: complianceScore,
            result_json: analysisResult,
          };

          // Include account_id if available
          if (accountId) {
            insertPayload.account_id = accountId;
          }

          const insertResult = await supabase
            .from('compliance_checks')
            .insert(insertPayload)
            .select()
            .single();

          if (insertResult.error) {
            console.error('Failed to save compliance check:', insertResult.error.message);
          } else if (insertResult.data) {
            lastCheckIdRef.current = insertResult.data.id;
            sessionStorage.setItem(SESSION_KEY_CHECK_ID, insertResult.data.id);
          }

          // Insert in-app notification if user has the preference enabled
          if (insertResult.data) {
            try {
              const { data: prefs } = await supabase
                .from('user_preferences')
                .select('notif_compliance_results')
                .eq('user_id', user.id)
                .maybeSingle();

              // Send notification if preference is enabled (default true if no row)
              if (!prefs || prefs.notif_compliance_results) {
                const statusLabel = normaliseStatus(analysisResult.status) === 'compliant'
                  ? 'Compliant'
                  : normaliseStatus(analysisResult.status) === 'non_compliant'
                  ? 'Non-compliant'
                  : normaliseStatus(analysisResult.status) === 'conduct_risk'
                  ? 'Conduct risk'
                  : 'Requires review';

                await supabase.from('notifications').insert({
                  user_id: user.id,
                  type: 'compliance_complete',
                  title: 'Compliance check complete',
                  message: `Your post has been reviewed — ${statusLabel}.`,
                });

                // Update bell count via event
                window.dispatchEvent(new Event('safepost-notifications-updated'));
              }
            } catch (notifErr) {
              console.error('Failed to insert notification:', notifErr);
            }
          }

          // Increment account-level usage counter via server-side RPC
          // (checks_used is a restricted column — never update directly)
          if (accountId) {
            const { error: rpcError } = await supabase.rpc('increment_checks_used', { p_account_id: accountId });
            if (rpcError) {
              console.error('Failed to increment checks_used via RPC:', rpcError);
            }
          }

          // Refresh account context
          if (onCheckComplete) {
            await onCheckComplete();
          }

          // Fire-and-forget: warn user if approaching check limit (≥80% used)
          const updatedChecksUsed = effectiveChecksUsed + 1;
          if (
            accountChecksLimit != null &&
            accountChecksLimit !== 0 &&
            updatedChecksUsed / accountChecksLimit >= 0.8
          ) {
            supabase.functions.invoke('send-limit-warning', {
              body: { user_id: user.id, checks_used: updatedChecksUsed, checks_limit: accountChecksLimit },
            }).catch((err) => {
              console.error('Failed to send limit warning:', err);
            });
          }

          // Refetch history to sync with actual DB state
          const syncedHistory = accountId
            ? await fetchAccountComplianceHistory(accountId, historyLimit)
            : await fetchUserComplianceHistory(user.id, historyLimit);
          setHistory(syncedHistory);
          setCache(CACHE_KEY_HISTORY, syncedHistory);
        } catch (err) {
          console.error('Background save failed:', err);
        }
      })();
    } catch (err) {
      if (err instanceof SessionExpiredError || (err as any)?.name === 'SessionExpiredError') {
        // Verify the session is genuinely expired before showing the auth error banner.
        // A 401 from the Edge Function does not necessarily mean the local session is invalid
        // (e.g. server-side auth misconfiguration, token not yet propagated, etc.).
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.access_token) {
          // Local session is still valid — treat as a server-side error, not session expiry
          setError('Failed to analyze post. Please try again.');
          setStep('error');
        } else {
          setError('Your session has expired. Please save your content and log in again.');
          setAuthError(true);
          setStep('error');
        }
        // Do NOT clear lastContent — the user should be able to copy their draft
      } else {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setStep('error');
      }
    } finally {
      checkInProgressRef.current = false;
    }
  }, [planLimit, historyLimit, accountId, effectiveChecksUsed, onCheckComplete]);

  // ── Load history manually (for History page) ───────────────────────────
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const checks = accountId
          ? await fetchAccountComplianceHistory(accountId, historyLimit)
          : await fetchUserComplianceHistory(user.id, historyLimit);
        setHistory(checks);
        setCache(CACHE_KEY_HISTORY, checks);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [historyLimit, accountId]);

  // ── Delete a check ─────────────────────────────────────────────────────
  const deleteCheck = useCallback(async (id: string) => {
    const deletedCheck = history.find(c => c.id === id);
    await deleteComplianceCheck(id);
    setHistory(prev => prev.filter(c => c.id !== id));

    if (deletedCheck) {
      const checkDate = new Date(deletedCheck.created_at);
      const now = new Date();
      const isCurrentMonth = checkDate.getFullYear() === now.getFullYear()
        && checkDate.getMonth() === now.getMonth();
      if (isCurrentMonth) {
        setChecksUsedThisMonth(prev => Math.max(0, prev - 1));

        // Decrement account-level counter via server-side RPC
        // (checks_used is a restricted column — never update directly)
        if (accountId) {
          supabase.rpc('decrement_checks_used', { p_account_id: accountId })
            .then(({ error }) => {
              if (error) console.error('Failed to decrement checks_used via RPC:', error);
            });
          if (onCheckComplete) onCheckComplete();
        }
      }
    }

    invalidateCache();
  }, [history, accountId, effectiveChecksUsed, onCheckComplete]);

  // ── Save rewrite options to sessionStorage + Supabase ─────────────────
  const saveRewriteOptions = useCallback(async (rewrites: any[]) => {
    // 1. Update sessionStorage immediately so rewrites survive navigation
    try {
      const savedResult = sessionStorage.getItem(SESSION_KEY_RESULT);
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        parsed.rewrite_options = rewrites;
        sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(parsed));
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // 2. Persist to Supabase by merging into result_json
    const checkId = lastCheckIdRef.current;
    if (!checkId) return;

    try {
      const { data: current } = await supabase
        .from('compliance_checks')
        .select('result_json')
        .eq('id', checkId)
        .single();

      if (current) {
        await supabase
          .from('compliance_checks')
          .update({
            result_json: { ...current.result_json, rewrite_options: rewrites },
          })
          .eq('id', checkId);
      }
    } catch (err) {
      console.error('Failed to save rewrite options:', err);
    }
  }, []);

  // ── Load a saved check directly (e.g. from sidebar recent checks) ───
  const loadCheck = useCallback((check: SavedComplianceCheck) => {
    if (check.result_json) {
      const normalised = {
        ...check.result_json,
        overall_status: check.overall_status,
        summary: check.result_json.summary ?? check.result_json.overallVerdict ?? '',
        issues: check.result_json.issues ?? [],
      };
      setResult(normalised);
      sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(normalised));
    }
    setLastContent(check.content_text ?? '');
    sessionStorage.setItem(SESSION_KEY_CONTENT, check.content_text ?? '');
    lastCheckIdRef.current = check.id;
    sessionStorage.setItem(SESSION_KEY_CHECK_ID, check.id);
    setStep('complete');
    setError(null);
  }, []);

  // ── Reset checker state (new check) ───────────────────────────────────
  const resetChecker = useCallback(() => {
    setStep('idle');
    setResult(null);
    setLastContent('');
    setError(null);
    setAuthError(false);
    lastCheckIdRef.current = null;
    // Clear session storage so navigating back shows fresh input
    sessionStorage.removeItem(SESSION_KEY_RESULT);
    sessionStorage.removeItem(SESSION_KEY_CONTENT);
    sessionStorage.removeItem(SESSION_KEY_CHECK_ID);
  }, []);

  return {
    step,
    result,
    lastContent,
    error,
    authError,
    history,
    isLoadingHistory,
    usage,
    isLoadingUsage,
    runCheck,
    loadHistory,
    loadCheck,
    deleteCheck,
    resetChecker,
    saveRewriteOptions,
  };
}
