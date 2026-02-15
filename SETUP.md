
# Definitive Supabase Setup Guide

To fix "Violates Row Level Security" errors, run this exact script in your Supabase SQL Editor.

## 1. Database Tables & Permissions

```sql
-- Create Tables if they don't exist
create table if not exists identity (
  id uuid default gen_random_uuid() primary key,
  full_name text,
  title text,
  bio text,
  logo_url text,
  email text,
  github_url text,
  linkedin_url text,
  updated_at timestamp with time zone default now()
);

create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  caption text,
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists notices (
  id uuid default gen_random_uuid() primary key,
  title text,
  description text,
  pdf_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table identity enable row level security;
alter table gallery enable row level security;
alter table notices enable row level security;

-- DROP existing policies to prevent conflicts
drop policy if exists "Master Access" on identity;
drop policy if exists "Master Access" on gallery;
drop policy if exists "Master Access" on notices;

-- Create ALL-ACCESS policies for easy management
-- Note: In production, you would change 'true' to 'auth.role() = "authenticated"'
create policy "Master Access" on identity for all using (true) with check (true);
create policy "Master Access" on gallery for all using (true) with check (true);
create policy "Master Access" on notices for all using (true) with check (true);
```

## 2. Storage Setup (MANDATORY)

1. Go to **Storage** in your Supabase Sidebar.
2. Create 3 **Public** buckets: `identity`, `gallery`, and `notices`.
3. Run this SQL to allow your website to upload files to these buckets:

```sql
-- Allow public access to the storage objects in your 3 buckets
create policy "Public Storage Management"
on storage.objects for all
using ( bucket_id in ('identity', 'gallery', 'notices') )
with check ( bucket_id in ('identity', 'gallery', 'notices') );
```

## 3. Verify
After running the SQL:
1. Upload a logo in **Admin > Identity**.
2. Upload an image in **Admin > Gallery**.
3. Upload a PDF in **Admin > Notices**.

If you still see errors, double-check that your Bucket names in the Storage tab match exactly: `identity`, `gallery`, and `notices`.
