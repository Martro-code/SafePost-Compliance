-- Enable Row Level Security on the accounts table
alter table public.accounts enable row level security;

-- Allow account owners to read their own account
create policy "Owners can view their own account"
  on public.accounts for select
  using (owner_user_id = auth.uid());

-- Allow account owners to update ONLY non-sensitive columns on their own account.
-- The RLS policy restricts row access; column-level privileges below restrict
-- which columns authenticated users may write to.
create policy "Owners can update their own account"
  on public.accounts for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- Lock down sensitive billing/plan columns so only the service role can modify them.
-- Revoke blanket UPDATE first, then grant UPDATE only on safe profile columns.
revoke update on public.accounts from authenticated;
grant update (
  first_name,
  last_name,
  billing_email,
  abn,
  abn_entity_name
) on public.accounts to authenticated;

-- Allow authenticated users to insert their own account (auto-provisioning)
create policy "Users can create their own account"
  on public.accounts for insert
  with check (owner_user_id = auth.uid());
