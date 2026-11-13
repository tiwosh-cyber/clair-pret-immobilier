# PRD — Clair · Simulateur pédagogique de prêt

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Produit, utilisateurs et contraintes
- **VALIDÉ —** Démonstration locale, portfolio/apprentissage, en français, pas un service bancaire. Simulation d'intérêts **simples** (sans amortissement), jamais une offre réelle. Identité « Clair », direction « Banque classique modernisée ».
- **VALIDÉ —** Frontend local + service Supabase distant, connexion Internet requise ; budget **cible 0 €**, délai **cible inférieur à 7 jours** (objectifs, non garanties). Pas de déploiement public imposé.
- **VALIDÉ —** Visiteur : inscription/connexion uniquement. Exécutant : simulateur et déconnexion. Manager : mêmes actions, liste des profils e-mails/rôles et gestion des rôles des autres utilisateurs. Premier Manager attribué manuellement par un opérateur privilégié, jamais via inscription publique.
- **VALIDÉ — AVENANT 13/11/2026 —** Supabase Auth e-mail + mot de passe **sans confirmation de l'adresse** pour la démo ; l'ancienne exigence de confirmation et SMTP est remplacée, non effacée de l'historique Notion. Les e-mails ne constituent pas une identité vérifiée.

## F-xxx / US-xxx / AC-xxx — périmètre approuvé

| Feature | Story | Acceptance | Résultat attendu |
|---|---|---|---|
| F-001 | US-001 | AC-001 | Capital : slider + champ, 5 000–15 000 €, pas 500 €, défaut 5 000 € |
| F-002 | US-002 | AC-002 | Durée : slider + champ, 12–72 mois entiers, pas 1, défaut 12 |
| F-003 | US-003 | AC-003 | Taux annuel fixe 7 %, intérêts simples exacts, pas de frais / assurance |
| F-004 | US-004 | AC-004 | Mensualité, intérêts totaux, total remboursé identifiés ; affichage 2 décimales sans arrondi intermédiaire |
| F-005 | US-005 | AC-005 | Résultats recalculés immédiatement à chaque valeur valide ; synchronisation des entrées |
| F-006 | US-006 | AC-006, AC-007 | Erreur de saisie + dernier résultat valide conservé ; avertissement pédagogique permanent |
| F-007 | US-007 | AC-008, AC-009 | Inscription Supabase e-mail/mot de passe sans confirmation, profil Exécutant, session réelle |
| F-008 | US-008 | AC-010 | Connexion et déconnexion Supabase, accès fermé après déconnexion |
| F-009 | US-009 | AC-011, AC-012, AC-016 | Rôle Exécutant par défaut, refus anonyme et refus d'auto-promotion |
| F-010 | US-010 | AC-013, AC-014 | Liste e-mails + rôles uniquement accessible au Manager, y compris via API |
| F-011 | US-011 | AC-014, AC-015, AC-016 | Manager promeut Exécutant / rétrograde autre Manager, pas soi-même ; Exécutant ne modifie aucun rôle |

### Règles de calcul — AC-001 à AC-007
Soit capital `C` (€) et durée `N` (mois) : `I = C × 0,07 × N/12`, `T = C + I`, `M = T/N`. Les calculs utilisent des valeurs non arrondies ; seulement l'affichage est à deux décimales. Référence : `C=5000, N=12` => intérêts `350,00 €`, total `5 350,00 €`, mensualité `445,83 €`. Entrée vide, hors bornes, non numérique, montant non multiple de 500 ou durée non entière : erreur explicite et maintien des derniers résultats valides. Avertissement littéral : **« Simulation pédagogique à intérêts simples, non représentative d'une offre bancaire »**.

### Parcours et critères de refus
- E-001 → E-002 : uniquement compte Supabase authentifié **et** profil T-001 disponible, sans confirmation e-mail. Échec : erreur sûre et possibilité de réessayer.
- E-002 → E-003 : Manager seulement ; utilisateur Exécutant interdit même par URL directe et appels réseau.
- E-003 : changement de rôle uniquement via API-001 ; rôle courant relu à une frontière de confiance. Confirmation du changement / refus explicite. Déconnexion invalide l'accès sensible.

## Hors périmètre et NON APPLICABLE
Vrai crédit, clients bancaires, API bancaire, étude de solvabilité, amortissement, frais, assurance, taux réglable, facturation, paiements, historique des simulations, PDF, graphiques, stockage des simulations, Storage, n8n, webhooks, Realtime, multiorganisations, serveur Node obligatoire, hébergement public et SMTP de confirmation.

## Conditions de réussite / réserves
- **GO AVEC RÉSERVES —** vérifier en développement : contrôles serveur/RLS/SQL grants, sessions/révocation, concurrence API-001, bootstrap Manager, conservation des données, responsive/accessibilité.
- **À DÉFINIR avant de vrais e-mails de testeurs :** identité/contact du responsable des données, notice, base juridique et périmètre des logs. Préférer des utilisateurs de test non personnels tant que ces éléments sont absents.
- Ne pas recycler les mots de passe codés en dur du prototype. Les mentions « aucun compte réel » et « aucune donnée transmise » deviennent fausses dans la future version Supabase : les remplacer lors de l'implémentation.

**Traçabilité :** [D01](https://app.notion.com/p/416282ff070c80709627fc5a77a33960) · [D02](https://app.notion.com/p/416282ff070c80cca178f8341bf0513b) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
