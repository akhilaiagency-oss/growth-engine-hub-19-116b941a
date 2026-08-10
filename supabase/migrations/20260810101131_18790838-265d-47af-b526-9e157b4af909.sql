REVOKE EXECUTE ON FUNCTION public.strategy_call_booking_unlocked(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.strategy_call_booking_unlocked(UUID) TO service_role;