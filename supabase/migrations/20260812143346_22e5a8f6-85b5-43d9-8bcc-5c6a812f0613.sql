alter table public.strategy_call_payments
  add column if not exists match_method text,
  add column if not exists matched_at timestamptz;

create index if not exists strategy_call_leads_email_idx
  on public.strategy_call_leads (lower(email));