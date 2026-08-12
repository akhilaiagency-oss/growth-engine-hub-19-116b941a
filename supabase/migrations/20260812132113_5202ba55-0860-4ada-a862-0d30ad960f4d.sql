alter table public.strategy_call_payments
  add column if not exists razorpay_payment_link_id text,
  add column if not exists razorpay_payment_link_short_url text,
  add column if not exists razorpay_reference_id text;

create unique index if not exists strategy_call_payments_reference_id_key
  on public.strategy_call_payments (razorpay_reference_id)
  where razorpay_reference_id is not null;

create index if not exists strategy_call_payments_plink_idx
  on public.strategy_call_payments (razorpay_payment_link_id);