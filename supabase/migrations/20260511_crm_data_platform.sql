-- CRM/data-platform expansion for JNGSYSTEM inquiries.
-- Safe to run on top of the existing inquiries table described in homepage/ADMIN_SETUP.md.

create table if not exists public.inquiries (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  company text,
  inquiry_type text default '기본 신청',
  details text,
  status text default '신규 문의',
  is_archived boolean default false
);

alter table public.inquiries
  add column if not exists updated_at timestamptz,
  add column if not exists inquiry_type_code text,
  add column if not exists status_code text,
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists customer_email text,
  add column if not exists normalized_phone text,
  add column if not exists normalized_email text,
  add column if not exists company_name text,
  add column if not exists building_name text,
  add column if not exists building_address text,
  add column if not exists region text,
  add column if not exists district text,
  add column if not exists building_area_m2 numeric,
  add column if not exists area_range text,
  add column if not exists legal_deadline date,
  add column if not exists service_scope text[],
  add column if not exists equipment_count integer,
  add column if not exists equipment_list text[],
  add column if not exists estimated_amount numeric,
  add column if not exists message text,
  add column if not exists quote_count integer not null default 0,
  add column if not exists last_quote_amount numeric,
  add column if not exists source_page text,
  add column if not exists landing_page text,
  add column if not exists referrer text,
  add column if not exists first_visit_at timestamptz,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists assigned_to text,
  add column if not exists memo text,
  add column if not exists quote_issued_at timestamptz,
  add column if not exists contracted_at timestamptz,
  add column if not exists lost_reason text,
  add column if not exists dedupe_key text,
  add column if not exists customer_hash text,
  add column if not exists raw_payload jsonb;

update public.inquiries
set
  updated_at = coalesce(updated_at, created_at),
  customer_name = coalesce(customer_name, name),
  customer_phone = coalesce(customer_phone, phone),
  company_name = coalesce(company_name, company),
  raw_payload = coalesce(raw_payload, jsonb_build_object('legacy_details', details))
where details is not null
  and details <> '';

update public.inquiries
set
  updated_at = coalesce(updated_at, created_at),
  customer_name = coalesce(customer_name, name),
  customer_phone = coalesce(customer_phone, phone),
  company_name = coalesce(company_name, company)
where updated_at is null
   or customer_name is null
   or customer_phone is null
   or company_name is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_status_label_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries
      add constraint inquiries_status_label_check
      check (
        status in (
          '신규 문의',
          '신규',
          '견적 완료',
          'new',
          'contacting',
          'quoted',
          'negotiating',
          'contracted',
          'on_hold',
          'lost',
          'archived'
        )
      )
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_status_code_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries
      add constraint inquiries_status_code_check
      check (
        status_code is null
        or status_code in ('new', 'contacting', 'quoted', 'negotiating', 'contracted', 'on_hold', 'lost', 'archived')
      )
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_inquiry_type_code_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries
      add constraint inquiries_inquiry_type_code_check
      check (
        inquiry_type_code is null
        or inquiry_type_code in ('consultation', 'quote_direct', 'quote_auto')
      )
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_area_range_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries
      add constraint inquiries_area_range_check
      check (
        area_range is null
        or area_range in ('30000_plus', '10000_29999', '5000_9999', 'under_5000', 'unknown')
      )
      not valid;
  end if;
end $$;

create table if not exists public.inquiry_events (
  id bigserial primary key,
  inquiry_id bigint references public.inquiries(id) on delete set null,
  created_at timestamptz not null default now(),
  event_type text not null,
  actor_type text not null default 'system',
  actor_email text,
  message text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.quotes (
  id bigserial primary key,
  inquiry_id bigint references public.inquiries(id) on delete set null,
  quote_number text not null,
  version integer not null default 1,
  status text not null default 'draft',
  service_scope text[],
  supply_amount numeric,
  vat_amount numeric,
  total_amount numeric,
  issued_at timestamptz,
  issued_by text,
  pdf_url text,
  raw_quote_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quotes_status_check'
      and conrelid = 'public.quotes'::regclass
  ) then
    alter table public.quotes
      add constraint quotes_status_check
      check (status in ('draft', 'issued', 'revised', 'accepted', 'expired'))
      not valid;
  end if;
end $$;

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_status_code_idx on public.inquiries (status_code);
create index if not exists inquiries_inquiry_type_idx on public.inquiries (inquiry_type);
create index if not exists inquiries_inquiry_type_code_idx on public.inquiries (inquiry_type_code);
create index if not exists inquiries_area_range_idx on public.inquiries (area_range);
create index if not exists inquiries_region_district_idx on public.inquiries (region, district);
create index if not exists inquiries_dedupe_key_idx on public.inquiries (dedupe_key);
create index if not exists inquiry_events_inquiry_id_created_at_idx on public.inquiry_events (inquiry_id, created_at desc);
create index if not exists inquiry_events_event_type_idx on public.inquiry_events (event_type);
create index if not exists quotes_inquiry_id_created_at_idx on public.quotes (inquiry_id, created_at desc);
create unique index if not exists quotes_quote_number_version_idx on public.quotes (quote_number, version);

alter table public.inquiries enable row level security;
alter table public.inquiry_events enable row level security;
alter table public.quotes enable row level security;

drop policy if exists "auth_select" on public.inquiries;
drop policy if exists "auth_update" on public.inquiries;
drop policy if exists "auth_select_events" on public.inquiry_events;
drop policy if exists "auth_insert_events" on public.inquiry_events;
drop policy if exists "auth_select_quotes" on public.quotes;
drop policy if exists "auth_insert_quotes" on public.quotes;
drop policy if exists "auth_update_quotes" on public.quotes;

create policy "auth_select"
  on public.inquiries for select
  to authenticated
  using (true);

create policy "auth_update"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "auth_select_events"
  on public.inquiry_events for select
  to authenticated
  using (true);

create policy "auth_insert_events"
  on public.inquiry_events for insert
  to authenticated
  with check (true);

create policy "auth_select_quotes"
  on public.quotes for select
  to authenticated
  using (true);

create policy "auth_insert_quotes"
  on public.quotes for insert
  to authenticated
  with check (true);

create policy "auth_update_quotes"
  on public.quotes for update
  to authenticated
  using (true)
  with check (true);

-- Keep the legacy anon insert policy only during the transition period.
-- After all public forms submit through Cloudflare Pages Functions, remove it:
--
-- drop policy if exists "anon_insert" on public.inquiries;
