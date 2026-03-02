-- Migration: Create team_members table
-- Run this SQL in your Supabase SQL Editor before deploying the code changes.

-- Table to manage team member invitations and memberships
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  account_owner_id uuid references auth.users(id) on delete cascade not null,
  invited_email text not null,
  status text not null default 'pending' check (status in ('pending', 'active')),
  member_user_id uuid references auth.users(id) on delete set null,
  invitation_token uuid default gen_random_uuid() not null unique,
  created_at timestamptz default now() not null,

  -- Prevent duplicate invitations for the same email under the same owner
  unique(account_owner_id, invited_email)
);

-- Enable Row Level Security
alter table team_members enable row level security;

-- Account owners can view their own team members
create policy "Owners can view their team members"
  on team_members for select
  using (auth.uid() = account_owner_id);

-- Account owners can insert team members (invitations)
create policy "Owners can invite team members"
  on team_members for insert
  with check (auth.uid() = account_owner_id);

-- Account owners can update their own team members (e.g. resend invite)
create policy "Owners can update their team members"
  on team_members for update
  using (auth.uid() = account_owner_id);

-- Account owners can delete (remove) their own team members
create policy "Owners can remove their team members"
  on team_members for delete
  using (auth.uid() = account_owner_id);

-- Invited users can view invitations sent to their email (for acceptance flow)
create policy "Invited users can view their invitations"
  on team_members for select
  using (lower(invited_email) = lower(auth.email()));

-- Invited users can update their own invitation (to set status to active)
create policy "Invited users can accept their invitations"
  on team_members for update
  using (lower(invited_email) = lower(auth.email()));

-- Create an index for faster lookups by invitation token
create index if not exists idx_team_members_invitation_token on team_members (invitation_token);

-- Create an index for faster lookups by account owner
create index if not exists idx_team_members_account_owner on team_members (account_owner_id);
