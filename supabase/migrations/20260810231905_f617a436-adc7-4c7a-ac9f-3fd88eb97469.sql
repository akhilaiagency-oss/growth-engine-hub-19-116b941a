ALTER TYPE public.strategy_call_whatsapp_status ADD VALUE IF NOT EXISTS 'enabled';
ALTER TABLE public.strategy_call_entitlements ADD COLUMN IF NOT EXISTS whatsapp_access_enabled_at timestamptz;