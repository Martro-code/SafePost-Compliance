-- Backfill: set email_product_updates = true for all existing users who still
-- have the old default (false).

-- Step 1: Backfill existing rows.
UPDATE user_preferences
SET email_product_updates = true
WHERE email_product_updates = false;

-- Step 2: Change the column default for new rows going forward.
ALTER TABLE user_preferences
ALTER COLUMN email_product_updates SET DEFAULT true;
