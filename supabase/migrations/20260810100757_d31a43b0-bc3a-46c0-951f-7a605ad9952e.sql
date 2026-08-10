-- ============ enums ============
CREATE TYPE public.strategy_call_lead_stage AS ENUM (
  'qualified', 'payment_pending', 'paid', 'booked', 'completed', 'abandoned'
);

CREATE TYPE public.strategy_call_payment_status AS ENUM (
  'created', 'attempted', 'authorized', 'captured', 'failed', 'refunded'
);

CREATE TYPE public.strategy_call_verification_status AS ENUM (
  'unverified', 'verified', 'mismatch'
);

CREATE TYPE public.strategy_call_booking_status AS ENUM (
  'pending', 'scheduled', 'rescheduled', 'cancelled', 'completed', 'no_show'
);

CREATE TYPE public.strategy_call_whatsapp_status AS ENUM (
  'not_granted', 'invited', 'joined', 'revoked'
);

-- ============ shared updated_at trigger fn ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ leads ============
CREATE TABLE public.strategy_call_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT,
  what_you_sell TEXT,
  marketing_spend TEXT,
  desired_outcome TEXT,
  timeline TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  stage public.strategy_call_lead_stage NOT NULL DEFAULT 'qualified',
  source_page TEXT,
  utm JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX strategy_call_leads_access_token_key ON public.strategy_call_leads (access_token);
CREATE INDEX strategy_call_leads_email_idx ON public.strategy_call_leads (lower(email));
CREATE INDEX strategy_call_leads_created_at_idx ON public.strategy_call_leads (created_at DESC);

GRANT ALL ON public.strategy_call_leads TO service_role;
ALTER TABLE public.strategy_call_leads ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER strategy_call_leads_set_updated_at
BEFORE UPDATE ON public.strategy_call_leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ payments ============
CREATE TABLE public.strategy_call_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.strategy_call_leads(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount_paise INTEGER NOT NULL DEFAULT 900,
  currency TEXT NOT NULL DEFAULT 'INR',
  status public.strategy_call_payment_status NOT NULL DEFAULT 'created',
  verification_status public.strategy_call_verification_status NOT NULL DEFAULT 'unverified',
  verified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  failure_reason TEXT,
  receipt TEXT,
  provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX strategy_call_payments_order_id_key ON public.strategy_call_payments (razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;
CREATE UNIQUE INDEX strategy_call_payments_payment_id_key ON public.strategy_call_payments (razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX strategy_call_payments_lead_id_idx ON public.strategy_call_payments (lead_id);

GRANT ALL ON public.strategy_call_payments TO service_role;
ALTER TABLE public.strategy_call_payments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER strategy_call_payments_set_updated_at
BEFORE UPDATE ON public.strategy_call_payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ bookings ============
CREATE TABLE public.strategy_call_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.strategy_call_leads(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.strategy_call_payments(id) ON DELETE SET NULL,
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  calendly_event_name TEXT,
  calendly_reschedule_url TEXT,
  calendly_cancel_url TEXT,
  join_url TEXT,
  scheduled_at TIMESTAMPTZ,
  timezone TEXT,
  status public.strategy_call_booking_status NOT NULL DEFAULT 'pending',
  booked_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX strategy_call_bookings_event_uri_key ON public.strategy_call_bookings (calendly_event_uri) WHERE calendly_event_uri IS NOT NULL;
CREATE INDEX strategy_call_bookings_lead_id_idx ON public.strategy_call_bookings (lead_id);
CREATE INDEX strategy_call_bookings_scheduled_at_idx ON public.strategy_call_bookings (scheduled_at);

GRANT ALL ON public.strategy_call_bookings TO service_role;
ALTER TABLE public.strategy_call_bookings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER strategy_call_bookings_set_updated_at
BEFORE UPDATE ON public.strategy_call_bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ entitlements ============
CREATE TABLE public.strategy_call_entitlements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL UNIQUE REFERENCES public.strategy_call_leads(id) ON DELETE CASCADE,
  whatsapp_status public.strategy_call_whatsapp_status NOT NULL DEFAULT 'not_granted',
  whatsapp_phone TEXT,
  whatsapp_invite_url TEXT,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX strategy_call_entitlements_status_idx ON public.strategy_call_entitlements (whatsapp_status);

GRANT ALL ON public.strategy_call_entitlements TO service_role;
ALTER TABLE public.strategy_call_entitlements ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER strategy_call_entitlements_set_updated_at
BEFORE UPDATE ON public.strategy_call_entitlements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- No anon/authenticated grants and no permissive policies:
-- these tables are reachable only through trusted server-side code.
CREATE POLICY "No client access to leads" ON public.strategy_call_leads FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client access to payments" ON public.strategy_call_payments FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client access to bookings" ON public.strategy_call_bookings FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client access to entitlements" ON public.strategy_call_entitlements FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);