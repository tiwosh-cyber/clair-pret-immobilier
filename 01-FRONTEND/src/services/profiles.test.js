import { describe, expect, it } from "vitest";
import { changeRole, fetchProfiles, roleErrorInfo } from "./profiles.js";

const rpcClient = (result, calls = []) => ({
  rpc: async (name, args) => {
    calls.push([name, args]);
    return result;
  },
});

describe("TEST-029 annuaire (AC-013)", () => {
  it("libellés de rôles et pagination plafonnée", async () => {
    const calls = [];
    const list = await fetchProfiles(rpcClient({ data: [{ id: "1", email: "a@t.fr", role: "manager" }] }, calls), "x");
    expect(list).toEqual([{ id: "1", email: "a@t.fr", role: "Manager" }]);
    expect(calls[0]).toEqual(["list_profiles", { page_limit: 100, page_offset: 0 }]);
  });
  it("refus serveur propagé", async () => {
    await expect(fetchProfiles(rpcClient({ error: { message: "forbidden" } }))).rejects.toMatchObject({ message: "forbidden" });
  });
});

describe("TEST-030 API-001 côté client (AC-014 → AC-016)", () => {
  it("envoie l'identifiant et le rôle interne", async () => {
    const calls = [];
    const r = await changeRole(rpcClient({ data: [{ id: "2", role: "manager" }] }, calls), "2", "Manager");
    expect(r).toEqual({ id: "2", role: "Manager" });
    expect(calls[0]).toEqual(["set_user_role", { target_id: "2", new_role: "manager" }]);
  });
  it.each([
    ["self_change_forbidden", false],
    ["forbidden", "role"],
    ["not_authenticated", "session"],
    ["target_not_found", "list"],
    ["Failed to fetch", "list"],
  ])("%s → relecture %s", (message, reload) => {
    expect(roleErrorInfo({ message }).reload).toBe(reload);
  });
});
