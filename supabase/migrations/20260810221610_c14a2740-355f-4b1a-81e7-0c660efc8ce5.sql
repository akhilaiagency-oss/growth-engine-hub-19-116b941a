ALTER TYPE public.strategy_call_booking_status ADD VALUE IF NOT EXISTS 'confirmed';

ALTER TABLE public.strategy_call_bookings
  ADD COLUMN IF NOT EXISTS calendly_event_uuid text,
  ADD COLUMN IF NOT EXISTS invitee_email text,
  ADD COLUMN IF NOT EXISTS event_end_time timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verification_method text;

CREATE INDEX IF NOT EXISTS strategy_call_bookings_event_uuid_idx
  ON public.strategy_call_bookings (calendly_event_uuid);