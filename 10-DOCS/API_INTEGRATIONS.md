# API & intégrations — Clair

> **PHASE 06 — PROPOSITION DE PASSATION, NON ENCORE VALIDÉE** · 13/11/2026.
> **Source de vérité produit :** Notion « Maquette prêt bancaire » (copie du template), pages 01 à 05. En cas de divergence, remonter la question avant de changer le périmètre.
> **Verdict phase 05 : GO AVEC RÉSERVES**. Documentation seulement ; aucune implémentation réelle, aucun test technique Supabase effectué.

## Services applicables
- Supabase Auth : inscription, session, connexion et déconnexion e-mail/mot de passe ; confirmation e-mail désactivée en démo. HTTPS ; SDK frontend avec clé publishable ; pas de SMTP.
- Supabase Data API : lecture propre profil, liste minimisée des e-mails/rôles via chemin sécurisé Manager ; SQL grants/RLS réellement vérifiés.
- **API-001 —** opération privilégiée sécurisée de changement de rôle d'autrui (F-011, US-011, AC-014 à AC-016). Réalisation managée dans PostgreSQL, pas de serveur Node dédié exigé.

## Contrat fonctionnel API-001 (VALIDÉ)
| Aspect | Contrat |
|---|---|
| Appelant | Session Supabase valide, Manager courant relu en T-001 |
| Entrée | UUID `target_id`, `new_role ∈ {executant, manager}` |
| Autorisation | Cible existante et différente de l'appelant ; pas de rétrogradation de soi ; Exécutant refusé |
| Transaction | Verrouiller appelant/cible dans ordre stable ; revérifier rôle Manager après verrouillage ; mutation atomique |
| Réponse | UUID cible et rôle final, sans e-mail sensible ou données Auth non nécessaires |
| Rejeu | Demande du même rôle : retour de l'état voulu, **pas d'inversion** ; après réponse réseau incertaine : relecture |
| Erreurs | Session absente, rôle insuffisant, cible absente, rôle invalide, conflit, panne ; messages sûrs, pas de données modifiées en cas de refus |

**À DÉFINIR en implémentation :** nom physique SQL de la routine et éventuelle façade RPC, codes exacts de retour, schémas de validation et seuils de rate limiting ; ces valeurs ne sont pas validées dans Notion. Ne pas inventer d'URL REST personnalisée ou de route publique.

## Lectures complémentaires (sans inventer de nouveaux identifiants API)
- Lecture du profil T-001 de l'appelant : rôle propre, pas d'autres profils.
- Lecture paginée de l'annuaire e-mails + rôles : **Manager uniquement**, pagination plafonnée ; ne pas donner accès brut à `auth.users`.

## NON APPLICABLE
n8n, webhooks, jobs marketing, API bancaire, paiements, stockage ou synchronisation de simulations, intégration de courriel transactionnel/SMTP pour confirmation. Aucune politique d'idempotence de webhook à inventer.

**Traçabilité :** [D02](https://app.notion.com/p/416282ff070c80cca178f8341bf0513b) · [D04](https://app.notion.com/p/416282ff070c809395d5c6339be59c2a) · [D05](https://app.notion.com/p/416282ff070c80b7b44fd5819fa94049).
