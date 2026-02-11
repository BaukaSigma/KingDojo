-- 1. Create the 'gallery' table
create table if not exists gallery (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('photo', 'video')),
    title text,
    description text,
    image_url text,      -- for photos
    video_url text,      -- for youtube videos
    created_at timestamptz default now()
);

-- 2. Enable RLS
alter table gallery enable row level security;

-- 3. Create RLS policies
-- Allow public access to view gallery items
create policy "Public Gallery Access"
on gallery for select
using (true);

-- Allow authenticated admins to insert/update/delete
create policy "Admin Gallery Management"
on gallery for all
using (auth.role() = 'authenticated');

-- 4. Create 'gallery' storage bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- 5. Storage Policies for 'gallery' bucket
-- Public read access
create policy "Public Gallery Bucket Access"
on storage.objects for select
using ( bucket_id = 'gallery' );

-- Admin upload/delete access
create policy "Admin Gallery Bucket Insert"
on storage.objects for insert
with check ( bucket_id = 'gallery' and auth.role() = 'authenticated' );

create policy "Admin Gallery Bucket Update"
on storage.objects for update
using ( bucket_id = 'gallery' and auth.role() = 'authenticated' );

create policy "Admin Gallery Bucket Delete"
on storage.objects for delete
using ( bucket_id = 'gallery' and auth.role() = 'authenticated' );
