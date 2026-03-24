-- Enable Row Level Security on the accounts table
alter table public.accounts enable row level security;

-- Allow account owners to read their own account
create policy "Owners can view their own account"
  on public.accounts for select
  using (owner_user_id = auth.uid());

-- Allow account owners to update their own account (plan, checks_used, etc.)
create policy "Owners can update their own account"
  on public.accounts for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- Allow authenticated users to insert their own account (auto-provisioning)
create policy "Users can create their own account"
  on public.accounts for insert
  with check (owner_user_id = auth.uid());
