# Environnements & livraison — Clair (documentation, aucun déploiement)

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Situation et choix
- **VALIDÉ :** frontend local sur ordinateur de développement ; Supabase distant pour Auth et T-001 ; pas d'hébergement public ou domaine, pas de serveur Node applicatif ni SMTP.
- **PROPOSÉ :** offre Supabase Free, région UE. Vérifier effectivement quotas et disponibilité lors de l'ouverture du projet ; ne jamais contractualiser une offre payante sans accord.
- Code source du prototype de référence dans [Drive / demo](https://drive.google.com/drive/folders/1QX_fBNtHYzN5zW_Eop4MuDOBzHs0sCBq), avec `index.html` autonome + `app.source.js`. Ce n'est **pas** une app Supabase déployée et sa copie ne doit pas être traitée comme backend existant.

## Exploitation et configurations
- Environnement de test local + projet Supabase de démonstration (pas de base réelle à ce jour). Séparer identité des testeurs et privilèges opérateur, et éviter tout jeu de données clients.
- Config frontend : URL Supabase et **clé publishable** (noms de variables à définir avec l'outillage réel) ; ne jamais exposer `service_role`, token privé ou mot de passe. Les fichiers `.env` ne doivent pas être versionnés ni examinés par l'agent sans autorisation.
- Sauvegardes : exports chiffrés de données de profils lorsque nécessaires, rétention 7 jours ; **ne constituent pas** une sauvegarde complète du service Auth. Stratégie de récupération démo proposée : recréer les comptes fictifs et réattribuer Manager de façon contrôlée si besoin. Aucun test de restauration effectué.

## Gates GO / rollback
1. En développement, vérifier identité/session, inscription sans confirmation, profil par défaut, API-001 et règles RLS sur toutes opérations. Aucune validation par simple revue UI.
2. Vérifier accessibilité, mobile, navigateurs et absences de secrets, limites Free, journaux et nettoyages de comptes.
3. Avant de vrais e-mails personnels : responsable + contact de données, notice, base juridique et droits définis.
4. Aucune production planifiée ni autorisée. Tout déploiement, migration distante, restauration/destruction ou changement payant exige instruction explicite du propriétaire. L'utilisateur décide des opérations de livraison.
5. Si une version est publiée ultérieurement, la procédure de retour arrière (versions de frontend et compatibilité DB, données déjà modifiées) doit être préparée et testée ; aucun rollback prouvé aujourd'hui.

## NON APPLICABLE dans le MVP actuel
CDN, domaine, hébergement public, DNS/HSTS, job de marketing, file, stockage objet, Docker obligatoire, auto-scaling, paiement. Ne pas lancer ces travaux pour satisfaire une checklist générique.

**Traçabilité :** [D01](https://app.notion.com/p/416282ff070c80709627fc5a77a33960) · [D04](https://app.notion.com/p/416282ff070c809395d5c6339be59c2a) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
