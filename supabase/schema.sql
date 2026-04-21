-- ============================================
-- VIRALKIT — Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  credits integer default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PROJECTS
-- ============================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Project',
  topic text,
  script text,
  voice_gender text default 'female' check (voice_gender in ('female', 'male')),
  audio_url text,
  audio_duration integer,
  stage text default 'script' check (stage in ('script', 'visual', 'audio', 'done')),
  status text default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PANELS (image pairs per project)
-- ============================================
create table public.panels (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  panel_number integer not null,
  label_a text default 'SETUP',
  label_b text default 'KLIMAKS',
  prompt_a text,
  prompt_b text,
  image_url_a text,
  image_url_b text,
  video_prompt text,
  style text default 'cinematic',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, panel_number)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.panels enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Projects: users can CRUD their own
create policy "Users can view own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- Panels: same
create policy "Users can view own panels" on public.panels
  for select using (auth.uid() = user_id);
create policy "Users can insert own panels" on public.panels
  for insert with check (auth.uid() = user_id);
create policy "Users can update own panels" on public.panels
  for update using (auth.uid() = user_id);
create policy "Users can delete own panels" on public.panels
  for delete using (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public) values ('images', 'images', true);
insert into storage.buckets (id, name, public) values ('audio', 'audio', true);

create policy "Users can upload images" on storage.objects
  for insert with check (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Images are publicly accessible" on storage.objects
  for select using (bucket_id = 'images');

create policy "Users can upload audio" on storage.objects
  for insert with check (bucket_id = 'audio' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Audio is publicly accessible" on storage.objects
  for select using (bucket_id = 'audio');

-- ============================================
-- UPDATED_AT trigger
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger set_panels_updated_at before update on public.panels
  for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
