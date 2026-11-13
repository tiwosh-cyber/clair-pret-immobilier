# Sécurité & RGPD — Clair

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Menaces et règles impératives
- **VALIDÉ :** véritable Supabase Auth et autorisations en base ; ne jamais traiter masque de menu, `sessionStorage`, métadonnées client modifiables ou champ `role` envoyé par l'utilisateur comme preuve d'autorisation.
- Contrôler grants SQL et RLS sur les tables exposées ; droits T-001 limités, API-001 en façade vérifiée ; aucune clé `service_role` / mot de passe DB / JWT privé dans le frontend, les docs ou les logs.
- Créer le premier Manager seulement via méthode d'opérateur autorisé. Ne jamais laisser l'utilisateur se promouvoir ni rétrograder son propre Manager. Contrôler l'état de session et rôle au moment de chaque action privilégiée (pas seulement en entrant sur l'écran).
- JWT/contrôle de session active : un access token peut survivre à une déconnexion/suppression ; vérifier la révocation par tests. Messages sans fuite d'identité/permissions inutiles ; pas de logs d'identifiants, secrets ou jetons.
- Dépendances verrouillées et auditées lors du développement ; contenu HTML non fiable échappé ; CSP et ressources statiques locales si possible. Pas de cookie backend/CSRF supplémentaire imposé par ce MVP.

## Matrice de droits — AC-011 à AC-016
| Action | Anonyme | Exécutant | Manager |
|---|---|---|---|
| S'inscrire / se connecter | Oui | Oui | Oui |
| Calculer | Non sans session | Oui | Oui |
| Lire la liste complète | Non | Non | Oui, via lecture contrôlée |
| Modifier rôle d'un autre compte | Non | Non | Oui, API-001 |
| Modifier son propre rôle | Non | Non | Non |
| Opération directe T-001 non autorisée | Non | Non | Non |

## Protection des données personnelles — réserves encore OUVERTES
- **À DÉFINIR AVANT de vrais testeurs externes :** identité du responsable du traitement, adresse de contact, information transparente, base juridique, droits d'accès/suppression, périmètre des logs gérés par Supabase et procédure de récupération vérifiée.
- Pas de véritable client bancaire, d'historique de prêt ni de stockage des simulations. E-mails Auth et rôles = données personnelles même en exercice pédagogique ; absence de confirmation **n'efface pas** cet enjeu.
- Durée comptes de démo : au plus tard 7 jours après fin essais ; exports de sauvegarde chiffrés : 7 jours ; simulations seulement en mémoire. Suppression/révocation Auth et cascade T-001 à vérifier.
- **Réserve de conformité :** pas d'invitation de véritables e-mails de testeurs externes tant que le responsable, le contact et la notice ne sont pas complétés. Utiliser uniquement des identités fictives adéquates pendant les tests initiaux.

## Sécurité de livraison (non effectuée)
- Tests négatifs : anonyme, Exécutant, Manager, accès API direct, auto-promotion, privilèges périmés, profil manquant, session révoquée, traitements concurrents.
- Vérifier SQL grants, EXECUTE sur fonctions privilégiées, autorisations des routines privées, absence de secrets dans le bundle, restauration et limitations Free.
- **Verdict 05 « GO AVEC RÉSERVES »** = accord de passation, **pas** garantie de sécurité ni permission de déployer.
- Statut actuel des tests de sécurité réels : **NON EXÉCUTÉS** dans cette passation ; les tests Chromium/axe du prototype ne constituent pas des tests Supabase.

**Traçabilité :** [D04](https://app.notion.com/p/416282ff070c809395d5c6339be59c2a) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
