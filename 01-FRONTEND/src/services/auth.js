// Règles d'authentification indépendantes de l'interface (AC-008 → AC-012).
export const ROLE_LABELS = { executant: "Exécutant", manager: "Manager" };

// Messages sûrs : jamais de détail technique ni d'indication sur l'existence d'un compte à la connexion.
export function authErrorMessage(error) {
  switch (error?.code) {
    case "invalid_credentials":
      return "Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.";
    case "user_already_exists":
    case "email_exists":
      return "Un compte existe déjà avec cette adresse. Utilisez « Se connecter ».";
    case "weak_password":
      return "Mot de passe trop faible : utilisez au moins 8 caractères.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Trop de tentatives. Patientez quelques minutes puis réessayez.";
    case "signup_disabled":
      return "Les inscriptions sont fermées pour le moment.";
    default:
      return "Service indisponible. Vérifiez votre connexion puis réessayez.";
  }
}

// Le rôle est relu en base (T-001, RLS : uniquement son propre profil). Sans profil, pas d'accès.
export async function loadRole(client, userId) {
  const { data, error } = await client.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (error) throw new Error("profile_unavailable");
  if (!data || !ROLE_LABELS[data.role]) throw new Error("profile_missing");
  return ROLE_LABELS[data.role];
}

export function validateCredentials(email, password) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Saisissez une adresse e-mail valide.";
  if (password.length < 8) errors.password = "Utilisez au moins 8 caractères.";
  return errors;
}
