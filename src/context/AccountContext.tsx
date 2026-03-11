import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

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
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<'owner' | 'member' | null>(null);
  const [plan, setPlan] = useState('starter');
  const [billingPeriod, setBillingPeriod] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const [cancelDate, setCancelDate] = useState('');
  const [checksUsed, setChecksUsed] = useState(0);
  const [checksLimit, setChecksLimit] = useState<number | null>(3);
  const [accountLoading, setAccountLoading] = useState(true);

  const loadAccount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccountId(null);
        setRole(null);
        setPlan('starter');
        setChecksUsed(0);
        setChecksLimit(3);
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
        .single();

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
          setAccountId(account.id);
          setRole(membership.role as 'owner' | 'member');
          setPlan(account.plan || 'starter');
          setBillingPeriod(account.billing_period || '');
          setCancelled(account.plan === 'starter' && !!account.billing_period);
          setChecksUsed(account.checks_used ?? 0);
          setChecksLimit(account.checks_limit);
          setAccountLoading(false);
          return;
        }
      }

      // No account found — auto-provision for this user (new or legacy)
      const userPlan = (user.user_metadata?.plan as string) || sessionStorage.getItem('safepost_plan') || 'starter';
      const limit = checksLimitForPlan(userPlan);

      const { data: newAccount, error: insertError } = await supabase
        .from('accounts')
        .insert({
          owner_user_id: user.id,
          plan: userPlan,
          checks_used: 0,
          checks_limit: limit,
          billing_email: user.email,
          first_name: user.user_metadata?.firstName || user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.surname || user.user_metadata?.last_name || '',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create account:', insertError);
        // Fallback: use plan from metadata
        setPlan(userPlan);
        setChecksLimit(limit);
        setAccountLoading(false);
        return;
      }

      // Create account_members row
      const { error: memberInsertError } = await supabase
        .from('account_members')
        .insert({
          account_id: newAccount.id,
          user_id: user.id,
          role: 'owner',
          status: 'active',
          invited_email: user.email,
        });
      if (memberInsertError) {
        console.error('Failed to insert account_members row:', memberInsertError);
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
        .update({ account_id: newAccount.id })
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
        .eq('account_id', newAccount.id)
        .gte('created_at', startOfMonth);

      const actualUsed = count ?? 0;
      if (actualUsed > 0) {
        const { error: updateUsedError } = await supabase
          .from('accounts')
          .update({ checks_used: actualUsed })
          .eq('id', newAccount.id);
        if (updateUsedError) {
          console.error('Failed to update checks_used on account:', updateUsedError);
        }
      }

      setAccountId(newAccount.id);
      setRole('owner');
      setPlan(userPlan);
      setBillingPeriod('');
      setChecksUsed(actualUsed);
      setChecksLimit(limit);
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
      setPlan(account.plan || 'starter');
      setBillingPeriod(account.billing_period || '');
      setChecksUsed(account.checks_used ?? 0);
      setChecksLimit(account.checks_limit);
    }
  }, [accountId]);

  return (
    <AccountContext.Provider value={{ accountId, role, plan, billingPeriod, cancelled, cancelDate, checksUsed, checksLimit, accountLoading, refreshAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
