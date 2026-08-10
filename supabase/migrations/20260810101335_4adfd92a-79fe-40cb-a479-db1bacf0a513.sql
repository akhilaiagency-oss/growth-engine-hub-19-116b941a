CREATE UNIQUE INDEX IF NOT EXISTS strategy_call_payments_one_open_per_lead
  ON public.strategy_call_payments (lead_id)
  WHERE status IN ('created'::public.strategy_call_payment_status, 'payment_pending'::public.strategy_call_payment_status);

CREATE UNIQUE INDEX IF NOT EXISTS strategy_call_bookings_one_per_lead
  ON public.strategy_call_bookings (lead_id);