-- Security Hardening Migration
-- 1. Restrict trigger function executions from anonymous and authenticated public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_word_experience_award() FROM public, anon, authenticated;

-- 2. Enforce immutable search_path on public functions to prevent search_path hijacking
ALTER FUNCTION public.calculate_profile_level(integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.apply_word_experience_award() SET search_path = public, pg_temp;
