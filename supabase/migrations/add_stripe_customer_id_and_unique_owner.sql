-- Add stripe_customer_id column if it does not already exist
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Add stripe_subscription_id column if it does not already exist
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Unique partial index on owner_user_id to prevent duplicate account creation
CREATE UNIQUE INDEX IF NOT EXISTS uq_accounts_owner_user_id
  ON accounts (owner_user_id)
  WHERE owner_user_id IS NOT NULL;

-- Index on stripe_customer_id for fast webhook lookups
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_customer_id
  ON accounts (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
