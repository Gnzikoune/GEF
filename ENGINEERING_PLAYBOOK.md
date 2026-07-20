# Engineering Playbook — Standards "Elite" pour le Gildas Engineering Framework (GEF)

> **IMPORTANT :** En tant qu'IA, je m'engage à lire, comprendre et respecter scrupuleusement ces règles tout au long du développement du projet. Ce document est la référence absolue de notre façon de travailler ensemble, sur **tous les projets**, quels que soient le langage, la stack ou le domaine (SaaS, IA, jeu vidéo, mobile, backend...).
>
> Les spécificités techniques d'un projet donné (services cloud utilisés, base de données, etc.) ne figurent **jamais** ici : elles vivent dans un fichier `PROJECT_CONFIG.md` à la racine de chaque dépôt. Ce Playbook reste universel.

---

## 0. Cycle de Vie du Projet & Clause d'Antériorité

L'IA doit toujours identifier la phase du projet avant d'agir (Idée → R&D → Dev Contractuel → Release → Maintenance).

> **Clause d'Antériorité (Fix Forward) :** L'IA applique les règles du Playbook sur tout le **nouveau** code produit. Elle ne doit **jamais** refactoriser proactivement du code existant uniquement pour le rendre conforme à une nouvelle règle, sauf demande explicite. Si un fichier est modifié pour un bugfix/feature, l'IA applique la **Boy Scout Rule** : nettoyer le code environnant sans casser les tests.

---

## 1. Conventions de Code et de Nommage

L'écriture du code doit suivre les **Google Engineering Practices** : la clarté prime sur la complexité (KISS). Le code est lu beaucoup plus souvent qu'il n'est écrit.

- **Nommage Strict :**
  - **Fichiers & Dossiers :** `kebab-case` (ex: `user-profile.tsx`) pour éviter les conflits OS.
  - **Classes & Composants :** `PascalCase` (ex: `UserProfile`, `AuthService`).
  - **Variables & Fonctions :** `camelCase` (ex: `getUserData`, `isLoggedIn`).
  - **Constantes Globales :** `UPPER_SNAKE_CASE` (ex: `MAX_RETRY_COUNT`).
- **Limites Indicatives :** Fonction (Max ~40 lignes), Composant UI (Max ~250 lignes), Fichier (Max ~500 lignes).
- **Zéro tolérance :** Lint obligatoire, typage strict (TypeScript/mypy), zéro warning ignoré sans commentaire de justification.

---

## 2. Architecture & Design (Clean Architecture & SOLID)

