import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Mail,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { useAccount } from '../context/AccountContext';
import {
  getTeamMembers,
  getTeamMemberCount,
  inviteTeamMember,
  removeTeamMember,
  resendInvitation,
  TeamMember,
} from '../services/teamMemberService';

const TEAM_MEMBER_LIMIT = 10;

const TeamMembers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accountId, plan: accountPlan } = useAccount();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // SECURITY: Never fall back to sessionStorage for plan — it's user-controlled.
  // Only trust the database-backed value from AccountContext.
  const planName = accountPlan || '';
  const isUltra = planName.toLowerCase() === 'ultra';
  const limitReached = members.length >= TEAM_MEMBER_LIMIT;

  useEffect(() => {
    if (user) fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTeamMembers(user.id);
      setMembers(data);
    } catch (err: any) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteEmail.trim()) return;

    clearMessages();
    setInviting(true);

    try {
      await inviteTeamMember(user.id, inviteEmail, accountId);
      setSuccessMessage(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      await fetchMembers();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  };

  const handleResend = async (member: TeamMember) => {
    clearMessages();
    setResendingId(member.id);

    try {
      await resendInvitation(member);
      setSuccessMessage(`Invitation resent to ${member.invited_email}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend invitation.');
    } finally {
      setResendingId(null);
    }
  };

  const handleRemove = async (memberId: string) => {
    clearMessages();
    setRemovingId(memberId);

    try {
      await removeTeamMember(memberId);
      setSuccessMessage('Team member removed.');
      setConfirmRemoveId(null);
      await fetchMembers();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove team member.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Settings */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Team Members
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-0">
            Invite and manage team members on your account
          </p>
          <p className="text-[12px] text-gray-400 mt-2 dark:text-gray-500">
            {members.length} of {TEAM_MEMBER_LIMIT} team members
          </p>
        </div>

        <div className="space-y-3">
          {/* Invite form card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5 md:px-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-950">
                  <UserPlus className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                    Invite a team member
                  </span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">
                    Send an email invitation to join your team
                  </p>
                </div>
              </div>

              {/* Limit reached warning */}
              {limitReached && (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl mb-4 dark:bg-amber-900/20">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 dark:text-amber-400" />
                  <p className="text-[12px] text-amber-700 leading-relaxed dark:text-amber-300">
                    You've reached the maximum of {TEAM_MEMBER_LIMIT} team members for your Ultra plan. Remove an existing member to invite someone new.
                  </p>
                </div>
              )}

              {/* Not Ultra plan info */}
              {!isUltra && (
                <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 rounded-xl mb-4 dark:bg-blue-900/20">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-700 leading-relaxed dark:text-blue-300">
                    Team members are available on the Ultra plan. <button onClick={() => navigate('/change-plan')} className="font-semibold underline hover:no-underline">Upgrade to Ultra</button> to invite up to {TEAM_MEMBER_LIMIT} team members.
                  </p>
                </div>
              )}

              <form onSubmit={handleInvite} className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => { setInviteEmail(e.target.value); clearMessages(); }}
                    placeholder="colleague@example.com"
                    disabled={!isUltra || limitReached}
                    className="w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviting || !isUltra || limitReached || !inviteEmail.trim()}
                  className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 whitespace-nowrap"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send invite'
                  )}
                </button>
              </form>

              {/* Success message */}
              {successMessage && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 rounded-xl dark:bg-green-900/20">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 dark:text-green-400" />
                  <p className="text-[12px] text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-xl dark:bg-red-900/20">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 dark:text-red-400" />
                  <p className="text-[12px] text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Team members list card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5 md:px-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center dark:bg-purple-950">
                  <Users className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                    Current team members
                  </span>
                  <p className="text-[12px] text-gray-400 mt-0.5 dark:text-gray-500">
                    {members.length} member{members.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2 dark:text-gray-600" />
                  <p className="text-[13px] text-gray-400 dark:text-gray-500">
                    No team members yet. Send an invitation to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {members.map((member, index) => (
                    <div key={member.id}>
                      {index > 0 && (
                        <div className="border-t border-black/[0.04] dark:border-gray-700/50" />
                      )}
                      <div className="flex items-center justify-between py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 dark:bg-gray-700">
                            <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              {member.invited_email.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-gray-700 truncate dark:text-gray-300">
                              {member.invited_email}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">
                              Invited {new Date(member.created_at).toLocaleDateString('en-AU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          {/* Status badge */}
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              member.status === 'active'
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}
                          >
                            {member.status === 'active' ? 'Active' : 'Pending'}
                          </span>

                          {/* Resend button (pending only) */}
                          {member.status === 'pending' && (
                            <button
                              onClick={() => handleResend(member)}
                              disabled={resendingId === member.id}
                              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                              title="Resend invitation"
                            >
                              {resendingId === member.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Remove button */}
                          {confirmRemoveId === member.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleRemove(member.id)}
                                disabled={removingId === member.id}
                                className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                              >
                                {removingId === member.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Confirm'
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmRemoveId(null)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmRemoveId(member.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors dark:hover:text-red-400 dark:hover:bg-red-900/20"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default TeamMembers;
