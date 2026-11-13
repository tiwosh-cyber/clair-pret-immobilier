# Clair — intégration contrôlée dans le dépôt existant

**Documentation de phase 06 approuvée par le propriétaire dans la conversation du 13/11/2026.** L'intégration **n'est pas présumée accomplie** : aucun chemin du dépôt local VS Code n'a été transmis. Aucun fichier utilisateur local n'a été modifié.

## Ce que contient le paquet
- 10 fichiers Markdown de passation, selon les chemins **déjà présents** dans le template `clair - app` (pas de nouveaux doublons `DESIGN.md`/`API.md`).
- `INTEGRER_PHASE06.py` : analyse prudente d'un dossier existant, comparaison aux fichiers proposés, vérification des consignes, sauvegardes avant modifications et contrôle des fichiers après écriture. **Par défaut, lecture seule**.
- `PHASE06_HANDOFF_README.md` : réserves et correspondances avec Notion.

## Prévisualiser avant toute intégration
Sous Windows (PowerShell, depuis le dossier extrait du ZIP) :

```powershell
python .\INTEGRER_PHASE06.py "C:\CHEMIN\VERS\CLAIR-APP"
```

Sous macOS/Linux :

```bash
python3 ./INTEGRER_PHASE06.py "/chemin/absolu/vers/clair-app"
```

Ce contrôle **n'écrit rien**. Il vérifie l'existence de `AGENTS.md`, `CLAUDE.md`, `10-DOCS/`, et de chaque chemin Markdown ciblé, ainsi que la présence des textes anciens à corriger sans toucher aux autres règles.

## Appliquer après vérification des chemins et du diff

```powershell
python .\INTEGRER_PHASE06.py "C:\CHEMIN\VERS\CLAIR-APP" --apply
```

Le script **s'arrête avant d'écrire** en cas de fichier déjà personnalisé, d'ancre de règle introuvable, de chemin manquant ou de risque de suppression du travail existant. Il conserve des copies des versions antérieures dans `.clair-phase06-backups/` et contrôle les octets réécrits. Si le script signale un conflit, fusionner manuellement : ne pas le forcer.

## Consignes agents
Les ajustements validés au projet Clair concernent uniquement les références Notion/Excel et les correspondances Product Builder V2. Toutes les autres règles de `AGENTS.md` et `CLAUDE.md`, y compris sécurité, validations humaines et procédures Git applicables **ultérieurement**, restent conservées. Le script modifie `10-DOCS/QUESTIONS_PRODUIT.md` uniquement sur ses anciennes références Excel/étapes. **Il n'édite pas `CLAUDE.md`.**

## Après intégration
Récupérer la sortie du script et vérifier `git diff --stat` / `git diff` si le dossier est suivi dans Git (lecture seule). Transmettre ce résultat et le chemin réel du dépôt pour que les liens de passation soient inscrits dans **la page Notion 06 déjà existante**. Le statut `06 Passation` reste **À faire** jusqu'à preuve d'intégration et validation conforme à la règle du workflow.

**Exclus :** aucune commande Git automatique, création de branche, `IMPLEMENTATION_PLAN.md`, `PLAN_IMPLEMENTATION.md`, code, SQL, backend, configuration Supabase, migration, déploiement.
