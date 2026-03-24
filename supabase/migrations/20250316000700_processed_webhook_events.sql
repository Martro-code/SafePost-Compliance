-- Migration: Create processed_webhook_events table for Stripe webhook idempotency
-- This table stores Stripe event IDs that have already been processed to prevent
-- duplicate handling of the same webhook event.

CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for cleanup queries (e.g. deleting old entries)
CREATE INDEX idx_processed_webhook_events_processed_at
  ON public.processed_webhook_events (processed_at);

-- Enable RLS (no user-facing policies needed — only service role accesses this table)
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;
