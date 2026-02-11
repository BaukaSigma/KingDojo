-- 1. Create 'students' table
create table if not exists students (
    id uuid primary key default gen_random_uuid(),
    display_name text not null,
    belt text,
    group_name text,
    bio_short text,
    photo_url text,
    rating_points int not null default 0,
    attended_classes int not null default 0,
    total_classes int not null default 0,
    public_visible boolean not null default true,
    created_at timestamptz not null default now()
);

-- 2. Create 'student_awards' table
create table if not exists student_awards (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null references students(id) on delete cascade,
    medal text not null check (medal in ('gold','silver','bronze','other')),
    title text,
    place int,
    created_at timestamptz not null default now()
);

-- 3. Enable RLS
alter table students enable row level security;
alter table student_awards enable row level security;

-- 4. RLS Policies
-- Students: Public read, Admin write
create policy "Public Students Access"
on students for select
using (true);

create policy "Admin Students Management"
on students for all
using (auth.role() = 'authenticated');

-- Awards: Public read, Admin write
create policy "Public Awards Access"
on student_awards for select
using (true);

create policy "Admin Awards Management"
on student_awards for all
using (auth.role() = 'authenticated');

-- 5. Storage for 'students' bucket (Create bucket automatically via SQL if possible, else manual)
insert into storage.buckets (id, name, public)
values ('students', 'students', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Students Bucket Access"
on storage.objects for select
using ( bucket_id = 'students' );

create policy "Admin Students Bucket Insert"
on storage.objects for insert
with check ( bucket_id = 'students' and auth.role() = 'authenticated' );

create policy "Admin Students Bucket Update"
on storage.objects for update
using ( bucket_id = 'students' and auth.role() = 'authenticated' );

create policy "Admin Students Bucket Delete"
on storage.objects for delete
using ( bucket_id = 'students' and auth.role() = 'authenticated' );
