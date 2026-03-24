import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { supabase } from '../services/supabaseClient';

const UpdateCard: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError('Not authenticated. Please sign in.');
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-billing-portal-session`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
          },
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || 'Failed to open billing portal.');
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
    };

    redirect();
  }, []);

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <div className="flex flex-col items-center justify-center py-20">
          {error ? (
            <div className="text-center">
              <p className="text-[14px] text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => navigate('/billing')}
                className="text-[14px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
              >
                Back to Billing
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-[14px] text-gray-500 dark:text-gray-400">
                Redirecting to Stripe billing portal…
              </p>
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdateCard;
