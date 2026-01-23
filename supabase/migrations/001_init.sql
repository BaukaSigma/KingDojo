-- Enable extensions
create extension if not exists "uuid-ossp";

-- 1. Products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric not null default 0,
  images text[] default '{}', -- URLs to Supabase Storage
  category text, -- e.g. "uniform", "gear", "merch"
  slug text unique not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. News
create table public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text,
  cover_image text,
  gallery text[] default '{}',
  published_at timestamptz default now(),
  is_published boolean default false,
  created_at timestamptz default now()
);

-- 3. Achievements
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  date date not null, -- e.g. tournament date
  cover_image text,
  gallery text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 4. Settings
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  whatsapp_phone text, -- digits only
  telegram_username text, -- no @
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  map_url text,
  updated_at timestamptz default now()
);

-- 5. Admin Allowlist
create table public.admin_allowlist (
  email text primary key
);

-- Storage buckets setup (conceptual - must be done in Supabase UI or via API, but we can try to hint policies)
-- Usually better to just document this: "Create 'public' bucket"

-- Enable RLS on all tables
alter table public.products enable row level security;
alter table public.news enable row level security;
alter table public.achievements enable row level security;
alter table public.settings enable row level security;
alter table public.admin_allowlist enable row level security;
