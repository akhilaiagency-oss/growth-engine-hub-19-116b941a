-- ============ payment states ============
ALTER TYPE public.strategy_call_payment_status ADD VALUE IF NOT EXISTS 'payment_pending';
ALTER TYPE public.strategy_call_payment_status ADD VALUE IF NOT EXISTS 'paid';
ALTER TYPE public.strategy_call_payment_status ADD VALUE IF NOT EXISTS 'payment_failed';
ALTER TYPE public.strategy_call_payment_status ADD VALUE IF NOT EXISTS 'payment_cancelled';

-- ============ payments: extra provider detail ============
ALTER TABLE public.strategy_call_payments
  ADD COLUMN IF NOT EXISTS method TEXT,
  ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- ============ webhook event log (idempotency) ============
CREATE TABLE IF NOT EXISTS public.strategy_call_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS strategy_call_webhook_events_unique
  ON public.strategy_call_webhook_events (provider, event_id);

GRANT ALL ON public.strategy_call_webhook_events TO service_role;
ALTER TABLE public.strategy_call_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No client access to webhook events" ON public.strategy_call_webhook_events;
CREATE POLICY "No client access to webhook events"
  ON public.strategy_call_webhook_events
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP TRIGGER IF EXISTS strategy_call_webhook_events_set_updated_at ON public.strategy_call_webhook_events;
CREATE TRIGGER strategy_call_webhook_events_set_updated_at
BEFORE UPDATE ON public.strategy_call_webhook_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ booking unlock: paid AND signature-verified ============
CREATE OR REPLACE FUNCTION public.strategy_call_booking_unlocked(_lead_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.strategy_call_payments p
    WHERE p.lead_id = _lead_id
      AND p.status::text = 'paid'
      AND p.verification_status::text = 'verified'
  );
$$;