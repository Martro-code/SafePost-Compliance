import { useEffect, useState } from 'react';
import { supabase } from './src/services/supabaseClient';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userEmail = user?.email || '';
  const firstName = (user?.user_metadata?.first_name as string) || '';
  const surname = (user?.user_metadata?.surname as string) || '';

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, userEmail, firstName, surname, loading, signOut };
}
