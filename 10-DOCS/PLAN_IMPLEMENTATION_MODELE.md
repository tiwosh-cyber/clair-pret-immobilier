# PLAN_IMPLEMENTATION — [Nom du produit]

> Généré par Claude (`/plan-projet`, étape 4 : audit en lecture seule, puis enregistrement après « Enregistre le plan ») à partir des documents de spécification validés. Copier ce modèle en `10-DOCS/PLAN_IMPLEMENTATION.md`. Ne pas remplir arbitrairement les décisions manquantes : elles vont dans `QUESTIONS_PRODUIT.md`.

## 1. Références et périmètre

- Source de vérité : documents Markdown de `SAAS-TEMPLATE` (version / date : `[AAAA-MM-JJ]`)
- Origine des décisions : `[documents Markdown validés, phases 01–06]`
- MVP inclus : `[F-001, F-002…]`
- Hors MVP : `[références]`
- Architecture : `[Supabase géré / API personnalisée / hybride]` — stack : `[technologies]`
- Décisions en suspens : `[Q-001… avec impact]`

## 2. Règles d'exécution

1. **Avant tout code**, présenter ce document et attendre : « Je valide le plan ».
2. **Un seul lot à la fois.** Le lot suivant nécessite : « Je valide l'étape N ».
3. Pour chaque lot, exécuter les tests réellement disponibles, indiquer les commandes et leurs résultats ; ne jamais inventer un test réussi.
4. Chaque lot se termine par une **revue sécurité indépendante** (`security-reviewer`, rapport dans `06-SECURITY/audits/`). Un constat `CRITIQUE` **ou `ÉLEVÉE`** ouvert bloque le passage à `À VALIDER`, sauf acceptation écrite du risque par l'utilisateur. Une revue IA réduit les risques mais ne garantit pas la sécurité.
5. À partir du lot 02, la CI créée au lot 01 doit passer (ou l'échec est documenté `NON VÉRIFIÉ` et accepté).
6. Présenter un mini-test utilisateur simple pour chaque lot, avec au moins un contrôle d'accès interdit.
7. Cycle Git : `main` à jour → branche `lot-NN` → contrôles + revue → « Je valide l'étape N » → `/cloturer-lot N` (statut `VALIDÉ` noté **sur la branche du lot**, commit, revue du diff, fusion `--no-ff` dans `main` avec ton accord, contrôles relancés sur `main`, qui reste propre) → lot suivant depuis `main`. Si `main` échoue après fusion : branche `lot-NN-correctif`, jamais de correction directe sur `main`. Jamais de push par Claude.
8. Ne pas déployer, pousser, supprimer des données ou appliquer des migrations distantes ou destructives : la mise en ligne relève de l'étape 6 (`/livraison`) et c'est l'utilisateur qui exécute.
9. Claude ne passe un lot à `VALIDÉ` qu'à la clôture, en citant la phrase exacte de l'utilisateur dans le journal.

## 3. Vue d'ensemble des lots

**Adapter les lots au PRD : supprimer les éléments inutiles, scinder les lots trop gros, privilégier des tranches verticales testables de bout en bout (interface + données + autorisation + tests).**

| N° | Lot | Fonctionnalités / IDs | Dépend de | Critère principal | Revue sécu | Statut |
|---|---|---|---|---|---|---|
| 01 | Fondations du projet | Init stack, `.gitignore`, `.env.example`, Git sur `main`, scripts lint/typecheck/test/build, **CI**, audit des dépendances | — | L'application démarre localement ; scripts et CI vérifiés ; aucun secret versionné | — | À FAIRE |
| 02 | Première tranche MVP (parcours complet) | [F-… / US-…] | 01 | Parcours utilisable du début à la fin, permissions et RLS incluses | — | À FAIRE |
| 03 | Fonctionnalité MVP suivante | [F-… / US-…] | 02 | Critères d'acceptation testés | — | À FAIRE |
| … | [autres lots issus du PRD] | […] | […] | […] | — | À FAIRE |
| N | Vérifications transversales | Release gate sécurité, accessibilité, préparation de `DEPLOYMENT.md` | lots MVP | Aucun constat CRITIQUE/ÉLEVÉE ouvert ; prêt pour l'étape 6 (`/livraison preparation`) | — | À FAIRE |

Statuts : `À FAIRE` · `EN COURS` · `À VALIDER` · `VALIDÉ` (après fusion dans `main`) · `BLOQUÉ`.
Revue sécu : `—` · `AUCUN BLOQUANT` · `BLOQUANTS À CORRIGER` · `RISQUE ACCEPTÉ`.

## 4. Fiche d'un lot (à copier pour chaque lot)

### Étape [N] — [Titre]

**CE QUI EST ATTENDU**
- Objectif observable : [résultat concret]
- Références : [F-… · US-… · AC-… · E-… · API-…]
- Prérequis : [étapes validées, services, décisions]
- Branche Git : `lot-NN-[nom-court]`

**CE QUE CLAUDE DOIT CODER**
- Interface / routes : [uniquement si pertinentes]
- Données, migrations, API : [uniquement si pertinentes]
- Auth / rôles / RLS : [autorisations réellement nécessaires, opération par opération]
- Fichiers concernés (prévisionnel) : [chemins]
- Hors périmètre de ce lot : [exclusions]

**POINTS DE SÉCURITÉ DU LOT**
- Données sensibles manipulées : [lesquelles]
- Contrôles attendus : [propriété, isolation, validation, secrets…]
- Tests négatifs obligatoires : [utilisateur A vs B, non connecté, rôle insuffisant…]

**CRITÈRES D'ACCEPTATION**
- [ ] [Scénario normal mesurable]
- [ ] [Cas d'erreur pertinent]
- [ ] [Contrôle de permission / accès interdit]

**VÉRIFICATIONS**
- Commandes ou tests automatisés prévus : [noms exacts ou À DÉTERMINER]
- Mini-test utilisateur : [action observable + résultat attendu]
- Risques / données de test nécessaires : [si nécessaire]

**FIN DE LOT — À COMPLÉTER PAR CLAUDE**
- Fichiers modifiés :
- Tests réellement exécutés + résultats :
- Tests non exécutés + raisons :
- CI (statut réel ou NON VÉRIFIÉ + cause) :
- Revue sécurité (verdict, constats ouverts, chemin du rapport) :
- Risque accepté par l'utilisateur (citation exacte, sinon « aucun ») :
- Démonstration / URL locale :
- Problèmes restants :
- Statut : `À VALIDER` ou `BLOQUÉ` (avec la raison)
- Attente de réponse : **« Je valide l'étape [N] »**, puis `/cloturer-lot [N]`

**CLÔTURE — À COMPLÉTER PAR CLAUDE PENDANT `/cloturer-lot`, SUR LA BRANCHE DU LOT, AVANT LA FUSION**
- Phrase de validation de l'utilisateur et date :
- Branche fusionnée : `lot-NN-…` (le commit de fusion se retrouve avec `git log --merges`)
- Contrôles à relancer sur `main` après fusion : [commandes] — résultat donné dans la conversation ; en cas d'échec, lot `lot-NN-correctif`

## 5. Journal des validations

| Date | Étape | Phrase exacte de l'utilisateur | Branche | Remarques |
|---|---|---|---|---|
| [AAAA-MM-JJ] | Plan global | [« Je valide le plan »] | — | |

## 6. Questions bloquantes

Les questions produit sont tenues dans `QUESTIONS_PRODUIT.md` ; ne garder ici que les questions techniques.

| Sujet | Impact | Options | Décision |
|---|---|---|---|
| [sujet] | [lot bloqué] | [options sans hypothèse cachée] | À DÉFINIR |
