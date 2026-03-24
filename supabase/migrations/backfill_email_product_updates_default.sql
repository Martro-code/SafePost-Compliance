-- Backfill: set email_product_updates = true for existing users who still have
-- the old default (false) and have never explicitly changed the setting.
--
-- We detect "never explicitly changed" by checking that updated_at equals
-- created_at, meaning the row was auto-created but never modified by the user
-- via the Settings page.

-- Step 1: Change the column default for new rows going forward.
alter table user_preferences
  alter column email_product_updates set default true;

-- Step 2: Backfill existing rows that were never explicitly updated.
update user_preferences
set email_product_updates = true,
    updated_at = now()
where email_product_updates = false
  and updated_at = created_at;
