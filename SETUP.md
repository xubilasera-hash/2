
# Supabase Setup Guide

Follow these steps to connect this application to your Supabase project.

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Database SQL
In your Supabase Dashboard, go to **SQL Editor** and paste the following:

```sql
-- Create Identity table
create table identity (
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

-- Create Gallery table
create table gallery (
  id uuid default gen_random_uuid() primary key,
  caption text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Create Notices table
create table notices (
  id uuid default gen_random_uuid() primary key,
  title text,
  description text,
  pdf_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Optional, for public read access)
alter table identity enable row level security;
alter table gallery enable row level security;
alter table notices enable row level security;

create policy "Public Access" on identity for select using (true);
create policy "Public Access" on gallery for select using (true);
create policy "Public Access" on notices for select using (true);

-- NOTE: For simple demo purposes, we're allowing all inserts/updates/deletes.
-- In production, you would restrict these to authenticated users only.
create policy "All Access" on identity for all using (true);
create policy "All Access" on gallery for all using (true);
create policy "All Access" on notices for all using (true);
```

### 3. Create Storage Buckets
Go to **Storage** in Supabase and create 3 **Public** buckets:
1. `identity`
2. `gallery`
3. `notices`

Set the bucket policies to allow public access for reading and uploading (or adjust based on your security needs).

### 4. Link the Code
1. Open the file `supabase.ts`.
2. Find **Line 7** and replace `'YOUR_SUPABASE_PROJECT_URL'` with your project URL.
3. Find **Line 8** and replace `'YOUR_SUPABASE_ANON_KEY'` with your project Anon Key.
