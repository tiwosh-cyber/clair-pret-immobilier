// TEST-023 → TEST-030 — Authentification et autorisations réelles (lots 04-05) sur Supabase local.
// Usage (racine du dépôt) : eval "$(npx supabase status -o env | grep -E '^(API_URL|ANON_KEY)=')"
//   puis dans 01-FRONTEND : API_URL=$API_URL ANON_KEY=$ANON_KEY npm run test:integration
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { loadRole } from "../../src/services/auth.js";

const url = process.env.API_URL;
const key = process.env.ANON_KEY;
const DB = process.env.SUPABASE_DB_CONTAINER || "supabase_db_clair";
if (!url?.startsWith("http://127.0.0.1") && !url?.startsWith("http://localhost"))
  throw new Error("API_URL doit pointer vers Supabase LOCAL");

const sql = (q) => execFileSync("docker", ["exec", "-i", DB, "psql", "-U", "postgres", "-d", "postgres", "-qtA", "-c", q]).toString().trim();
const client = () => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const run = Date.now();
const mail = (n) => `it-${run}-${n}@test.local`;
const PASSWORD = "Test-Clair-1234";

let exec, manager, execId, managerId;

beforeAll(async () => {
  exec = client();
  const a = await exec.auth.signUp({ email: mail("exec"), password: PASSWORD, options: { data: { role: "manager" } } });
  expect(a.error).toBeNull();
  execId = a.data.user.id;
  manager = client();
  const b = await manager.auth.signUp({ email: mail("manager"), password: PASSWORD });
  expect(b.error).toBeNull();
  managerId = b.data.user.id;
  // Amorçage opérateur par UUID (procédure 03-DATABASE/DATABASE.md).
  expect(sql(`update public.profiles set role = 'manager' where id = '${managerId}' returning 1`)).toBe("1");
});

afterAll(() => {
  sql(`delete from auth.users where email like 'it-${run}-%@test.local'`);
});

describe("TEST-023 inscription sans confirmation (AC-008, AC-009, AC-011)", () => {
  it("session immédiate et profil Exécutant, même si les métadonnées réclament Manager", async () => {
    expect(await loadRole(exec, execId)).toBe("Exécutant");
  });
  it("doublon refusé", async () => {
    const { error } = await client().auth.signUp({ email: mail("exec"), password: PASSWORD });
    expect(error?.code).toBe("user_already_exists");
  });
});

describe("TEST-024 connexion (AC-010)", () => {
  it("mauvais mot de passe refusé", async () => {
    const { error } = await client().auth.signInWithPassword({ email: mail("exec"), password: "mauvais-mdp" });
    expect(error?.code).toBe("invalid_credentials");
  });
  it("connexion valide → lecture de son seul profil", async () => {
    const c = client();
    const { error } = await c.auth.signInWithPassword({ email: mail("exec"), password: PASSWORD });
    expect(error).toBeNull();
    const { data } = await c.from("profiles").select("*");
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe(execId);
  });
});

describe("TEST-025 Exécutant refusé via l'API (AC-012, AC-013, AC-014, AC-016)", () => {
  it("annuaire refusé", async () => {
    const { error } = await exec.rpc("list_profiles");
    expect(error?.message).toBe("forbidden");
  });
  it("changement de rôle d'autrui refusé", async () => {
    const { error } = await exec.rpc("set_user_role", { target_id: managerId, new_role: "executant" });
    expect(error?.message).toBe("forbidden");
  });
  it("auto-promotion refusée", async () => {
    const { error } = await exec.rpc("set_user_role", { target_id: execId, new_role: "manager" });
    expect(error?.message).toBe("self_change_forbidden");
  });
  it("écritures directes sur T-001 refusées", async () => {
    expect((await exec.from("profiles").update({ role: "manager" }).eq("id", execId)).error).not.toBeNull();
    expect((await exec.from("profiles").insert({ id: crypto.randomUUID() })).error).not.toBeNull();
    expect((await exec.from("profiles").delete().eq("id", execId)).error).not.toBeNull();
    expect(sql(`select role from public.profiles where id = '${execId}'`)).toBe("executant");
  });
});

describe("TEST-026 Manager (AC-013 → AC-016)", () => {
  it("annuaire : e-mails et rôles uniquement", async () => {
    const { data, error } = await manager.rpc("list_profiles", { page_limit: 100, page_offset: 0 });
    expect(error).toBeNull();
    const row = data.find((r) => r.id === execId);
    expect(row).toEqual({ id: execId, email: mail("exec"), role: "executant" });
  });
  it("rôle invalide refusé sans modification", async () => {
    const { error } = await manager.rpc("set_user_role", { target_id: execId, new_role: "admin" });
    expect(error).not.toBeNull();
  });
  it("auto-rétrogradation refusée", async () => {
    const { error } = await manager.rpc("set_user_role", { target_id: managerId, new_role: "executant" });
    expect(error?.message).toBe("self_change_forbidden");
  });
  it("promotion puis rétrogradation d'un autre compte", async () => {
    let r = await manager.rpc("set_user_role", { target_id: execId, new_role: "manager" });
    expect(r.data).toEqual([{ id: execId, role: "manager" }]);
    r = await manager.rpc("set_user_role", { target_id: execId, new_role: "executant" });
    expect(r.data).toEqual([{ id: execId, role: "executant" }]);
  });
});

describe("TEST-027 déconnexion : accès fermé (AC-010)", () => {
  it("jeton conservé après déconnexion → opérations privilégiées refusées, refresh révoqué", async () => {
    const c = client();
    await c.auth.signInWithPassword({ email: mail("manager"), password: PASSWORD });
    const { data: { session } } = await c.auth.getSession();
    await c.auth.signOut();
    const stolen = createClient(url, key, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${session.access_token}` } },
    });
    const { error } = await stolen.rpc("list_profiles");
    expect(error?.message).toBe("not_authenticated");
    const refreshed = await client().auth.refreshSession({ refresh_token: session.refresh_token });
    expect(refreshed.error).not.toBeNull();
  });
});

describe("TEST-028 compte sans profil T-001", () => {
  it("accès refusé (pas de rôle par défaut côté client)", async () => {
    const c = client();
    const { data } = await c.auth.signUp({ email: mail("noprofile"), password: PASSWORD });
    sql(`delete from public.profiles where id = '${data.user.id}'`);
    await expect(loadRole(c, data.user.id)).rejects.toThrow("profile_missing");
  });
});
