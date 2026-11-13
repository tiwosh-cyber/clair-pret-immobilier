# Revue sécurité — LOT 02 « Simulateur » (Clair)

Date : 2026-11-13 · Branche : `lot-02-simulateur` · Relecteur : sous-agent indépendant `security-reviewer`.

**Verdict : AUCUN BLOQUANT.** Aucune régression (factorisation `toNumber` / `euro` à l'identique), validations conformes à AC-001/002/006, aucune injection (rendu texte htm/React), regex linéaire. Une revue IA ne garantit pas la sécurité.

| Sévérité | Fichier | Constat | Suite |
|---|---|---|---|
| FAIBLE | `loan.js` | Perte de précision flottante : `"12.0000000000000001"` / `"5000.0000000000001"` acceptés | **CORRIGÉ** : décimales lues sur le texte ; tests ajoutés |
| FAIBLE / À VÉRIFIER | `loan.js` | `"12.0"` et `"5000,0"` acceptés (valeur entière, décimales nulles) | Conservé : cohérent avec « durée entière » ; à confirmer côté produit (non bloquant) |
| FAIBLE | `main.js` | Pas de `maxLength` sur les champs | **CORRIGÉ** : `maxlength=12` |
| À VÉRIFIER (hors lot) | `main.js` | Mot de passe de démo codé en dur | Supprimé au lot 04 |

Tests ajoutés suite à la revue : précision flottante, `"5,000.5"`, `"5000,"`, `",5"`, chiffres pleine largeur. Non couvert : test au niveau composant d'AC-005/AC-006 (prévu en E2E au lot 06).
