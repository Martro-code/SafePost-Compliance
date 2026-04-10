-- Standalone audit purchase and extended audit tier
--
-- audit_only                   — true when the user bought the audit without a
--                                subscription (standalone purchase). Shown as an
--                                audit-only account on the dashboard.
-- extended_audit_purchased      — true after a successful one-time payment for
--                                the Extended Audit tier ($249, 12 pages).
-- extended_audit_payment_intent_id — Stripe PaymentIntent ID for idempotency.
--
-- These columns are intentionally excluded from the authenticated-role
-- column-level UPDATE grant so only the service role (Edge Functions /
-- Stripe webhook) may write to them.

ALTER TABLE accounts
ADD COLUMN audit_only boolean NOT NULL DEFAULT false;

ALTER TABLE accounts
ADD COLUMN extended_audit_purchased boolean NOT NULL DEFAULT false;

ALTER TABLE accounts
ADD COLUMN extended_audit_payment_intent_id text;
