# Revue sécurité — LOT 01 « Fondations » (Clair)

Date : 2026-11-13 · Branche : `lot-01-fondations` · Relecteur : sous-agent indépendant `security-reviewer` (lecture seule).

**Verdict : AUCUN BLOQUANT** (aucun CRITIQUE / ÉLEVÉE). Une revue IA réduit les risques mais ne garantit pas la sécurité.

## Constats et suites données

| Sévérité | Fichier | Constat | Suite |
|---|---|---|---|
| MOYENNE | `01-FRONTEND/index.html` | Polices chargées depuis Google Fonts (IP des visiteurs transmise, RGPD ; contredit « aucune donnée transmise » ; empêche une CSP `self`) | **CORRIGÉ** : `@fontsource-variable/inter` servi localement, liens Google supprimés, aucune référence Google dans `dist/` |
| MOYENNE | `supabase/config.toml` | `auto_expose_new_tables` par défaut `true` : toute table/fonction de `public` exposée à `anon`/`authenticated` | **CORRIGÉ** : `auto_expose_new_tables = false` ; GRANT explicites + `REVOKE EXECUTE … FROM PUBLIC, anon` + test pgTAP au lot 03 |
| MOYENNE | `supabase/config.toml` | `enable_confirmations = false` (décision validée) + `secure_password_change = false` | **CORRIGÉ** : `secure_password_change = true` ; au lot 04, aucun droit ne dépend de l'adresse e-mail |
| FAIBLE | `.github/workflows/ci.yml` | Actions épinglées par tag, `persist-credentials` par défaut | **PARTIEL** : `persist-credentials: false` ajouté ; épinglage par SHA à faire à la création du dépôt GitHub (Q-T5) |
| FAIBLE | `.github/workflows/ci.yml` | `push` sur `main` uniquement | Dépôt local initialisé sur `main` ; vérifier la branche par défaut sur GitHub (Q-T5) |
| FAIBLE | `01-FRONTEND/index.html` | `onclick` en ligne sur le lien d'évitement (bloque une CSP stricte) | Reporté au lot 06 (CSP / accessibilité) |
| FAIBLE | `supabase/config.toml` | `password_requirements` vide, pas de captcha | Reporté au lot 04 (`letters_digits`, captcha sur le projet distant) |
| FAIBLE | `supabase/config.toml` | `storage.s3_protocol` / `storage.vector` actifs alors que Storage est désactivé | **CORRIGÉ** : passés à `false` |
| FAIBLE | `supabase/config.toml` | `site_url` localhost : ne jamais `config push` ce fichier tel quel vers le distant | Documenté ; configuration distante séparée au lot 04 |
| FAIBLE (hors lot) | `01-FRONTEND/src/main.js` | Faux login du prototype : mot de passe public codé en dur, mots de passe saisis en clair dans `sessionStorage`, rôle modifiable | Accepté par conception jusqu'au lot 04 (`AUTH.md`), qui supprime tout ; `DemoClair2026` jamais réutilisé dans Supabase |

## Tests négatifs recommandés
- Lot 02 : `validateNumber` avec `"-5000"`, `"1e4"`, `"0x1388"`, `" 5000 "`, `"5000,0"`, `"Infinity"`, chiffres très longs, `"0"`, `"12.0"` ; `computeLoan(x, 0)` jamais appelé ou gardé.
- Lot 03 : pgTAP prouvant l'absence de GRANT / EXECUTE non prévus pour `anon` et `authenticated` dans `public`.

## Non couvert
CI distante non exécutée (pas de dépôt GitHub) ; `app.css` non relu ; pas d'en-têtes HTTP / CSP (pas d'hébergement) ; comportement réel de `storage.*` désactivé non testé.
