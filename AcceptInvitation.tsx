import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Lock } from 'lucide-react';
import { supabase } from './src/services/supabaseClient';
import { acceptInvitation, getInvitationByToken } from './src/services/teamMemberService';

const AcceptInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [step, setStep] = useState<'loading' | 'set-password' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid invitation link. No token provided.');
      setStep('error');
      return;
    }

    checkInvitation();
  }, [token]);

  const checkInvitation = async () => {
    try {
      // Check if the user already has a session (came from the magic link)
      const { data: { session } } = await supabase.auth.getSession();

      const invitation = await getInvitationByToken(token);

      if (!invitation) {
        setErrorMessage('This invitation link is invalid or has expired.');
        setStep('error');
        return;
      }

      if (invitation.status === 'active') {
        setErrorMessage('This invitation has already been accepted.');
        setStep('error');
        return;
      }

      setInvitedEmail(invitation.invited_email);

      if (session?.user) {
        // User is already signed in from the magic link — prompt for password
        setStep('set-password');
      } else {
        // User hasn't authenticated yet — prompt for password setup
        setStep('set-password');
      }
    } catch {
      setErrorMessage('Something went wrong loading your invitation.');
      setStep('error');
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Update the user's password
      const { error: pwError } = await supabase.auth.updateUser({
        password,
      });

      if (pwError) throw pwError;

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unable to retrieve your account.');

      // Accept the invitation (updates team_members)
      await acceptInvitation(token, user.id);

      // Link user to the account via account_members
      // Find the account_members row for this invited email and activate it
      const { data: pendingMember } = await supabase
        .from('account_members')
        .select('id, account_id')
        .eq('invited_email', invitedEmail.toLowerCase())
        .eq('status', 'pending')
        .limit(1)
        .single();

      if (pendingMember) {
        await supabase
          .from('account_members')
          .update({ user_id: user.id, status: 'active' })
          .eq('id', pendingMember.id);

        // Store the account's plan in sessionStorage for immediate use
        const { data: account } = await supabase
          .from('accounts')
          .select('plan')
          .eq('id', pendingMember.account_id)
          .single();

        if (account?.plan) {
          sessionStorage.setItem('safepost_plan', account.plan);
        }
      }

      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to accept invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f4] dark:bg-gray-900 px-6">
      <div className="w-full max-w-md">
        {/* Loading state */}
        {step === 'loading' && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-gray-500 dark:text-gray-400">Loading your invitation...</p>
          </div>
        )}

        {/* Set password step */}
        {step === 'set-password' && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 dark:bg-blue-950">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Join your team</h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                You've been invited to join a SafePost team as <span className="font-medium text-gray-700 dark:text-gray-300">{invitedEmail}</span>
              </p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                  Create a password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-11 px-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full h-11 px-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                  minLength={8}
                />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl dark:bg-red-900/20">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining team...
                  </>
                ) : (
                  'Set password & join team'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Success state */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 dark:bg-green-950">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're in!</h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
              You've successfully joined the team. You can now access the dashboard.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Error state */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 dark:bg-red-950">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invitation error</h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
