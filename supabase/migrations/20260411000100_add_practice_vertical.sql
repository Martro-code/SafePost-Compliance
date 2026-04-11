-- Add practice_vertical column to accounts and guidelines tables.
-- accounts.practice_vertical stores the practice type selected by the account owner.
-- guidelines.practice_vertical links a guideline to a specific practice type (NULL = applies to all).

ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS practice_vertical text;
ALTER TABLE public.guidelines ADD COLUMN IF NOT EXISTS practice_vertical text;

-- Allow authenticated users to update practice_vertical on their own account.
GRANT UPDATE (practice_vertical) ON public.accounts TO authenticated;
