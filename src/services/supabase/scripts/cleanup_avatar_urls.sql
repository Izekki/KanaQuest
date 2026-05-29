-- Clean legacy avatar URLs from public.profiles.
-- Keep only internal bucket paths in profiles.avatar_url.
-- Run this once after switching the app to local uploads only.

begin;

update public.profiles
set avatar_url = null
where avatar_url is not null
  and avatar_url ~* '^https?://';

commit;
