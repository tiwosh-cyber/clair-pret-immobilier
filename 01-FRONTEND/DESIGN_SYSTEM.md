# Design System — Clair

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Identité validée
« Banque classique modernisée » (direction A). Interface claire et peu chargée, sans illustration décorative obligatoire. Inter, cartes blanches, accents verts, résultats financiers très lisibles, langue FR.

## Tokens
| Rôle | Valeur | Note |
|---|---|---|
| background | `#F3F5F2` | Fond |
| surface | `#FFFFFF` | Cartes |
| brandGreen | `#468B52` | **Marque**, pas texte blanc 12 px sur bouton |
| action | `#3E7E49` | Actions / boutons (contraste corrigé Figma) |
| actionHover | `#357241` | Survol |
| primaryText | `#203527` | Texte |
| secondaryText | `#657264` | Descriptions |
| border | `#DFE5DC` | Contours |
| subtleSurface | `#EDF3EB` | État doux |
| error | `#B54747` | Avec message texte, jamais couleur seule |
| font | `Inter` | Normal/Medium/Semi Bold ; échelle exacte depuis Figma |
| radius | `12 px` (direction approuvée) | À confronter aux composants réutilisés |
| spacing | Échelle multipliée de `8 px` | Exception documentée si nécessaire |

## Composants & états
- Boutons Primary/Secondary : Default, Hover, Focus, Disabled, Loading ; interactions clavier et focus visible.
- Champs : Default/Focus/Error/Disabled, label permanent, aide et erreur associées.
- Slider + champ numérique : montant `5000..15000/500`, durée `12..72/1` ; synchronisation seulement si saisie valide.
- Cartes de résultats : mensualité, intérêts, total ; rôle Manager/Exécutant affiché sans présumer l'autorisation réelle.
- Dialogues de modification : cible exacte, rôle avant/après, Annuler et Confirmer, feedback succès ou refus ; après confirmation E-003 affiche le rôle actualisé.
- Tableau profils : état plein/vide/chargement/erreur ; accès refusé pour Exécutant même si l'URL est saisie.
- Notifications : Success/Error avec icône + message ; mouvement subtil et `prefers-reduced-motion`.

## Vues Figma et réserve de couverture
Figma possède pages **Desktop 1440**, **Tablette 768**, **Mobile 375** et **Design System**. Le 13/11/2026 : dialogues Alice/Bob/Sophie corrigés et états de réussite dédiés ; boutons concernés changés à `#3E7E49`. **Ne pas affirmer** que toutes les combinaisons d'erreur/chargement/vide sont représentées comme écrans Figma complets ; utiliser les états du prototype HTML existant.

## Vérifications de design à mener en développement
Clavier, focus, contraste (vise WCAG AA pertinent), non-chevauchement, zoom 200 %, formats monétaires FR, mobile tactile, liens/états et retours d'erreur. Les mesures du rapport d'audit ne remplacent pas des tests d'implémentation.

[Design Figma](https://www.figma.com/design/wtOEvu4ByhQBenwgCVU5Kv/Clair-%E2%80%94-Phase-03-UX-UI-%C2%B7-Parcours-et-%C3%A9crans?node-id=0-1) · [Prototype de référence](https://drive.google.com/drive/folders/1QX_fBNtHYzN5zW_Eop4MuDOBzHs0sCBq).

**Traçabilité :** [D03](https://app.notion.com/p/416282ff070c8092acd6e422c91cc57b) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
