import { supabase } from './supabaseClient';

export interface TeamMember {
  id: string;
  account_owner_id: string;
  invited_email: string;
  status: 'pending' | 'active';
  member_user_id: string | null;
  invitation_token: string;
  created_at: string;
}

const TEAM_MEMBER_LIMIT = 10;

/**
 * Fetch all team members for the current account owner.
 */
export async function getTeamMembers(ownerId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('account_owner_id', ownerId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as TeamMember[]) || [];
}

/**
 * Get the current count of team members for plan enforcement.
 */
export async function getTeamMemberCount(ownerId: string): Promise<number> {
  const { count, error } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('account_owner_id', ownerId);

  if (error) throw error;
  return count ?? 0;
}

/**
 * Invite a new team member by email.
 * Creates records in both team_members (invitation flow) and account_members (identity model).
 */
export async function inviteTeamMember(
  ownerId: string,
  email: string,
  accountId?: string | null
): Promise<TeamMember> {
  // Enforce the 10-member limit
  const currentCount = await getTeamMemberCount(ownerId);
  if (currentCount >= TEAM_MEMBER_LIMIT) {
    throw new Error(
      `You've reached the maximum of ${TEAM_MEMBER_LIMIT} team members for your Ultra plan.`
    );
  }

  const { data, error } = await supabase
    .from('team_members')
    .insert({
      account_owner_id: ownerId,
      invited_email: email.toLowerCase().trim(),
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email has already been invited to your team.');
    }
    throw error;
  }

  // Also create a pending account_members row for the two-tier identity model
  if (accountId) {
    await supabase
      .from('account_members')
      .insert({
        account_id: accountId,
        invited_email: email.toLowerCase().trim(),
        role: 'member',
        status: 'pending',
      })
      .then(({ error: amError }) => {
        if (amError && amError.code !== '23505') {
          console.error('Failed to create account_members row:', amError);
        }
      });
  }

  // Send invitation email via Supabase magic link
  // The invite link will direct the user to /accept-invitation?token=<token>
  const siteUrl = window.location.origin;
  const inviteLink = `${siteUrl}/accept-invitation?token=${data.invitation_token}`;

  const { error: emailError } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: inviteLink,
      data: {
        invitation_token: data.invitation_token,
        invited_by: ownerId,
      },
    },
  });

  if (emailError) {
    // Clean up the team member record if email fails
    await supabase.from('team_members').delete().eq('id', data.id);
    throw new Error(`Failed to send invitation email: ${emailError.message}`);
  }

  return data as TeamMember;
}

/**
 * Resend an invitation email for a pending team member.
 */
export async function resendInvitation(member: TeamMember): Promise<void> {
  const siteUrl = window.location.origin;
  const inviteLink = `${siteUrl}/accept-invitation?token=${member.invitation_token}`;

  const { error } = await supabase.auth.signInWithOtp({
    email: member.invited_email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: inviteLink,
      data: {
        invitation_token: member.invitation_token,
        invited_by: member.account_owner_id,
      },
    },
  });

  if (error) throw new Error(`Failed to resend invitation: ${error.message}`);
}

/**
 * Remove a team member (cancel invitation or revoke access).
 * Also removes the corresponding account_members row.
 */
export async function removeTeamMember(memberId: string): Promise<void> {
  // Get the member info before deleting
  const { data: member } = await supabase
    .from('team_members')
    .select('invited_email')
    .eq('id', memberId)
    .single();

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;

  // Also remove from account_members
  if (member?.invited_email) {
    await supabase
      .from('account_members')
      .delete()
      .eq('invited_email', member.invited_email)
      .eq('role', 'member');
  }
}

/**
 * Accept an invitation using the invitation token.
 * Called after the invited user has signed in / created their account.
 */
export async function acceptInvitation(
  token: string,
  userId: string
): Promise<TeamMember> {
  // First look up the invitation by token
  const { data: member, error: fetchError } = await supabase
    .from('team_members')
    .select('*')
    .eq('invitation_token', token)
    .single();

  if (fetchError || !member) {
    throw new Error('Invitation not found or has already been used.');
  }

  if (member.status === 'active') {
    throw new Error('This invitation has already been accepted.');
  }

  // Update the record to active
  const { data: updated, error: updateError } = await supabase
    .from('team_members')
    .update({
      status: 'active',
      member_user_id: userId,
    })
    .eq('id', member.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return updated as TeamMember;
}

/**
 * Look up an invitation by token (for displaying invitation details).
 */
export async function getInvitationByToken(
  token: string
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('invitation_token', token)
    .single();

  if (error) return null;
  return data as TeamMember;
}
