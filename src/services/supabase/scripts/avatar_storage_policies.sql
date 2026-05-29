-- Storage policies for user avatar uploads.
-- Apply these policies in Supabase SQL editor after the `avatars` bucket exists.
-- The app stores avatars as `${user_id}/avatar.png`.

begin;

create policy "Authenticated users can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and name = auth.uid()::text || '/avatar.png'
);

create policy "Authenticated users can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and name = auth.uid()::text || '/avatar.png'
)
with check (
  bucket_id = 'avatars'
  and name = auth.uid()::text || '/avatar.png'
);

create policy "Authenticated users can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and name = auth.uid()::text || '/avatar.png'
);

commit;
