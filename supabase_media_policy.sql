-- 1. Create the 'media' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 2. Drop existing policies to avoid conflicts
-- Note: We are skipping 'alter table storage.objects enable row level security;' 
-- because it often causes permission errors and RLS is usually enabled by default.

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- 3. Create Policy: Public Read Access (Anyone can view images)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'media' );

-- 4. Create Policy: Authenticated Upload (Logged in users can upload)
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' );

-- 5. Create Policy: Authenticated Update (Logged in users can update)
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'media' );

-- 6. Create Policy: Authenticated Delete (Logged in users can delete)
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'media' );
