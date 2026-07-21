# Engineering Playbook — Standards "Elite" pour le Guardian Engineering Framework (GEF)

> **IMPORTANT :** En tant qu'IA, je m'engage à lire, comprendre et respecter scrupuleusement ces règles tout au long du développement du projet. Ce document est la référence absolue de notre façon de travailler ensemble, sur **tous les projets**, quels que soient le langage, la stack ou le domaine (SaaS, IA, jeu vidéo, mobile, backend...).
>
> Les spécificités techniques d'un projet donné (services cloud utilisés, base de données, etc.) ne figurent **jamais** ici : elles vivent dans un fichier `PROJECT_CONFIG.md` à la racine de chaque dépôt. Ce Playbook reste universel.

---

## 0. Cycle de Vie du Projet & Clause d'Antériorité

L'IA doit toujours identifier la phase du projet avant d'agir (Idée → R&D → Dev Contractuel → Release → Maintenance).

> **Clause d'Antériorité (Fix Forward) :** L'IA applique les règles du Playbook sur tout le **nouveau** code produit. Elle ne doit **jamais** refactoriser proactivement du code existant uniquement pour le rendre conforme à une nouvelle règle, sauf demande explicite. Si un fichier est modifié pour un bugfix/feature, l'IA applique la **Boy Scout Rule** : nettoyer le code environnant sans casser les tests.

---

## 1. Clean Code : Métriques, Tailles et Refactoring

L'écriture du code doit suivre les **Google Engineering Practices** : la clarté prime sur la complexité (KISS). 

### 1.1. Tailles Maximales (Hard Limits)
- **Fonctions / Méthodes :** `{{MAX_LINES}} lignes max`.
- **Paramètres :** `{{MAX_PARAMS}} arguments max` (au-delà, utiliser un objet de configuration).
- **Composants UI :** `150 à 200 lignes max`. (La logique > 50 lignes doit être extraite en *Custom Hook*).
- **Fichiers :** `300 à 400 lignes max`.

### 1.2. Complexité et Nesting
- **Profondeur (Nesting) :** `3 niveaux max`.
- **Guard Clauses (Early Return) :** Obligatoire. Éviter les `if/else` imbriqués.
- **Complexité Cyclomatique :** Maximum `{{MAX_COMPLEXITY}}` chemins logiques par fonction.

### 1.3. Règles de Refactoring (The Rule of Three)
- **1ère fois :** Écrire pour résoudre.
- **2ème fois :** Tolérer la duplication.
- **3ème fois :** Refactorisation obligatoire en abstraction réutilisable.

### 1.4. Conventions de Nommage
- **Fichiers / Dossiers :** `kebab-case` (ex: `user-profile.tsx`).
- **Classes / Composants :** `PascalCase` (ex: `UserProfile`).
- **Variables / Fonctions :** `camelCase` (ex: `getUserData`).
- **Constantes Globales :** `UPPER_SNAKE_CASE` (ex: `MAX_RETRY_COUNT`).
- **Rigueur :** Lint obligatoire, typage strict (TypeScript/mypy), zéro warning ignoré sans commentaire explicite.

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

## 4. Sécurité : OWASP Secure-by-Design & Hard Limits

*"La complexité est l'ennemie de la sécurité."* La stricte limite de Complexité Cyclomatique (`{{MAX_COMPLEXITY}}` max) vue au §1 est la première défense contre les angles morts de sécurité.

- **Defense in Depth & Sanitisation :** Ne jamais faire confiance aux entrées. Validation stricte (ex: `Zod`, `Joi`). Requêtes paramétrées obligatoires contre SQLi et encodage contre XSS.
- **Fail-Safe Defaults :** Tout accès est refusé par défaut.

### 4.1. Hard Limits de Sécurité (Standard OWASP)
- **Authentification & Sessions :** 
  - Durée de vie d'un **Access Token (JWT) : 15 minutes max**.
  - Durée de vie d'un **Refresh Token : 7 jours max** (en `HttpOnly`).
- **Limites de Charge (Payload Limits) :**
  - Corps de requête API (JSON) : **{{MAX_PAYLOAD}} max** (Protection DoS).
  - Upload d'image : **5 Mo max**.
- **Anti-Brute Force (Rate Limiting) :**
  - Bloquer un compte/IP pendant 15 minutes après **5 tentatives de connexion échouées**.
  - Limite globale par IP : **100 requêtes API / minute**.
- **Gestion des secrets :** Toujours via variables d'environnement (`.env`). Jamais hardcodés.

---

## 5. Stratégie Git : GitHub Flow (Pull Requests)

La stabilité de la branche principale est primordiale. Nous utilisons le **GitHub Flow** :
- **Branche `main` verrouillée :** Les pushes directs sur `main` sont **strictement interdits**.
- **Branches Courtes :** Créez des branches par fonctionnalité (`feat/xxx`, `fix/xxx`). Les branches ne doivent pas durer plus de quelques jours.
- **Pull Requests (PR) Obligatoires :** Tout code doit passer par une PR. L'intégration Continue (CI) s'exécute sur la PR pour valider les tests et le linting.
- **Revue de Code (Code Review) :** Une approbation est requise avant le merge. Le respect du Playbook y est vérifié.
- **Conventional Commits :** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. Tout commit doit inclure l'ID du ticket Kanban (`#XYZ`).

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

L'IA agit comme un Tech Lead autonome, mais sous le contrôle strict de l'intention métier.
- **Le "Pourquoi" avant tout :** Chaque Issue, PR ou tâche doit obligatoirement commencer par expliciter le but ultime (l'intention métier). L'IA ne doit pas deviner le but, elle doit le suivre.
- **Découpage en Issues :** Utiliser la CLI GitHub (`gh issue create`) pour découper un grand chantier en sous-tâches.
- **Création de Pull Requests (PR) :** Si des branches temporaires sont requises pour une revue par l'utilisateur, utiliser `gh pr create`.
- **Validation Humaine Obligatoire :** L'IA ne merge **JAMAIS** de Pull Request elle-même. Elle prépare tout et demande à l'utilisateur de cliquer sur le bouton de Merge.
- **Crash Clause Anti-Contournement :** Face à un mur (erreur technique, consigne ambiguë, outil manquant), l'IA doit échouer bruyamment (Fail Fast) et s'arrêter pour demander de l'aide à l'utilisateur, plutôt que d'improviser une solution toxique ou de masquer l'erreur en silence.

---

## 9. Hygiène, CI/CD et Séparation R&D

- **Zéro Scories :** Scripts temporaires, fichiers de debug ou commentaires commentés doivent être supprimés avant tout push.
- **CI/CD :** À chaque push, les workflows GitHub Actions doivent vérifier : Lint, Build, Tests Unitaires, Analyse de sécurité. 
- **Release Please :** La gestion des versions (Semantic Versioning) est pilotée automatiquement via les Conventional Commits et l'outil Release Please.
- **Séparation R&D :** Les expérimentations sans cahier des charges validé se font sur un dépôt privé séparé. L'historique Git officiel du produit final doit rester propre et professionnel.

---

*Ce document évolutif garantit un niveau d'ingénierie d'excellence (Standard DORA "Elite") sur l'ensemble de nos projets.*
