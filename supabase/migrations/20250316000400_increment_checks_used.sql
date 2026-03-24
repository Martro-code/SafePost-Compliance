-- RPC function to atomically increment checks_used on an account.
-- Called from the frontend after a compliance check is saved.
create or replace function public.increment_checks_used(p_account_id uuid)
returns void
language sql
security definer
as $$
  update public.accounts
  set checks_used = checks_used + 1
  where id = p_account_id;
$$;
