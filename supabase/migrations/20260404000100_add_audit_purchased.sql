-- Phase 2A: Website Compliance Audit feature
-- Add audit purchase tracking columns to the accounts table.
--
-- audit_purchased  — set to true by the Stripe webhook after a successful
--                    one-time payment for the Website Compliance Audit.
-- audit_payment_intent_id — Stripe PaymentIntent ID recorded at purchase
--                    for idempotency checks in the webhook handler.
--
-- These columns are intentionally excluded from the authenticated-role
-- column-level UPDATE grant, so only the service role (used by Edge
-- Functions / Stripe webhook) may write to them.

ALTER TABLE accounts
ADD COLUMN audit_purchased boolean NOT NULL DEFAULT false;

ALTER TABLE accounts
ADD COLUMN audit_payment_intent_id text;
