import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

export let isLoggingOut = false;
export let isPasswordRecovery = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect if user is arriving from an email verification or password recovery link
    const hash = window.location.hash;
    const isEmailVerification = hash.includes('access_token') && (hash.includes('type=signup') || hash.includes('type=email'));
    const isRecovery = hash.includes('access_token') && hash.includes('type=recovery');

    if (isRecovery) {
      isPasswordRecovery = true;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      // If arriving from email verification, preserve the session and redirect to dashboard
      if (isEmailVerification && session?.user) {
        sessionStorage.setItem('safepost_session_active', 'true');
        window.location.replace('/dashboard');
        return;
      }

      // If arriving from password recovery link, establish the session and stay on the page
      if (isRecovery && session?.user) {
        sessionStorage.setItem('safepost_session_active', 'true');
        setUser(session.user);
        setLoading(false);
        return;
      }

      // If we detected a verification/recovery hash but the session isn't ready yet,
      // keep loading=true so ProtectedRoute doesn't redirect to /login.
      // The onAuthStateChange listener below will handle it once
      // Supabase finishes processing the token from the URL hash.
      if (isEmailVerification || isRecovery) {
        return;
      }

      // If a session exists but "Remember me" was not checked and the browser
      // was closed (sessionStorage marker is gone), sign the user out.
      if (
        session?.user &&
        !localStorage.getItem('safepost_remember_me') &&
        !sessionStorage.getItem('safepost_session_active')
      ) {
        supabase.auth.signOut().then(() => {
          setUser(null);
          setLoading(false);
        });
        return;
      }

      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Redirect to dashboard when signing in from an email verification link
      if (event === 'SIGNED_IN' && session?.user) {
        const currentHash = window.location.hash;
        const isVerificationRedirect = currentHash.includes('type=signup') || currentHash.includes('type=email');
        if (isVerificationRedirect) {
          sessionStorage.setItem('safepost_session_active', 'true');
          window.location.replace('/dashboard');
          return;
        }
      }
      // Handle password recovery event — establish session and stay on page
      if (event === 'PASSWORD_RECOVERY' && session?.user) {
        isPasswordRecovery = true;
        sessionStorage.setItem('safepost_session_active', 'true');
        setUser(session.user);
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT' && isLoggingOut) {
        setTimeout(() => { isLoggingOut = false; }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const userEmail = user?.email || '';
  const firstName = (user?.user_metadata?.first_name as string) || '';
  const surname = (user?.user_metadata?.surname as string) || '';
  const mobileNumber = (user?.user_metadata?.mobile_number as string) || '';
  const practiceName = (user?.user_metadata?.practice_name as string) || '';
  const streetAddress = (user?.user_metadata?.street_address as string) || '';
  const suburb = (user?.user_metadata?.suburb as string) || '';
  const userState = (user?.user_metadata?.state as string) || '';
  const postcode = (user?.user_metadata?.postcode as string) || '';

  const signOut = async () => {
    isLoggingOut = true;
    localStorage.removeItem('safepost_remember_me');
    sessionStorage.clear();
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('supabase.auth.signOut() failed:', err);
      // Even if signOut fails, clear local user state so the UI
      // doesn't stay stuck in a logged-in state.
      setUser(null);
    }
  };

  return { user, userEmail, firstName, surname, mobileNumber, practiceName, streetAddress, suburb, userState, postcode, loading, signOut };
}
