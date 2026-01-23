-- Helper for checking admin
-- Note: 'auth.jwt()' ->> 'email' is the standard way to check email in RLS
-- We check if that email exists in admin_allowlist

-- PRODUCTS
create policy "Public read active products"
on public.products for select
to public
using (is_active = true);

create policy "Admins can do everything on products"
on public.products for all
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

-- NEWS
create policy "Public read published news"
on public.news for select
to public
using (is_published = true);

create policy "Admins can do everything on news"
on public.news for all
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

-- ACHIEVEMENTS
create policy "Public read published achievements"
on public.achievements for select
to public
using (is_published = true);

create policy "Admins can do everything on achievements"
on public.achievements for all
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

-- SETTINGS
create policy "Public read settings"
on public.settings for select
to public
using (true);

create policy "Admins update settings"
on public.settings for update
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

create policy "Admins insert settings"
on public.settings for insert
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

-- ADMIN ALLOWLIST
-- Only super-admins (service role) or existing admins can view/edit allowlist?
-- For safety, allow read to authenticated so the policy checks above don't recurse infinitely? 
-- Actually recursion is handled, but simpler:
create policy "Admins can read allowlist"
on public.admin_allowlist for select
to authenticated
using (
  exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email'))
);

-- STORAGE OBJECTS RLS (buckets: 'public')
-- We need to enable RLS on storage.objects? Usually easiest via UI policy editor, but here is SQL approach:
-- Assuming bucket 'public' exists.

-- Public read access to files
-- create policy "Public Access"
-- on storage.objects for select
-- using ( bucket_id = 'public' );

-- Admin upload access
-- create policy "Admin Upload"
-- on storage.objects for insert
-- to authenticated
-- with check ( bucket_id = 'public' and exists (select 1 from public.admin_allowlist where email = (auth.jwt() ->> 'email')) );
