create extension if not exists pgcrypto;

create table if not exists public.bai_results (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  score int not null check (score between 0 and 63),
  category text not null,
  created_at timestamptz not null default now()
);

do $$ begin
  if not exists (select 1 from pg_indexes where tablename='bai_results' and indexname='bai_results_user_id_idx') then
    create index bai_results_user_id_idx on public.bai_results(user_id);
  end if;
end $$;

alter table public.bai_results enable row level security;

drop policy if exists "allow service role only" on public.bai_results;
create policy "allow service role only"
on public.bai_results
for all
to service_role
using (true)
with check (true);
