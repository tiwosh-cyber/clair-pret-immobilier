# UX/UI — parcours et états Clair

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

**VALIDÉ :** direction A « Banque classique modernisée », trois écrans E-001/E-002/E-003, langue française, devise EUR. Les composants/valeurs détaillés sont dans [`../01-FRONTEND/DESIGN_SYSTEM.md`](../01-FRONTEND/DESIGN_SYSTEM.md) ; navigations dans [`APP_FLOW.md`](APP_FLOW.md).

## E-001 — Inscription / Connexion
- Formulaires e-mail/mot de passe ; états validation, erreur, attente réseau, succès. Vraie authentification Supabase à implémenter, **aucune confirmation e-mail** (AC-008/009/010).
- La maquette conserve une confirmation fictive **archivée** ; la future app ne doit pas afficher la simulation de confirmation, ni une promesse « aucun compte réel ».
- Comptes du prototype (`manager@demo.fr`, etc.) et mot de passe partagé : **uniquement données fictives du prototype**, à ne jamais importer comme identifiants réels.

## E-002 — Simulateur
- 2 contrôles montant/durée synchronisés ; valeurs par défaut 5 000 € et 12 mois ; résultat de mensualité très visible, intérêts et total secondaires ; avertissement pédagogique. Calcul local sans réseau (AC-001 à AC-007).
- État invalide : erreur proche du champ et conservation de la dernière simulation valide ; état de connexion indisponible : message et reprise, **pas de bypass auth**.

## E-003 — Gestion des profils
- Tableau Manager de comptes (e-mails et rôles), dialogue de confirmation ciblé ; résultat actualisé ou refus (AC-013 à AC-016).
- États chargement, liste vide, erreur, succès et accès refusé. **L'état Figma complet n'existe pas pour chaque cas** : se référer au code interactif et aux variantes génériques Figma.
- Ne jamais confondre masquage UI du menu avec vraie autorisation API-001/RLS.

## Responsive / accessibilité
- Maquettes 1440 / 768 / 375 px ; absence de chevauchements et de scroll horizontal, cartes et champs empilés sur mobile, tableau utilisable, focus de dialogue restauré.
- Labels explicites, clavier, annonces d'erreur, contraste des actions et réduction des mouvements ; vérifier manuellement Safari/iOS, Firefox, NVDA/VoiceOver, tactile et zoom 200 %. Les essais automatiques Chromium/axe sont déclarés dans le README de prototype, **non reproduits ici**.

## Références vérifiées
- [Figma — écrans et Design System](https://www.figma.com/design/wtOEvu4ByhQBenwgCVU5Kv/Clair-%E2%80%94-Phase-03-UX-UI-%C2%B7-Parcours-et-%C3%A9crans?node-id=0-1)
- [Drive — demo index.html, app.source.js et README](https://drive.google.com/drive/folders/1QX_fBNtHYzN5zW_Eop4MuDOBzHs0sCBq)
- [Notion 03 — App Flow SVG V2](https://app.notion.com/p/416282ff070c8092acd6e422c91cc57b)

**Traçabilité :** [D03](https://app.notion.com/p/416282ff070c8092acd6e422c91cc57b) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
