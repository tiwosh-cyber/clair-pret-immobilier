# Clair — corrections de la phase 03 UX/UI

Ouvrir `index.html` dans un navigateur, puis choisir « Se connecter ».
Le JavaScript React est intégré dans le HTML : aucune installation et aucun backend ne sont nécessaires pour utiliser ce fichier. `app.source.js` contient les composants modifiables et leurs imports npm d'origine (React, React DOM, htm, lucide-react). Modifier ce fichier source exige de refaire le bundle intégré au HTML.

## Comptes fictifs confirmés

| Rôle | E-mail | Mot de passe |
| --- | --- | --- |
| Manager | manager@demo.fr | DemoClair2026 |
| Exécutant | alice@demo.fr | DemoClair2026 |

Le mode démo préremplit ces comptes avant connexion. Une fois connecté, il permet de changer explicitement de rôle de revue et revient au simulateur. Cette action rétablit le rôle du compte démo choisi.

## Corrections

- Inscription et connexion distinctes : validation, doublon, compte inexistant, mauvais mot de passe et compte non confirmé.
- L'inscription crée un Exécutant fictif non confirmé, puis propose une confirmation locale. Aucun e-mail n'est envoyé. La connexion d'un compte confirmé ouvre directement le simulateur.
- Routes par fragment : `#/inscription`, `#/connexion`, `#/confirmation`, `#/simulateur` et `#/profils`. URL, navigation, rechargement, Retour/Suivant et écran introuvable synchronisés.
- E-001 (authentification et confirmation), E-002 (simulateur) et E-003 (profils) conservés. Menu Profils masqué pour l'Exécutant, accès refusé à la route Profils et protection contre la rétrogradation de son propre compte.
- Comptes, rôles, confirmation en attente et session conservés dans sessionStorage pour cet onglet. Si le navigateur refuse ce stockage, le prototype reste utilisable en mémoire, mais le rechargement réinitialise les données. Les paramètres de simulation repartent aux valeurs initiales après rechargement.
- Mise en page adaptée, saisie mobile sans zoom automatique, cibles tactiles agrandies, erreurs annoncées, focus visible, lien d'évitement et focus restauré à la fermeture de la boîte de dialogue.
- Structure des étapes corrigée, réduction des animations respectée, couleurs et police conservées. Ajustement du contraste d'un texte secondaire du mode démo.
- Aucun changement des bornes, pas de saisie ou règles financières : intérêts simples à 7 %, capital 5 000–15 000 € par pas de 500 €, durée 12–72 mois.

Aucun identifiant n'est transmis à un serveur. Les mots de passe fictifs restent lisibles dans le stockage de l'onglet et dans le code. Cette simulation de permissions ne constitue pas une sécurité réelle. Utiliser uniquement des données fictives. Le chargement de la police Inter utilise Google Fonts, comme dans l'original ; les identifiants ne sont pas inclus dans ces requêtes. Aucun Supabase, backend ou déploiement n'a été ajouté.

## Vérifications réalisées

Tests automatisés sous Chromium : connexions réussies et erreurs, inscription puis connexion avant/après confirmation, persistance après rechargement, modification de rôle, route interdite, historique Retour, conservation du dernier calcul valide et absence d'erreurs JavaScript. Régressions financières : 5 000 € / 12 mois = 445,83 €/mois ; 15 000 € / 72 mois = 295,83 €/mois.

Largeurs 375, 768 et 1440 px : aucun débordement horizontal sur connexion, simulateur et profils ; boîte de dialogue contenue dans l'écran, fermeture par Échap et retour du focus vérifiés. Audit axe WCAG A/AA : aucune violation détectée sur connexion, simulateur et boîte de dialogue en viewport mobile avec animations réduites. Cette vérification automatisée ne remplace pas une revue complète d'accessibilité.

## À tester manuellement

Safari/iOS et Firefox, lecteurs d'écran VoiceOver/NVDA, manipulation tactile des curseurs sur appareils réels, zoom 200 % et affichage avec une adresse exceptionnellement longue. Vérifier la disponibilité de sessionStorage lors de l'ouverture locale selon le navigateur.
