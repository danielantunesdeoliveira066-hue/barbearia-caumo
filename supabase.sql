-- Cole este arquivo inteiro no Supabase: SQL Editor > New query > Run

create extension if not exists btree_gist;

-- Tabela de agendamentos. O banco recusa dois horários que se sobreponham.
create table agendamentos (
  id bigint generated always as identity primary key,
  inicio timestamptz not null,
  fim timestamptz not null,
  nome text not null,
  servicos text not null,
  criado timestamptz not null default now(),
  constraint sem_conflito exclude using gist (tstzrange(inicio, fim) with &&)
);

alter table agendamentos enable row level security;
grant insert on agendamentos to anon;

-- O site (chave anon) só pode CRIAR agendamentos, e só os válidos. Não consegue ler nomes.
create policy "site pode agendar" on agendamentos
  for insert to anon
  with check (fim > inicio and fim - inicio <= interval '4 hours' and inicio > now());

-- O site consegue ver apenas os horários ocupados (sem nome de ninguém).
create function ocupados(de timestamptz, ate timestamptz)
returns table (inicio timestamptz, fim timestamptz)
language sql security definer set search_path = public as $$
  select a.inicio, a.fim from agendamentos a where a.inicio < ate and a.fim > de
$$;

grant execute on function ocupados(timestamptz, timestamptz) to anon;
