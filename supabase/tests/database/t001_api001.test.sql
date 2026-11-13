-- Lot 03 — tests pgTAP de T-001 / RLS / API-001. Lancer : npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(41);

-- Comptes fictifs (aucune donnée personnelle). M1, M2 : Managers ; E1 : Exécutant.
insert into auth.users (id, instance_id, aud, role, email) values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm1@test.local'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e1@test.local'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2@test.local');

-- Sessions actives (les routines privilégiées exigent une session non révoquée).
insert into auth.sessions (id, user_id) values
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
  ('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333');

-- TEST-010 AC-009 / AC-011 : profil Exécutant créé automatiquement.
select is((select count(*)::int from public.profiles where id in
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')),
  3, 'un profil par compte Auth');
select is((select role::text from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  'executant', 'rôle par défaut Exécutant');

-- Amorçage opérateur des Managers (procédure privilégiée, hors API).
update public.profiles set role = 'manager'
  where id in ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333');

-- TEST-011 : RLS et droits SQL.
select ok((select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.profiles'::regclass), 'RLS activée et forcée');
select ok(not has_table_privilege('anon', 'public.profiles', 'SELECT'), 'anon : pas de SELECT');
select ok(not has_table_privilege('authenticated', 'public.profiles', 'INSERT'), 'authenticated : pas d''INSERT');
select ok(not has_table_privilege('authenticated', 'public.profiles', 'UPDATE'), 'authenticated : pas d''UPDATE');
select ok(not has_table_privilege('authenticated', 'public.profiles', 'DELETE'), 'authenticated : pas de DELETE');
select ok(not has_function_privilege('anon', 'public.set_user_role(uuid, public.app_role)', 'EXECUTE'), 'anon : pas d''EXECUTE API-001');
select ok(not has_function_privilege('anon', 'public.list_profiles(integer, integer)', 'EXECUTE'), 'anon : pas d''EXECUTE annuaire');
select ok(not has_function_privilege('anon', 'private.set_user_role(uuid, public.app_role)', 'EXECUTE'), 'anon : pas d''EXECUTE routine privée');
select ok(not has_function_privilege('authenticated', 'private.handle_new_user()', 'EXECUTE'), 'trigger non appelable');
select ok(not has_schema_privilege('anon', 'private', 'USAGE'), 'anon : pas d''accès au schéma privé');
select is((select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'private' and has_function_privilege('authenticated', p.oid, 'EXECUTE')), 2,
  'schéma privé : seules les 2 routines prévues sont exécutables');
select is((select count(*)::int from information_schema.role_table_grants
  where table_schema = 'public' and grantee = 'anon'), 0, 'anon : aucun droit sur les tables publiques');

-- TEST-012 : anonyme refusé.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select throws_ok($$ select * from public.profiles $$, '42501', null, 'anon ne lit pas T-001');
select throws_ok($$ select * from public.set_user_role('22222222-2222-2222-2222-222222222222', 'manager') $$, '42501', null, 'anon ne change aucun rôle');
select throws_ok($$ select * from public.list_profiles() $$, '42501', null, 'anon ne liste pas les profils');
reset role;

-- TEST-013 : Exécutant (AC-012, AC-013, AC-014, AC-016).
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","session_id":"a2222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
select is((select count(*)::int from public.profiles), 1, 'Exécutant : ne voit que son profil');
select is((select role::text from public.profiles), 'executant', 'Exécutant : lit son rôle');
select throws_ok($$ select * from public.set_user_role('22222222-2222-2222-2222-222222222222', 'manager') $$, '42501', 'self_change_forbidden', 'auto-promotion refusée');
select throws_ok($$ select * from public.set_user_role('11111111-1111-1111-1111-111111111111', 'executant') $$, '42501', 'forbidden', 'Exécutant ne rétrograde pas un Manager');
select throws_ok($$ select * from public.list_profiles() $$, '42501', 'forbidden', 'Exécutant ne liste pas les profils');
select throws_ok($$ update public.profiles set role = 'manager' $$, '42501', null, 'UPDATE direct refusé');
select throws_ok($$ insert into public.profiles (id) values (gen_random_uuid()) $$, '42501', null, 'INSERT direct refusé');
select throws_ok($$ delete from public.profiles $$, '42501', null, 'DELETE direct refusé');
reset role;

-- TEST-014 : Manager (AC-013, AC-014, AC-015, AC-016).
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","session_id":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
select is((select count(*)::int from public.profiles), 1, 'Manager : lecture directe limitée à son profil');
select is((select count(*)::int from public.list_profiles()), 3, 'Manager : annuaire complet via la routine');
select is((select email from public.list_profiles() where id = '22222222-2222-2222-2222-222222222222'), 'e1@test.local', 'annuaire : e-mail présent');
select is((select count(*)::int from public.list_profiles(1, 0)), 1, 'annuaire : pagination');
select is((select count(*)::int from public.list_profiles(100000, 0)), 3, 'annuaire : plafond appliqué sans erreur');
select is((select count(*)::int from public.list_profiles(0, -5)), 1, 'annuaire : bornes basses appliquées');
select is((select role::text from public.set_user_role('22222222-2222-2222-2222-222222222222', 'manager')), 'manager', 'promotion Exécutant → Manager');
select is((select role::text from public.set_user_role('22222222-2222-2222-2222-222222222222', 'manager')), 'manager', 'rejeu : même état, pas d''inversion');
select is((select role::text from public.set_user_role('33333333-3333-3333-3333-333333333333', 'executant')), 'executant', 'rétrogradation d''un autre Manager');
select throws_ok($$ select * from public.set_user_role('11111111-1111-1111-1111-111111111111', 'executant') $$, '42501', 'self_change_forbidden', 'auto-rétrogradation refusée');
select throws_ok($$ select * from public.set_user_role('99999999-9999-9999-9999-999999999999', 'manager') $$, 'P0002', 'target_not_found', 'cible absente');
reset role;

-- TEST-015 : rôle périmé — un Manager rétrogradé perd ses droits malgré un jeton encore valide.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","session_id":"a3333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
select throws_ok($$ select * from public.list_profiles() $$, '42501', 'forbidden', 'ancien Manager refusé (rôle relu en base)');
reset role;

-- TEST-019 : session révoquée — jeton encore valide mais session supprimée (déconnexion).
delete from auth.sessions where id = 'a1111111-1111-1111-1111-111111111111';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","session_id":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
select throws_ok($$ select * from public.list_profiles() $$, '42501', 'not_authenticated', 'session révoquée : annuaire refusé');
select throws_ok($$ select * from public.set_user_role('22222222-2222-2222-2222-222222222222', 'executant') $$, '42501', 'not_authenticated', 'session révoquée : API-001 refusée');
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
select throws_ok($$ select * from public.list_profiles() $$, '42501', 'not_authenticated', 'jeton sans session_id refusé');
reset role;

-- TEST-016 : suppression du compte Auth → profil supprimé.
delete from auth.users where id = '33333333-3333-3333-3333-333333333333';
select is((select count(*)::int from public.profiles where id = '33333333-3333-3333-3333-333333333333'), 0, 'suppression en cascade');

select * from finish();
rollback;
