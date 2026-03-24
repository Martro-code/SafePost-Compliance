-- Security fix: restrict which columns authenticated users can UPDATE on accounts.
-- Sensitive columns (plan, checks_used, checks_limit, stripe_customer_id,
-- stripe_subscription_id, billing_period) must only be updatable by the
-- service role — never by authenticated users directly.

-- Revoke blanket UPDATE privilege from the authenticated role
revoke update on public.accounts from authenticated;

-- Grant UPDATE only on safe profile columns
grant update (
  first_name,
  last_name,
  billing_email,
  abn,
  abn_entity_name
) on public.accounts to authenticated;
