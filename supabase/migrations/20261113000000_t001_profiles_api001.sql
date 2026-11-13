-- Lot 03 — T-001 Profils, RLS et API-001 (voir 03-DATABASE/DATABASE.md et 10-DOCS/API_INTEGRATIONS.md).
-- Principe : aucune écriture directe sur T-001 depuis l'API ; les opérations privilégiées passent par
-- des routines SECURITY DEFINER du schéma privé `private` (non exposé), appelées par des façades publiques.

create type public.app_role as enum ('executant', 'manager');

-- T-001 : une ligne par compte Auth, supprimée avec le compte.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'executant'
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- Droits SQL explicites : lecture seule pour les utilisateurs connectés, rien pour anon.
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;

-- Chacun ne lit que son propre profil. Aucune policy INSERT / UPDATE / DELETE : refus par défaut.
create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- Schéma privé pour les routines privilégiées (non listé dans [api].schemas).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Création du profil Exécutant à l'inscription (AC-009, AC-011). L'inscription ne peut pas choisir le rôle.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- API-001 : changement du rôle d'un AUTRE compte par un Manager (AC-014, AC-015, AC-016).
-- Verrouillage appelant + cible dans un ordre stable, relecture du rôle de l'appelant après verrou,
-- écriture atomique. Rejouer la même demande renvoie l'état demandé (pas d'inversion).
create function private.set_user_role(target_id uuid, new_role public.app_role)
returns table (id uuid, role public.app_role)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  caller_role public.app_role;
begin
  if caller is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if target_id is null or new_role is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if target_id = caller then
    raise exception 'self_change_forbidden' using errcode = '42501';
  end if;

  perform 1 from public.profiles p
    where p.id in (caller, target_id)
    order by p.id
    for update;

  select p.role into caller_role from public.profiles p where p.id = caller;
  if caller_role is distinct from 'manager' then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
    update public.profiles p set role = new_role
    where p.id = target_id
    returning p.id, p.role;
  if not found then
    raise exception 'target_not_found' using errcode = 'P0002';
  end if;
end;
$$;

-- Annuaire e-mails + rôles, Manager uniquement (AC-013), paginé et plafonné, sans autre donnée Auth.
create function private.list_profiles(page_limit integer, page_offset integer)
returns table (id uuid, email text, role public.app_role)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'manager') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.role
    from public.profiles p
    join auth.users u on u.id = p.id
    order by u.email
    limit least(greatest(coalesce(page_limit, 50), 1), 100)
    offset greatest(coalesce(page_offset, 0), 0);
end;
$$;

revoke all on function private.set_user_role(uuid, public.app_role) from public, anon;
revoke all on function private.list_profiles(integer, integer) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.set_user_role(uuid, public.app_role) to authenticated;
grant execute on function private.list_profiles(integer, integer) to authenticated;

-- Façades RPC publiques (security invoker) : seules portes d'entrée exposées par la Data API.
create function public.set_user_role(target_id uuid, new_role public.app_role)
returns table (id uuid, role public.app_role)
language sql
security invoker
set search_path = ''
as $$ select * from private.set_user_role(target_id, new_role) $$;

create function public.list_profiles(page_limit integer default 50, page_offset integer default 0)
returns table (id uuid, email text, role public.app_role)
language sql
stable
security invoker
set search_path = ''
as $$ select * from private.list_profiles(page_limit, page_offset) $$;

revoke all on function public.set_user_role(uuid, public.app_role) from public, anon;
revoke all on function public.list_profiles(integer, integer) from public, anon;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;
grant execute on function public.list_profiles(integer, integer) to authenticated;
grant usage on type public.app_role to authenticated;
