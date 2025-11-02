-- Users are anonymous by default. Link later with Telegram user_id if needed.
create table if not exists public.bai_results (
  id uuid primary key default gen_random_uuid(),
  user_id text, -- telegram user id or anon
  score int not null check (score between 0 and 63),
  category text not null,
  created_at timestamp with time zone not null default now()
);

-- RLS
alter table public.bai_results enable row level security;

-- Policy: for now allow inserts and read for service role only (API uses service key). Tighten later.
drop policy if exists "allow service role only" on public.bai_results;
create policy "allow service role only"
on public.bai_results
for all
to service_role
using (true)
with check (true);
