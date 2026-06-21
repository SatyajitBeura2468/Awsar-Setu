create extension if not exists "pgcrypto";

create type opportunity_category as enum (
  'education-scholarships',
  'government-jobs-vacancies',
  'jobs-internships-apprenticeships',
  'skills-training',
  'schemes-financial-support',
  'agriculture-rural-livelihood',
  'health-welfare-social-support'
);

create type application_status as enum ('saved', 'preparing', 'applied', 'archived');
create type match_confidence as enum ('likely', 'possible', 'check');

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category opportunity_category not null,
  description text not null,
  visual_cover text not null,
  official_organisation text not null,
  official_url text not null,
  official_action_label text not null default 'Continue to Official Portal',
  scope_kind text not null check (scope_kind in ('national', 'state')),
  applicable_states text[] not null default '{}',
  deadline date,
  benefit_type text not null,
  eligibility_summary text not null,
  eligibility_tags jsonb not null default '{}'::jsonb,
  education_requirements text[] not null default '{}',
  age_min integer,
  age_max integer,
  gender_relevance text[] not null default '{}',
  income_relevance text[] not null default '{}',
  current_role_relevance text[] not null default '{}',
  documents text[] not null default '{}',
  what_it_offers text[] not null default '{}',
  who_can_apply text[] not null default '{}',
  important_conditions text[] not null default '{}',
  how_to_apply text[] not null default '{}',
  last_checked date not null,
  verification_status text not null check (verification_status in ('officially-reviewed', 'source-linked', 'development-sample')),
  source_domain text not null,
  expired boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state text,
  age integer check (age between 0 and 120),
  education_level text,
  current_role text,
  interests opportunity_category[] not null default '{}',
  gender text,
  income_range text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null,
  status application_status not null default 'saved',
  notes text not null default '',
  reminder_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  browser_enabled boolean not null default false,
  email_enabled boolean not null default false,
  preferred_categories opportunity_category[] not null default '{}',
  state_preference text,
  alert_frequency text not null default 'weekly' check (alert_frequency in ('rare', 'weekly', 'deadline-only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text,
  confidence match_confidence not null,
  channel text not null check (channel in ('browser', 'email')),
  title text not null,
  body text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.content_imports (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  imported_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('validated', 'rejected', 'imported')),
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;
alter table public.profiles enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_events enable row level security;
alter table public.content_imports enable row level security;

create policy "Public can read reviewed opportunities"
  on public.opportunities for select
  using (verification_status in ('officially-reviewed', 'source-linked'));

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own saved opportunities"
  on public.saved_opportunities for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved opportunities"
  on public.saved_opportunities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved opportunities"
  on public.saved_opportunities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own saved opportunities"
  on public.saved_opportunities for delete
  using (auth.uid() = user_id);

create policy "Users can manage own notification preferences"
  on public.notification_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own notification events"
  on public.notification_events for select
  using (auth.uid() = user_id);

create index opportunities_category_idx on public.opportunities(category);
create index opportunities_deadline_idx on public.opportunities(deadline);
create index opportunities_scope_states_idx on public.opportunities using gin(applicable_states);
create index saved_opportunities_user_idx on public.saved_opportunities(user_id);
create index notification_events_user_idx on public.notification_events(user_id);
