-- MFA Backup Codes table
create table if not exists public.mfa_backup_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for efficient lookup
create index if not exists idx_mfa_backup_codes_user_used
  on public.mfa_backup_codes (user_id, used);

-- Enable RLS
alter table public.mfa_backup_codes enable row level security;

-- Users can only read their own backup codes
create policy "Users can read own backup codes"
  on public.mfa_backup_codes
  for select
  using (auth.uid() = user_id);

-- Users can insert their own backup codes
create policy "Users can insert own backup codes"
  on public.mfa_backup_codes
  for insert
  with check (auth.uid() = user_id);

-- Users can delete their own backup codes
create policy "Users can delete own backup codes"
  on public.mfa_backup_codes
  for delete
  using (auth.uid() = user_id);

-- Users can update their own backup codes (mark as used)
create policy "Users can update own backup codes"
  on public.mfa_backup_codes
  for update
  using (auth.uid() = user_id);
