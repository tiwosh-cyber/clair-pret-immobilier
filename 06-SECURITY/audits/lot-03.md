# Revue sécurité — LOT 03 « Base et sécurité Supabase locale » (Clair)

Date : 2026-11-13 · Branche : `lot-03-supabase-securite` · Relecteur : sous-agent indépendant `security-reviewer`.

**Verdict : AUCUN BLOQUANT** (aucun CRITIQUE / ÉLEVÉE). Points jugés corrects : `search_path = ''`, EXECUTE retiré à PUBLIC/anon, aucune policy d'écriture, contrôles avant écriture (`forbidden` avant `target_not_found`), verrouillage ordonné sans deadlock, relecture du rôle après verrou (TEST-017), rejeu idempotent, annuaire plafonné. Une revue IA ne garantit pas la sécurité.

| Sévérité | Constat | Suite |
|---|---|---|
| MOYENNE | Amorçage du premier Manager par e-mail (adresses non vérifiées, inscription ouverte → usurpation) | **CORRIGÉ** : procédure par UUID, vérification « exactement 1 ligne » (`03-DATABASE/DATABASE.md`) |
| MOYENNE | Routines privilégiées fondées sur le seul `sub` du JWT : jeton utilisable jusqu'à 1 h après déconnexion | **CORRIGÉ** : `private.assert_active_session()` exige une session `auth.sessions` active ; TEST-019 (session révoquée, jeton sans `session_id`) |
| MOYENNE | Droits par défaut : futures fonctions de `private` exécutables par PUBLIC | **CORRIGÉ** : `alter default privileges … revoke execute`; test d'inventaire (exactement 2 routines exécutables) |
| FAIBLE | FORCE RLS ne protège pas les routines SECURITY DEFINER | **CORRIGÉ** : commentaire explicite dans la migration |
| FAIBLE | Relecture après verrou dépendante de VOLATILE implicite | **CORRIGÉ** : `volatile` explicite + commentaire ; TEST-017 en CI |
| FAIBLE | Actions CI épinglées par tag | Ouvert : épinglage par SHA en phase 09 |
| FAIBLE | TEST-018 absent de la CI et acceptait 404 | **CORRIGÉ** : `supabase start` en CI + TEST-018, statuts 401/403 exigés |
| FAIBLE | Annuaire : e-mails non vérifiés affichés | Lot 05 : rendu échappé (htm), mention « e-mail non vérifié », confirmation avec e-mail exact |
| FAIBLE | Pas de journal des changements de rôle | Accepté pour la démo (optionnel) |
| À VÉRIFIER | Trigger non testé via une vraie inscription GoTrue (`user_metadata.role`) | Lot 04 : test d'intégration `signUp` avec `data.role = 'manager'` |
| À VÉRIFIER | Exposition pg_graphql | **CORRIGÉ** : `graphql_public` retiré de `[api].schemas` |

Tests après corrections (Supabase local, CLI 3.1.0) : `npx supabase test db` 41/41 PASS · TEST-017 concurrence PASS · TEST-018 surface HTTP 5/5 PASS (strict).
Restent pour le lot 04 : appels HTTP authentifiés Exécutant (403), PATCH/POST/DELETE directs, utilisateur sans profil, valeur d'enum invalide en HTTP.
