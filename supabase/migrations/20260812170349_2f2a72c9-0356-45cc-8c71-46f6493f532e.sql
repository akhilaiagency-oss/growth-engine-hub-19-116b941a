ALTER TABLE public.strategy_call_entitlements
  ADD COLUMN IF NOT EXISTS sent_bonus_email_at timestamptz;

-- No anon/authenticated policy is created for the private bonus bucket.
-- Only the service role (which bypasses RLS) may read these objects, and it
-- does so solely to mint short-lived signed URLs for verified customers.
DROP POLICY IF EXISTS "strategy_call_bonuses_no_client_access" ON storage.objects;
CREATE POLICY "strategy_call_bonuses_no_client_access"
  ON storage.objects
  FOR ALL
  TO anon, authenticated
  USING (bucket_id <> 'strategy-call-bonuses')
  WITH CHECK (bucket_id <> 'strategy-call-bonuses');