-- Add ABN and verified entity name columns to accounts table.
-- These are populated during signup after ABR (Australian Business Register) lookup.
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS abn text;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS abn_entity_name text;