Le code doit séparer le "métier" (règles de l'application) de "l'infrastructure" (frameworks, DB, UI).
- **Principe de Responsabilité Unique (SRP) :** Une classe/fonction ne fait qu'une seule chose.
- **Dependency Inversion (DIP) :** Le domaine dépend d'interfaces, pas d'implémentations.
- **Architecture par Fonctionnalité (Feature-Sliced Design) :** L'organisation des dossiers reflète le métier, pas la technique. 
  - *Mauvais :* `/controllers`, `/models`, `/views`
  - *Bon :* `/features/auth/api.ts`, `/features/auth/components/`, `/features/billing/model.ts`

---

## 3. Gestion Avancée des Erreurs (Resilience)

- **Information Hiding :** Ne **JAMAIS** exposer de stack traces ou de détails techniques au client final. Renvoyer une erreur générique ("Erreur interne") avec un ID de log.
- **Typage des Erreurs :** Créer des classes d'exceptions (ex: `DomainError`, `InfraError`, `ValidationError`).
- **Result Pattern :** Remplacer les blocs `try/catch` massifs par des retours prévisibles de type `Result<Success, Failure>` pour obliger la gestion explicite de l'échec.

---

## 4. Sécurité : OWASP Secure-by-Design

- **Defense in Depth :** Ne jamais faire confiance aux entrées. Valider strictement chaque donnée aux frontières du système (ex: `Zod`, `Joi`).
- **Fail-Safe Defaults :** Tout accès est refusé par défaut. Les permissions doivent être demandées explicitement.
- **Sanitisation :** Utiliser des requêtes paramétrées pour la DB et encoder les variables dans l'UI pour bloquer SQLi et XSS.
- **Gestion des secrets :** Toujours via `.env`.

---

## 5. Stratégie Git : Trunk-Based Development (TBD)

Les équipes les plus performantes fuient l'Integration Hell des longues branches.
- **Principe du Trunk :** Tous les développements sont poussés sur la branche principale (`main`) très régulièrement (au moins une fois par jour).
- **Micro-Commits :** Un commit = une petite action isolée et testée. 
- **Feature Flags (Toggles) :** Pour commiter une fonctionnalité non terminée sur `main` sans impacter les utilisateurs, le code doit être désactivé via un booléen en configuration.
- **Conventional Commits Stricts :** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. Tout commit doit inclure l'ID du ticket Kanban (`#XYZ`).

---

## 6. Documentation : Diátaxis & Docs-as-Code

La documentation technique (dossier `docs/`) doit suivre le framework cognitif **Diátaxis** :
1. **Tutoriels** (Prise en main)
2. **How-to Guides** (Tâches spécifiques)
3. **Référence** (API, DB)
4. **Explication** (Architecture, ADR)

- **Docs-as-Code & Modèle C4 :** L'architecture doit être visuelle et versionnée. Utiliser le format **Modèle C4** (Contexte, Conteneurs, Composants) généré via code (ex: `Mermaid.js`) pour garantir que les schémas ne deviennent jamais obsolètes.
- **ADR & RESEARCH_LOG :** 
  - **ADR :** Tout changement structurel majeur nécessite un rapport d'Architecture (ADR).
  - **RESEARCH_LOG.md :** Tout bug critique bloquant doit être détaillé (Symptôme, Expériences, Résolution) pour la mémoire du projet.

---

## 7. Assurance Qualité (QA) : Shift-Left & Test Pyramid

La qualité s'injecte avant le code, pas après.
- **Shift-Left Testing :** La réflexion sur les tests et la sécurité commence dès l'écriture des spécifications.
- **Behavior-Driven Development (BDD) :** Aligner la technique et le métier. Les tests (surtout E2E) doivent suivre la syntaxe `Given / When / Then`.
- **La Pyramide des Tests :**
  - **Base :** 80% de Tests Unitaires (très rapides, ciblent la logique métier sans DB).
  - **Milieu :** 15% de Tests d'Intégration (valident la communication DB / API).
  - **Sommet :** 5% de Tests End-to-End (E2E type Playwright). Ils sont lents et fragiles, l'IA ne doit pas s'appuyer uniquement sur eux.

---

## 8. Pilotage Kanban et Autonomie de l'IA

L'IA agit comme un Tech Lead autonome.
- **Découpage en Issues :** Utiliser la CLI GitHub (`gh issue create`) pour découper un grand chantier en sous-tâches.
- **Création de Pull Requests (PR) :** Si des branches temporaires sont requises pour une revue par l'utilisateur, utiliser `gh pr create`.
- **Validation Humaine Obligatoire :** L'IA ne merge **JAMAIS** de Pull Request elle-même. Elle prépare tout et demande à l'utilisateur de cliquer sur le bouton de Merge.

---

## 9. Hygiène, CI/CD et Séparation R&D

- **Zéro Scories :** Scripts temporaires, fichiers de debug ou commentaires commentés doivent être supprimés avant tout push.
- **CI/CD :** À chaque push, les workflows GitHub Actions doivent vérifier : Lint, Build, Tests Unitaires, Analyse de sécurité. 
- **Release Please :** La gestion des versions (Semantic Versioning) est pilotée automatiquement via les Conventional Commits et l'outil Release Please.
- **Séparation R&D :** Les expérimentations sans cahier des charges validé se font sur un dépôt privé séparé. L'historique Git officiel du produit final doit rester propre et professionnel.

---

*Ce document évolutif garantit un niveau d'ingénierie d'excellence (Standard DORA "Elite") sur l'ensemble de nos projets.*
