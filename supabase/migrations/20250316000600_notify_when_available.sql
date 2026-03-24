-- Table to capture "Notify me when available" email signups from pricing pages
create table if not exists public.notify_when_available (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  plan_name text not null,
  created_at timestamp with time zone default now() not null
);

-- Allow anonymous inserts so unauthenticated visitors can sign up
alter table public.notify_when_available enable row level security;

create policy "Allow anonymous inserts"
  on public.notify_when_available
  for insert
  to anon, authenticated
  with check (true);

-- Prevent public reads – only service_role should query this table
create policy "Deny public reads"
  on public.notify_when_available
  for select
  to anon, authenticated
  using (false);
