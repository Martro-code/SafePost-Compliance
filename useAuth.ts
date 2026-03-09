import { useEffect, useState } from 'react';
import { supabase } from './src/services/supabaseClient';
import type { User } from '@supabase/supabase-js';

export let isLoggingOut = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect if user is arriving from an email verification link
    const hash = window.location.hash;
    const isEmailVerification = hash.includes('access_token') && (hash.includes('type=signup') || hash.includes('type=email'));

    supabase.auth.getSession().then(({ data: { session } }) => {
      // If arriving from email verification, preserve the session and redirect to dashboard
      if (isEmailVerification && session?.user) {
        sessionStorage.setItem('safepost_session_active', 'true');
        window.location.replace('/dashboard');
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
      // Restore plan from user_metadata if sessionStorage is empty (e.g. after page refresh)
      if (session?.user) {
        const metaPlan = session.user.user_metadata?.plan as string | undefined;
        const metaBilling = session.user.user_metadata?.billing as string | undefined;
        if (metaPlan && !sessionStorage.getItem('safepost_plan')) {
          sessionStorage.setItem('safepost_plan', metaPlan);
        }
        if (metaBilling && !sessionStorage.getItem('safepost_billing')) {
          sessionStorage.setItem('safepost_billing', metaBilling);
        }
      }
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
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT' && isLoggingOut) {
        setTimeout(() => { isLoggingOut = false; }, 500);
      }
      // Restore plan from user_metadata into sessionStorage on login
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const metaPlan = session.user.user_metadata?.plan as string | undefined;
        const metaBilling = session.user.user_metadata?.billing as string | undefined;
        if (metaPlan && !sessionStorage.getItem('safepost_plan')) {
          sessionStorage.setItem('safepost_plan', metaPlan);
        }
        if (metaBilling && !sessionStorage.getItem('safepost_billing')) {
          sessionStorage.setItem('safepost_billing', metaBilling);
        }
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
    sessionStorage.removeItem('safepost_session_active');
    await supabase.auth.signOut();
  };

  return { user, userEmail, firstName, surname, mobileNumber, practiceName, streetAddress, suburb, userState, postcode, loading, signOut };
}
