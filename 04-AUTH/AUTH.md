# Authentification et rôles — Clair

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Décision en vigueur
- **VALIDÉ :** Supabase Auth e-mail + mot de passe ; **pas de confirmation e-mail pour cette démo** (ancien parcours retiré par arbitrage humain du 13/11/2026). SMTP NON APPLICABLE. L'adresse e-mail n'est pas vérifiée.
- Nouveau compte : rôle Exécutant attribué **en base** ; inscription publique ne peut pas sélectionner Manager. Premier Manager accordé manuellement en utilisant UUID Auth et procédure opérateur privilégiée, sans code de bootstrap public.
- Anonyme : uniquement E-001. Exécutant : E-002. Manager : E-002 + E-003, lecture restreinte + API-001. Manager ne peut pas se rétrograder ; Exécutant ne peut lire tous les profils ni promouvoir qui que ce soit.
- Session/périmètre sécurisé vérifiés côté Supabase ; les JWT et le rôle doivent être contrôlés selon les règles de phase 04. Déconnexion/révocation, expiration et rôle changé sont des cas de test obligatoires.

## Différence prototype / application réelle
- **Prototype source `demo` :** état React, `sessionStorage`, mots de passe publics fictifs, confirmation locale simulée, sélecteur de rôle. Ces mécanismes servent seulement à la revue UX et ne protègent aucune donnée.
- **Application cible :** retirer comptes factices/mots de passe de démo, fausse confirmation et commutation du rôle dans `sessionStorage` ; utiliser Supabase Auth réel et T-001. Remplacer les formulations « aucun compte réel » et « aucune donnée transmise » par des mentions fidèles au traitement Supabase.
- Ne pas importer les mots de passe de démo dans Auth ; ne pas enregistrer de mots de passe en clair ni d'e-mails de testeurs personnels sans politique d'information.

## Erreurs / échecs
Compte absent, mot de passe invalide, compte sans T-001, session absente/expirée, indisponibilité Supabase et rôle insuffisant → réponse sûre, correction/réessai, **jamais** accès en mode démo automatique. Nul besoin de flux de renvoi de confirmation e-mail.

**Traçabilité :** [D02](https://app.notion.com/p/416282ff070c80cca178f8341bf0513b) · [D04](https://app.notion.com/p/416282ff070c809395d5c6339be59c2a) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
