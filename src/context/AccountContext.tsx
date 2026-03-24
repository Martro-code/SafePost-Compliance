import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { sanitizeObject } from '../utils/sanitizeInput';

const ACCOUNT_CACHE_KEY = 'safepost_account_cache';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AccountCache {
  accountId: string;
  plan: string;
  billingPeriod: string;
  checksUsed: number;
  checksLimit: number | null;
  cachedAt: number;
}

function readAccountCache(): AccountCache | null {
  try {
    const raw = localStorage.getItem(ACCOUNT_CACHE_KEY);
    if (!raw) return null;
    const parsed: AccountCache = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(ACCOUNT_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeAccountCache(data: Omit<AccountCache, 'cachedAt'>) {
  try {
    localStorage.setItem(ACCOUNT_CACHE_KEY, JSON.stringify({ ...data, cachedAt: Date.now() }));
  } catch {
    // localStorage may be unavailable — silently ignore
  }
}

const PLAN_LIMITS: Record<string, number | null> = {
  free: 3,
  starter: 3,
  professional: 30,
  pro_plus: 100,
  ultra: null,
};

function checksLimitForPlan(plan: string): number | null {
  const key = plan?.toLowerCase() ?? 'starter';
  return key in PLAN_LIMITS ? PLAN_LIMITS[key] : 3;
}

export interface AccountContextType {
  accountId: string | null;
  role: 'owner' | 'member' | null;
  plan: string;
  billingPeriod: string;
  cancelled: boolean;
  cancelDate: string;
  checksUsed: number;
  checksLimit: number | null;
  accountLoading: boolean;
  refreshAccount: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType>({
  accountId: null,
  role: null,
  plan: 'starter',
  billingPeriod: '',
  cancelled: false,
  cancelDate: '',
  checksUsed: 0,
  checksLimit: 3,
  accountLoading: true,
  refreshAccount: async () => {},
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = readAccountCache();
  const [accountId, setAccountId] = useState<string | null>(cached?.accountId ?? null);
  const [role, setRole] = useState<'owner' | 'member' | null>(null);
  const [plan, setPlan] = useState(cached?.plan ?? 'starter');
  const [billingPeriod, setBillingPeriod] = useState(cached?.billingPeriod ?? '');
  const [cancelled, setCancelled] = useState(false);
  const [cancelDate, setCancelDate] = useState('');
  const [checksUsed, setChecksUsed] = useState(cached?.checksUsed ?? 0);
  const [checksLimit, setChecksLimit] = useState<number | null>(cached?.checksLimit ?? 3);
  const [accountLoading, setAccountLoading] = useState(!cached);

  const loadAccount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Only reset to defaults if there's no cached data.
        // Real sign-outs are handled by the SIGNED_OUT event handler which
        // explicitly clears both state and cache. Resetting here when the
        // auth session hasn't restored yet would wipe cached values and
        // cause a visible flash of zeros on the dashboard.
        if (!readAccountCache()) {
          setAccountId(null);
          setRole(null);
          setPlan('starter');
          setChecksUsed(0);
          setChecksLimit(3);
        }
        setAccountLoading(false);
        return;
      }

      // Try to find existing account membership
      const { data: membership, error: memberError } = await supabase
        .from('account_members')
        .select('account_id, role')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      if (membership && !memberError) {
        // Found membership — load the account
        const { data: account, error: accountFetchError } = await supabase
          .from('accounts')
          .select('id, plan, billing_period, checks_used, checks_limit')
          .eq('id', membership.account_id)
          .single();
        if (accountFetchError) {
          console.error('Failed to fetch account for membership:', accountFetchError);
        }

        if (account) {
          // Reconcile checks_used with actual compliance checks this month
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          const { count: actualCount } = await supabase
            .from('compliance_checks')
            .select('*', { count: 'exact', head: true })
            .eq('account_id', account.id)
            .gte('created_at', startOfMonth);

          const reconciledUsed = actualCount ?? account.checks_used ?? 0;

          // If stored value is stale, update it in the DB
          if (reconciledUsed !== (account.checks_used ?? 0)) {
            supabase
              .from('accounts')
              .update({ checks_used: reconciledUsed })
              .eq('id', account.id)
              .then(({ error: updateErr }) => {
                if (updateErr) console.error('Failed to reconcile checks_used:', updateErr);
              });
          }

          setAccountId(account.id);
          setRole(membership.role as 'owner' | 'member');
          setPlan(account.plan || 'starter');
          setBillingPeriod(account.billing_period || '');
          setCancelled(account.plan === 'starter' && !!account.billing_period);
          setChecksUsed(reconciledUsed);
          setChecksLimit(account.checks_limit);
          writeAccountCache({
            accountId: account.id,
            plan: account.plan || 'starter',
            billingPeriod: account.billing_period || '',
            checksUsed: reconciledUsed,
            checksLimit: account.checks_limit,
          });
          setAccountLoading(false);
          return;
        }
      }

      // No account found — auto-provision for this user (new or legacy)
      const userPlan = (user.user_metadata?.plan as string) || sessionStorage.getItem('safepost_plan') || 'starter';
      const limit = checksLimitForPlan(userPlan);

      const { error: upsertError } = await supabase
        .from('accounts')
        .upsert(
          sanitizeObject({
            owner_user_id: user.id,
            plan: userPlan,
            checks_used: 0,
            checks_limit: limit,
            billing_email: user.email,
            first_name: user.user_metadata?.firstName || user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.surname || user.user_metadata?.last_name || '',
            abn: user.user_metadata?.abn || null,
            abn_entity_name: user.user_metadata?.abn_entity_name || null,
          }),
          { onConflict: 'owner_user_id', ignoreDuplicates: true }
        );

      if (upsertError) {
        console.error('Failed to create account:', upsertError);
      }

      // Always re-fetch the account separately to avoid the PostgREST 406
      // error caused by ignoreDuplicates + .select().single() returning
      // zero rows when the row already exists.
      const { data: resolvedAccount, error: fetchError } = await supabase
        .from('accounts')
        .select('id, plan, billing_period, checks_used, checks_limit')
        .eq('owner_user_id', user.id)
        .single();

      if (fetchError || !resolvedAccount) {
        console.error('Failed to fetch account after upsert:', fetchError);
        setPlan(userPlan);
        setChecksLimit(limit);
        setAccountLoading(false);
        return;
      }

      // Create account_members row
      const { error: memberInsertError } = await supabase
        .from('account_members')
        .upsert(
          sanitizeObject({
            account_id: resolvedAccount.id,
            user_id: user.id,
            role: 'owner',
            status: 'active',
            invited_email: user.email,
          }),
          { onConflict: 'account_id,user_id', ignoreDuplicates: true }
        );
      if (memberInsertError) {
        console.error('Failed to upsert account_members row:', memberInsertError);
      }

      // Initialise onboarding email sequence for new Starter (free) users
      if (userPlan === 'starter') {
        try {
          await supabase.functions.invoke('initialise-onboarding-sequence', {
            body: { user_id: user.id, plan_tier: 'starter' },
          });
        } catch (e) {
          console.error('Failed to initialise onboarding sequence:', e);
        }
      }

      // Backfill account_id on existing compliance_checks for this user
      const { error: backfillError } = await supabase
        .from('compliance_checks')
        .update({ account_id: resolvedAccount.id })
        .eq('user_id', user.id)
        .is('account_id', null);
      if (backfillError) {
        console.error('Failed to backfill compliance_checks account_id:', backfillError);
      }

      // Count this month's existing checks and set checks_used
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count } = await supabase
        .from('compliance_checks')
        .select('*', { count: 'exact', head: true })
        .eq('account_id', resolvedAccount.id)
        .gte('created_at', startOfMonth);

      const actualUsed = count ?? 0;
      if (actualUsed > 0) {
        const { error: updateUsedError } = await supabase
          .from('accounts')
          .update({ checks_used: actualUsed })
          .eq('id', resolvedAccount.id);
        if (updateUsedError) {
          console.error('Failed to update checks_used on account:', updateUsedError);
        }
      }

      setAccountId(resolvedAccount.id);
      setRole('owner');
      setPlan(userPlan);
      setBillingPeriod('');
      setChecksUsed(actualUsed);
      setChecksLimit(limit);
      writeAccountCache({
        accountId: resolvedAccount.id,
        plan: userPlan,
        billingPeriod: '',
        checksUsed: actualUsed,
        checksLimit: limit,
      });
    } catch (err) {
      console.error('Failed to load account:', err);
    } finally {
      setAccountLoading(false);
    }
  }, []);

  // Load account on mount
  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  // Re-load when auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadAccount();
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(ACCOUNT_CACHE_KEY);
        setAccountId(null);
        setRole(null);
        setPlan('starter');
        setChecksUsed(0);
        setChecksLimit(3);
        setAccountLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadAccount]);

  const refreshAccount = useCallback(async () => {
    if (!accountId) return;
    const { data: account } = await supabase
      .from('accounts')
      .select('plan, billing_period, checks_used, checks_limit')
      .eq('id', accountId)
      .single();

    if (account) {
      // Reconcile checks_used with actual compliance checks this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count: actualCount } = await supabase
        .from('compliance_checks')
        .select('*', { count: 'exact', head: true })
        .eq('account_id', accountId)
        .gte('created_at', startOfMonth);

      const reconciledUsed = actualCount ?? account.checks_used ?? 0;

      setPlan(account.plan || 'starter');
      setBillingPeriod(account.billing_period || '');
      setChecksUsed(reconciledUsed);
      setChecksLimit(account.checks_limit);
      writeAccountCache({
        accountId,
        plan: account.plan || 'starter',
        billingPeriod: account.billing_period || '',
        checksUsed: reconciledUsed,
        checksLimit: account.checks_limit,
      });
    }
  }, [accountId]);

  return (
    <AccountContext.Provider value={{ accountId, role, plan, billingPeriod, cancelled, cancelDate, checksUsed, checksLimit, accountLoading, refreshAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
