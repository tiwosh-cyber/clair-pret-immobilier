# PLAN_IMPLEMENTATION — Clair

> Copie Markdown du plan **VALIDÉ** dans Notion « 07 — Plan d'implémentation » (synchronisation Notion → Markdown du 2026-11-13). Notion reste la source de vérité produit. Tient lieu d'`IMPLEMENTATION_PLAN.md` (nom imposé par la structure du dépôt, pas de doublon).
> L'original `PLAN_IMPLEMENTATION.md` du Drive (`G:\Mon Drive\…\clair - app`) n'était pas accessible depuis ce poste : ce fichier a été reconstitué à partir de la page Notion 07.

## 1. Références et périmètre
- Source de vérité : pages Notion du projet « Maquette prêt bancaire » ; Markdown de passation dans `10-DOCS/`, `01-FRONTEND/`, `03-DATABASE/`, `04-AUTH/`, `06-SECURITY/`, `07-INFRASTRUCTURE/`.
- MVP inclus : F-001 → F-011 (voir `10-DOCS/PRD.md`).
- Architecture : React/htm local (Vite), Supabase Auth + PostgreSQL + RLS, API-001 dans PostgreSQL, pas de serveur Node applicatif.
- Décisions techniques VALIDÉES (2026-11-13) : Q-T1 dépôt Git local hors Drive · Q-T2 Supabase local via Docker pour les tests · Q-T3 JavaScript + htm, typecheck NON APPLICABLE · Q-T4 Playwright pour l'E2E.
- Ouvert : Q-T5 URL GitHub À DÉFINIR (non bloquant pour coder). Réserve RGPD (phase 05) toujours ouverte → comptes fictifs uniquement.
- Écart à signaler : Q-T1 citait `C:\dev\clair-app` ; le propriétaire a demandé le 2026-11-13 de travailler dans `…\CLAIR PRET BANCAIRE\CLAIR` (toujours hors Drive). À reporter dans Notion si confirmé.

## 2. Règles d'exécution
Voir `AGENTS.md` (sections « Implementation plan and lot validation » et « Git »). Un lot à la fois, branche `lot-NN-nom` depuis `main` à jour, validation humaine « Je valide l'étape N » / « Je valide le lot NN », l'utilisateur pousse et ouvre la Pull Request, fusion après accord.

## 3. Vue d'ensemble des lots

| N° | Lot | IDs | Dépend de | Critère principal | Revue sécu | Statut |
|---|---|---|---|---|---|---|
| 01 | Fondations | Vite + React/htm, portage du prototype, CI | — | L'app démarre localement ; scripts et CI vérifiés ; aucun secret versionné | — | EN COURS |
| 02 | Simulateur | F-001→F-006 / AC-001→AC-007 / E-002 | 01 | Calculs et validations testés (Vitest), CI verte | — | À FAIRE |
| 03 | Base et sécurité Supabase locale | T-001 / API-001 / RLS | 01 | pgTAP : RLS, API-001, refus anonyme/Exécutant, auto-rétrogradation, concurrence | — | À FAIRE |
| 04 | Authentification | F-007→F-009 / AC-008→AC-012 / E-001 | 02 + 03 | Inscription/connexion/déconnexion Supabase réelles, accès fermé après déconnexion | — | À FAIRE |
| 05 | Gestion des profils | F-010, F-011 / AC-013→AC-016 / E-003 | 04 | Liste et changement de rôle Manager via API-001 ; Exécutant refusé | — | À FAIRE |
| 06 | Vérifications transversales | E2E, accessibilité, release gate | 05 | Playwright + axe 375/768/1440 px ; aucun constat CRITIQUE/ÉLEVÉE | — | À FAIRE |

Ordre : 01 → 02 et 03 (indépendants) → 04 (requiert 02 + 03) → 05 → 06.
Critères par lot : tests réellement exécutés et rapportés ; revue sécurité indépendante sans constat CRITIQUE/ÉLEVÉE ouvert ; CI verte à partir du lot 02 ; test d'accès interdit pour les lots 03, 04, 05, 06.
Stratégie de tests : Vitest (calcul, validation), pgTAP sur Supabase local (RLS, API-001, refus Exécutant/anonyme, auto-rétrogradation, concurrence, jeton après déconnexion), Playwright + axe (E2E, 375/768/1440 px), `npm audit`. Tests manuels utilisateur : Safari/iOS, Firefox, VoiceOver/NVDA, zoom 200 %. Comptes fictifs uniquement.

## 4. Fiches de lot

### Étape 01 — Fondations
**CE QUI EST ATTENDU**
- Objectif : le prototype validé tourne dans un projet Vite local (`01-FRONTEND/`), à l'identique, avec lint, tests, build, audit et CI.
- Références : prototype `01-FRONTEND/prototypes/clair-demo` (E-001, E-002, E-003).
- Branche : `lot-01-fondations`.
- Hors périmètre : correction des règles du simulateur (lot 02), Supabase réel (lots 03-04). Le faux login du prototype reste en place jusqu'au lot 04.

**FIN DE LOT** — à compléter.

## 5. Journal des validations

| Date | Étape | Phrase exacte de l'utilisateur | Branche | Remarques |
|---|---|---|---|---|
| 2026-11-13 | Découpage | « Je valide le découpage, enregistre le plan. » | — | Notion 07 |
| 2026-11-13 | Plan global | « Je valide le plan, suis tes recommandations pour Q-T1 à Q-T4 » | — | Notion 07 |

## 6. Questions bloquantes (techniques)

| Sujet | Impact | Options | Décision |
|---|---|---|---|
| Q-T5 URL GitHub | PR / CI distante | Créer un dépôt GitHub privé / rester local | À DÉFINIR |
| Projet Supabase distant | Lot 04 (auth réelle) | Projet Free région UE à créer par le propriétaire | À DÉFINIR |
