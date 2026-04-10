import React, { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { trackLogin, trackSignUp } from '../services/analytics';

function getPostAuthRedirect(): string {
  // Check for a one-off pending redirect (e.g. audit standalone purchase flow)
  try {
    const pendingRedirect = localStorage.getItem('safepost_pending_redirect');
    if (pendingRedirect) {
      localStorage.removeItem('safepost_pending_redirect');
      return pendingRedirect;
    }
  } catch {
    localStorage.removeItem('safepost_pending_redirect');
  }

  try {
    const raw = localStorage.getItem('safepost_pending_checkout');
    if (raw) {
      const { plan, billing } = JSON.parse(raw);
      if (plan && plan !== 'starter') {
        localStorage.removeItem('safepost_pending_checkout');
        return `/checkout?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(billing || 'monthly')}`;
      }
      localStorage.removeItem('safepost_pending_checkout');
    }
  } catch {
    localStorage.removeItem('safepost_pending_checkout');
  }
  return '/dashboard';
}

async function redirectAfterAuth(session: { access_token: string }, isNewUser: boolean): Promise<void> {
  if (isNewUser) {
    trackSignUp('google');
  } else {
    trackLogin('google');
  }
  sessionStorage.setItem('safepost_session_active', 'true');

  // If the user came from an audit pricing CTA, initiate Stripe checkout now
  // that they have an active session.
  const pendingAuditRedirect = localStorage.getItem('safepost_pending_audit_redirect');
  if (pendingAuditRedirect === 'audit-standard' || pendingAuditRedirect === 'audit-extended') {
    localStorage.removeItem('safepost_pending_audit_redirect');
    const productType = pendingAuditRedirect === 'audit-extended' ? 'audit_extended' : 'audit';
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ productType }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.url) {
          window.location.replace(data.url);
          return;
        }
      }
    } catch {
      // fall through to normal redirect
    }
  }

  window.location.replace(getPostAuthRedirect());
}

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically exchanges the token from the URL hash
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;
        const isNewUser = !!(user.created_at && user.last_sign_in_at &&
          Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 10000);
        await redirectAfterAuth(session, isNewUser);
        return;
      }

      // If the session isn't ready yet, wait for the auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          const isNewUser = !!(user.created_at && user.last_sign_in_at &&
            Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 10000);
          subscription.unsubscribe();
          await redirectAfterAuth(session, isNewUser);
        }
      });

      // Fallback: if no session is established within 5 seconds, redirect to login
      setTimeout(() => {
        subscription.unsubscribe();
        window.location.replace('/login');
      }, 5000);
    };

    handleCallback();
  }, []);

  return null;
};

export default AuthCallback;
