// TEST-018 — Surface de la Data API Supabase vue par un visiteur anonyme (clé publique).
// Prérequis : `npx supabase start`. Usage (depuis la racine) :
//   eval "$(npx supabase status -o env | grep -E '^(API_URL|ANON_KEY)=')" && API_URL=$API_URL ANON_KEY=$ANON_KEY node --test 08-TESTS/security/api-surface.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

const url = process.env.API_URL;
const key = process.env.ANON_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

test("variables présentes", () => {
  assert.ok(url && key, "API_URL et ANON_KEY requis");
});

test("anon ne lit pas T-001", async () => {
  const r = await fetch(`${url}/rest/v1/profiles?select=*`, { headers });
  assert.ok([401, 403].includes(r.status), `statut ${r.status}`);
});

test("anon ne peut pas appeler API-001", async () => {
  const r = await fetch(`${url}/rest/v1/rpc/set_user_role`, {
    method: "POST", headers,
    body: JSON.stringify({ target_id: "00000000-0000-0000-0000-000000000001", new_role: "manager" }),
  });
  assert.ok([401, 403].includes(r.status), `statut ${r.status}`);
});

test("anon ne peut pas lister les profils", async () => {
  const r = await fetch(`${url}/rest/v1/rpc/list_profiles`, { method: "POST", headers, body: "{}" });
  assert.ok([401, 403].includes(r.status), `statut ${r.status}`);
});

test("le schéma privé n'est pas exposé", async () => {
  const r = await fetch(`${url}/rest/v1/rpc/set_user_role`, {
    method: "POST", headers: { ...headers, "Content-Profile": "private" },
    body: JSON.stringify({ target_id: "00000000-0000-0000-0000-000000000001", new_role: "manager" }),
  });
  assert.equal(r.status, 406, `statut ${r.status}`);
});
