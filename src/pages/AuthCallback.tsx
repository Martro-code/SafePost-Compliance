import React, { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { trackLogin, trackSignUp } from '../services/analytics';

function getPostAuthRedirect(): string {
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

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically exchanges the token from the URL hash
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Track Google auth — new users have created_at ≈ last_sign_in_at
        const user = session.user;
        const isNewUser = user.created_at && user.last_sign_in_at &&
          Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 10000;
        if (isNewUser) {
          trackSignUp('google');
        } else {
          trackLogin('google');
        }
        sessionStorage.setItem('safepost_session_active', 'true');
        window.location.replace(getPostAuthRedirect());
        return;
      }

      // If the session isn't ready yet, wait for the auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          const isNewUser = user.created_at && user.last_sign_in_at &&
            Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 10000;
          if (isNewUser) {
            trackSignUp('google');
          } else {
            trackLogin('google');
          }
          sessionStorage.setItem('safepost_session_active', 'true');
          subscription.unsubscribe();
          window.location.replace(getPostAuthRedirect());
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
