-- Security fix: tighten the UPDATE RLS policy on accounts and expand the
-- safe-column grant to include all user-editable profile fields.
--
-- Sensitive columns (plan, checks_used, checks_limit, stripe_customer_id,
-- stripe_subscription_id, billing_period, owner_user_id) are deliberately
-- excluded — only the service role (used by Edge Functions / Stripe webhooks)
-- may modify them.

-- 1. Drop the existing UPDATE policy (overly broad — allowed row-level
--    access but relied solely on column-level grants for protection).
drop policy if exists "Owners can update their own account" on public.accounts;

-- 2. Recreate the UPDATE policy with explicit owner check.
create policy "Owners can update their own account"
  on public.accounts for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- 3. Revoke blanket UPDATE and re-grant only safe profile columns.
revoke update on public.accounts from authenticated;

grant update (
  practice_name,
  first_name,
  last_name,
  mobile,
  address,
  suburb,
  state,
  postcode,
  abn,
  abn_entity_name
) on public.accounts to authenticated;

-- 4. Add a decrement_checks_used RPC so the frontend can adjust the counter
--    without needing direct UPDATE access to checks_used.
create or replace function public.decrement_checks_used(p_account_id uuid)
returns void
language sql
security definer
as $$
  update public.accounts
  set checks_used = greatest(checks_used - 1, 0)
  where id = p_account_id;
$$;
