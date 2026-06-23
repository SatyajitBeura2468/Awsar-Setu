alter table public.opportunities
  add column if not exists content_status text not null default 'development-sample'
    check (content_status in (
      'verified-active',
      'official-directory',
      'archived',
      'unavailable',
      'development-sample'
    ));

update public.opportunities
set content_status = case
  when verification_status = 'officially-reviewed' then 'verified-active'
  when verification_status = 'source-linked' then 'official-directory'
  else 'development-sample'
end
where content_status = 'development-sample';

alter table public.profiles
  add column if not exists age_band text
    check (age_band in (
      'under-18',
      '18-24',
      '25-34',
      '35-44',
      '45-59',
      '60-plus',
      'not-specified'
    ));

alter table public.notification_preferences
  add column if not exists likely_match_enabled boolean not null default true,
  add column if not exists verified_vacancy_enabled boolean not null default true,
  add column if not exists approaching_deadline_enabled boolean not null default true,
  add column if not exists saved_item_reminder_enabled boolean not null default true;

drop policy if exists "Public can read reviewed opportunities" on public.opportunities;

create policy "Public can read trusted opportunities"
  on public.opportunities for select
  using (content_status in ('verified-active', 'official-directory'));

create index if not exists opportunities_content_status_idx
  on public.opportunities(content_status);
