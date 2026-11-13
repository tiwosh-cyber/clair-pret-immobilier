# Clair — manifeste de passation proposé pour Claude Code

**Statut : documentation validée par le propriétaire (13/11/2026) ; intégration au dépôt local NON VÉRIFIÉE.** Fichiers préparés dans un **paquet indépendant** car aucun chemin local VS Code n'a été fourni. Ils n'ont **pas** été intégrés dans le dépôt Drive/local et n'ont pas été écrits dans Notion 06.

## Sources de vérité
- [Dashboard de la copie du projet](https://app.notion.com/p/416282ff070c807abe46c82502ee443f) — phases 01 à 05 Validée ; phase 06 À faire.
- [Phase 05 : GO AVEC RÉSERVES](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
- [Figma Clair](https://www.figma.com/design/wtOEvu4ByhQBenwgCVU5Kv/Clair-%E2%80%94-Phase-03-UX-UI-%C2%B7-Parcours-et-%C3%A9crans?node-id=0-1) ; [Drive demo](https://drive.google.com/drive/folders/1QX_fBNtHYzN5zW_Eop4MuDOBzHs0sCBq).

## Contenu du paquet
Les 10 fichiers sous `10-DOCS/`, `01-FRONTEND/`, `03-DATABASE/`, `04-AUTH/`, `06-SECURITY/`, `07-INFRASTRUCTURE/` sont des **propositions de remplacement ciblé de placeholders du template**. Ne pas écraser automatiquement un document local déjà personnalisé/validé. Comparer au préalable et fusionner sous contrôle humain.

**Mappings des noms demandés → existants dans le squelette Drive :**
- `DESIGN.md` → `10-DOCS/UX_UI.md` + `01-FRONTEND/DESIGN_SYSTEM.md` : pas de nouveau doublon.
- `API.md` → `10-DOCS/API_INTEGRATIONS.md`.
- `DATABASE.md` → `03-DATABASE/DATABASE.md`.
- `SECURITY.md` → `06-SECURITY/SECURITY.md`.
- `DEPLOYMENT.md` → `07-INFRASTRUCTURE/DEPLOYMENT.md`.
- `AGENTS.md` existe déjà dans le squelette **et ne doit pas être remplacé** par une version générique. `CLAUDE.md` et les consignes par domaine sont également préservés.

## Contradictions du template — décision nécessaire avant intégration
1. `AGENTS.md`, `10-DOCS/APP_FLOW.md` et `10-DOCS/QUESTIONS_PRODUIT.md` parlent d'**Excel/Markdown comme source de vérité**, alors que le projet validé impose **Notion** source de vérité produit. Dans cette passation, les Markdown sont des copies techniques ; l'**avenant de consignes agents a été autorisé par l'utilisateur** ; la modification reste à appliquer au dépôt local, sans écraser les règles non conflictuelles.
2. Le template `AGENTS.md` impose des étapes historiques « coding agent owns 4–6 », `PLAN_IMPLEMENTATION.md`, Git main/branches/CI par lots. Ici Product Builder V2 a **9 phases** (06 Passation ; 07 plan Claude ; 08 développement ; 09 livraison), **aucune branche Git imposée en phase 06**. Ne pas renommer ou écraser les autres règles ; l'utilisateur a autorisé l'alignement ciblé de la source de vérité Notion et des phases Product Builder V2, pas une refonte générale des consignes Git.
3. Le template dispose de documents techniques encore génériques (ex. Storage, custom backend, cloud providers), **NON APPLICABLES**. Ne pas remplir les répertoires facultatifs pour la démonstration.
4. Le prototype de `demo` utilise encore une confirmation fictive et des identifiants publics. **VALIDÉ après avenant :** version connectée Supabase sans confirmation e-mail et sans ces bypass ; ne modifier le prototype que pendant le développement autorisé.
5. Page 04 et 05 ont des notes narratives anciennes sur statut de l'architecture ; les **propriétés actuelles du dashboard font autorité** : 01–05 validées.

## Réserves GO AVEC RÉSERVES
**OUVERTES :** identité/contact responsable RGPD, notice, base juridique avant comptes de vrais testeurs ; tests de RLS, API-001, concurrence, révocation/session ; procédure de restauration ; tests manuels UX et quotas Free. Aucune résolution non prouvée.

## Transfert contrôlé
- L'utilisateur ouvre **le véritable dossier local VS Code** et utilise `INTEGRER_PHASE06.py` (d’abord lecture seule) pour comparer les chemins du paquet aux fichiers présents. Le script refuse tout conflit ou fichier déjà personnalisé, sauvegarde puis vérifie sur `--apply`. Le dossier `clair - app` sur Drive est un **squelette documentaire**, tandis que `demo` contient le prototype ; aucun chemin local ni opération Git n'a été vérifié.
- Après intégration réelle vérifiée (et validation déjà exprimée), renseigner la **page Notion 06 existante** avec les chemins intégrés et la preuve de vérification. **Ne pas** passer la propriété 06 à Validée avant cette preuve d’intégration.
- Claude Code lira `CLAUDE.md`/`AGENTS.md`, les fichiers actifs, et proposera lui-même le plan en **phase 07**, sans plan rédigé ici.

**Exclus de cette livraison :** `IMPLEMENTATION_PLAN.md`, `PLAN_IMPLEMENTATION.md`, migrations SQL, auth réelle, composants/backend, déploiement et nouvelles pages Notion.
