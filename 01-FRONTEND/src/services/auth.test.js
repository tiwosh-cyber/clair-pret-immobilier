import { describe, expect, it } from "vitest";
import { authErrorMessage, loadRole, validateCredentials } from "./auth.js";

const client = (result) => ({
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => result }) }) }),
});

describe("TEST-020 loadRole — rôle relu en base", () => {
  it("Exécutant et Manager", async () => {
    expect(await loadRole(client({ data: { role: "executant" } }), "u")).toBe("Exécutant");
    expect(await loadRole(client({ data: { role: "manager" } }), "u")).toBe("Manager");
  });
  it("profil absent → refus (pas de rôle par défaut côté client)", async () => {
    await expect(loadRole(client({ data: null }), "u")).rejects.toThrow("profile_missing");
  });
  it("rôle inconnu → refus", async () => {
    await expect(loadRole(client({ data: { role: "admin" } }), "u")).rejects.toThrow("profile_missing");
  });
  it("erreur réseau / RLS → refus", async () => {
    await expect(loadRole(client({ error: { message: "x" } }), "u")).rejects.toThrow("profile_unavailable");
  });
});

describe("TEST-021 messages d'erreur sûrs", () => {
  it("identifiants incorrects sans révéler l'existence du compte", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toMatch(/Identifiants incorrects/);
  });
  it("doublon d'inscription", () => {
    expect(authErrorMessage({ code: "user_already_exists" })).toMatch(/existe déjà/);
  });
  it("erreur inconnue ou réseau → message générique", () => {
    expect(authErrorMessage({ code: "unexpected", message: "stack trace" })).not.toMatch(/stack/);
    expect(authErrorMessage(undefined)).toMatch(/Service indisponible/);
  });
});

describe("TEST-022 validation des identifiants", () => {
  it("accepte une saisie valide", () => expect(validateCredentials("a@b.fr", "12345678")).toEqual({}));
  it("refuse e-mail invalide et mot de passe court", () => {
    const e = validateCredentials("pas-un-email", "123");
    expect(e.email).toBeTruthy();
    expect(e.password).toBeTruthy();
  });
});
