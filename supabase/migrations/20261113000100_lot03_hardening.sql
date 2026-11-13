-- Lot 03 — durcissement suite à la revue sécurité (06-SECURITY/audits/lot-03.md).

-- Aucune future fonction du schéma privé n'est exécutable par défaut.
alter default privileges in schema private revoke execute on functions from public;

-- Session réellement active (pas seulement un jeton non expiré) : un jeton conservé après
-- déconnexion ou révocation ne permet plus d'opération privilégiée.
create function private.assert_active_session()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
begin
  if caller is null or not exists (
    select 1 from auth.sessions s
    where s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid
      and s.user_id = caller
      and (s.not_after is null or s.not_after > now())
  ) then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  return caller;
end;
$$;
revoke all on function private.assert_active_session() from public, anon, authenticated;

-- Important : ces routines appartiennent à postgres (BYPASSRLS) ; leur sécurité repose uniquement
-- sur leurs contrôles internes. VOLATILE est requis : la relecture du rôle après verrou doit voir
-- un nouvel instantané (protection TOCTOU, TEST-017). Ne pas passer en STABLE.
create or replace function private.set_user_role(target_id uuid, new_role public.app_role)
returns table (id uuid, role public.app_role)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  caller uuid := private.assert_active_session();
  caller_role public.app_role;
begin
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

create or replace function private.list_profiles(page_limit integer, page_offset integer)
returns table (id uuid, email text, role public.app_role)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller uuid := private.assert_active_session();
begin
  if not exists (select 1 from public.profiles p where p.id = caller and p.role = 'manager') then
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
