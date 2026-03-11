import { useEffect } from 'react';
import { supabase } from './src/services/supabaseClient';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically exchanges the token from the URL hash
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        sessionStorage.setItem('safepost_session_active', 'true');
        window.location.replace('/dashboard');
        return;
      }

      // If the session isn't ready yet, wait for the auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          sessionStorage.setItem('safepost_session_active', 'true');
          subscription.unsubscribe();
          window.location.replace('/dashboard');
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
