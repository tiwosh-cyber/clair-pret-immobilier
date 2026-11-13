# Base de données — Clair / T-001 Profils

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Schéma conceptuel VALIDÉ, aucune migration réelle
| Identifiant | Colonne | Type logique | Règles |
|---|---|---|---|
| T-001 Profils | `id` | UUID | PK, non nul, FK sur `auth.users.id` ; une ligne max par utilisateur, suppression liée |
| T-001 Profils | `role` | enum logique/text contraint | non nul, valeurs internes `executant` / `manager` ; défaut `executant` |

L'e-mail et les mots de passe hachés restent dans Supabase Auth. Ne pas dupliquer e-mails/mots de passe dans T-001. L'e-mail n'est pas confirmé dans la démo (confirmation désactivée). Aucune autre entité métier, table de prêt, stockage de résultat ou table multi-tenant.

## Index / relations / rétention
- L'index PK sur `id` suffit pour le volume réduit ; pas d'index `role` supplémentaire requis en conception.
- Compte Auth créé → profil Exécutant par mécanisme interne contrôlé ; création de profil en échec → refuser ouverture du produit, sans permission par défaut côté client.
- Suppression de compte Auth → suppression en cascade du profil (la réalisation et l'ordre de révocation sont à vérifier).
- Comptes de démo authentifiés : suppression **au plus tard 7 jours après fin des essais**. Compte « non confirmé » : NON APPLICABLE au flux actuel ; ancienne période 7 j conservée seulement en historique Notion.
- Résultats du simulateur : mémoire frontend uniquement ; exports chiffrés de sauvegarde applicative : conservation 7 j si utilisés. Un export des profils **ne suffit pas** à restaurer Auth.

## Autorisations T-001 — RLS IMPLÉMENTÉE au lot 03 (`supabase/migrations/20261113000000_t001_profiles_api001.sql`)
| Action | Anonyme | Exécutant | Manager |
|---|---|---|---|
| Lire son propre UUID/rôle | Refusé | Oui | Oui |
| Lister tous les profils (e-mails/rôles) | Refusé | Refusé | Via lecture privilégiée contrôlée |
| INSERT direct T-001 | Refusé | Refusé | Refusé |
| UPDATE / DELETE directs T-001 | Refusé | Refusé | Refusé |
| Changer rôle d'autrui | Refusé | Refusé | **API-001 exclusivement** |
| Changer son propre rôle Manager | Refusé | Refusé | Refusé |

- RLS sur table exposée, vérification des GRANT + policies, pas de simple `authenticated` sans prédicat. La lecture du propre profil est limitée à `auth.uid() = id`; mécanisme privilégié pour Manager et e-mails Auth minimalistes.
- Si `SECURITY DEFINER` indispensable : routine en schéma privé, `search_path` fixé, identité et rôle vérifiés, EXECUTE retiré de PUBLIC/anon, façade explicitement contrôlée ; éviter exposition de `auth.users` et de clés privilégiées.
- API-001 : ordre stable de verrouillage, relecture rôle appelant après verrouillage, écriture atomique. Rejouer même demande retourne l'état demandé, sans double inversion de rôle.

**Prouvé au lot 03 (Supabase local, 2026-11-13)** : `npx supabase test db` 36/36 (TEST-010→016 : droits SQL, RLS, anonyme/Exécutant/Manager, auto-promotion, rejeu, cible absente, rôle périmé, cascade) ; `bash 08-TESTS/security/api001-concurrency.sh` (TEST-017 concurrence) ; `node --test 08-TESTS/security/api-surface.test.mjs` (TEST-018 surface HTTP anonyme). Restent à prouver au lot 04 : révocation de session, profil absent côté interface.

### Amorçage du premier Manager (procédure opérateur)
Jamais via l'inscription publique, et **jamais par e-mail** (adresses non vérifiées : un tiers peut s'inscrire avec l'adresse prévue).
1. L'opérateur crée le compte lui-même : Dashboard > Authentication > Add user (ou se connecte à l'application et relève son UUID dans Authentication > Users).
2. Avec un accès privilégié (SQL Editor du Dashboard ou `psql` local) : `update public.profiles set role = 'manager' where id = '<UUID du compte>';`
3. Vérifier que la commande a touché **exactement 1 ligne** ; sinon arrêter et enquêter.

**Historique phase 06 — à tester :** SELECT, INSERT, UPDATE, DELETE anonymes/Exécutant/Manager ; accès direct, auto-promotion, concurrence, révocation, profil absent, rôle périmé et suppression en cascade.

**Traçabilité :** [D02](https://app.notion.com/p/416282ff070c80cca178f8341bf0513b) · [D04](https://app.notion.com/p/416282ff070c809395d5c6339be59c2a) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
