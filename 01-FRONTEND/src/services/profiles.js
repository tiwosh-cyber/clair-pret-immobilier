// E-003 : annuaire et API-001. Toutes les décisions d'autorisation sont prises par la base.
import { ROLE_LABELS } from "./auth.js";

const INTERNAL = { Exécutant: "executant", Manager: "manager" };

export async function fetchProfiles(client) {
  const { data, error } = await client.rpc("list_profiles", { page_limit: 100, page_offset: 0 });
  if (error) throw error;
  return data.map((p) => ({ id: p.id, email: p.email, role: ROLE_LABELS[p.role] }));
}

export async function changeRole(client, targetId, nextLabel) {
  const { data, error } = await client.rpc("set_user_role", {
    target_id: targetId,
    new_role: INTERNAL[nextLabel],
  });
  if (error) throw error;
  return { id: data[0].id, role: ROLE_LABELS[data[0].role] };
}

// Messages sûrs ; `reload` indique qu'il faut relire l'état serveur (rôle ou liste).
export function roleErrorInfo(error) {
  switch (error?.message) {
    case "self_change_forbidden":
      return { text: "Action interdite : vous ne pouvez pas modifier votre propre rôle.", reload: false };
    case "forbidden":
      return { text: "Action refusée : votre rôle ne permet plus cette opération.", reload: "role" };
    case "not_authenticated":
      return { text: "Votre session a expiré. Reconnectez-vous.", reload: "session" };
    case "target_not_found":
      return { text: "Ce compte n’existe plus. La liste a été actualisée.", reload: "list" };
    default:
      // Réponse incertaine (réseau) : la modification a pu être appliquée, on relit la liste.
      return { text: "La modification n’a pas pu être confirmée. La liste a été relue : vérifiez le rôle affiché.", reload: "list" };
  }
}
