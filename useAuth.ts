import { useEffect, useState } from 'react';
import { supabase } from './src/services/supabaseClient';
import type { User } from '@supabase/supabase-js';

export let isLoggingOut = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    await supabase.auth.signOut();
  };

  return { user, userEmail, firstName, surname, mobileNumber, practiceName, streetAddress, suburb, userState, postcode, loading, signOut };
}
