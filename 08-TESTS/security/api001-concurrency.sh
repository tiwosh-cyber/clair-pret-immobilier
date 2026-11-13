#!/usr/bin/env bash
# TEST-017 — API-001 concurrence : deux Managers se rétrogradent mutuellement au même instant.
# Attendu : une seule demande réussit, l'autre est refusée (« forbidden ») car le rôle est relu après verrou.
# Prérequis : `npx supabase start` (base locale uniquement). Usage : bash 08-TESTS/security/api001-concurrency.sh
set -euo pipefail
DB="${SUPABASE_DB_CONTAINER:-supabase_db_clair}"
A=aaaaaaaa-0000-0000-0000-00000000000a
B=bbbbbbbb-0000-0000-0000-00000000000b
psql_db() { docker exec -i "$DB" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qtA "$@"; }

cleanup() { psql_db -c "delete from auth.users where id in ('$A','$B');" >/dev/null; }
trap cleanup EXIT
cleanup
psql_db -c "insert into auth.users (id, instance_id, aud, role, email) values
  ('$A','00000000-0000-0000-0000-000000000000','authenticated','authenticated','conc-a@test.local'),
  ('$B','00000000-0000-0000-0000-000000000000','authenticated','authenticated','conc-b@test.local');
  update public.profiles set role = 'manager' where id in ('$A','$B');
  insert into auth.sessions (id, user_id) values ('$A','$A'), ('$B','$B');" >/dev/null

# Chaque session garde son verrou 2 s avant de valider, pour forcer le chevauchement.
demote() { # $1 = appelant, $2 = cible
  psql_db 2>&1 <<SQL || true
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"$1","session_id":"$1","role":"authenticated"}', true);
select 'ok:' || role from public.set_user_role('$2', 'executant');
select pg_sleep(2);
commit;
SQL
}
demote "$A" "$B" > "${TMPDIR:-/tmp}/conc-a.out" &
demote "$B" "$A" > "${TMPDIR:-/tmp}/conc-b.out" &
wait

ok=$(cat "${TMPDIR:-/tmp}"/conc-[ab].out | grep -c '^ok:' || true)
denied=$(cat "${TMPDIR:-/tmp}"/conc-[ab].out | grep -c 'forbidden' || true)
managers=$(psql_db -c "select count(*) from public.profiles where id in ('$A','$B') and role = 'manager';")
echo "réussites=$ok refus=$denied managers_restants=$managers"
if [ "$ok" = 1 ] && [ "$denied" = 1 ] && [ "$managers" = 1 ]; then
  echo "TEST-017 PASSED"
else
  echo "TEST-017 FAILED"; cat "${TMPDIR:-/tmp}"/conc-[ab].out; exit 1
fi
