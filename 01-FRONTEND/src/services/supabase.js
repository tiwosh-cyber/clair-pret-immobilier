import { createClient } from "@supabase/supabase-js";

// Configuration publique uniquement (URL + clé publishable). Jamais de clé service_role ici.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        // Session limitée à l'onglet : rien ne survit à sa fermeture sur un poste partagé.
        auth: { storage: window.sessionStorage, persistSession: true, autoRefreshToken: true },
      })
    : null;
