# Engineering Playbook — Standards "Elite" pour le Guardian Engineering Framework (GEF)

> **IMPORTANT :** En tant qu'IA, je m'engage à lire, comprendre et respecter scrupuleusement ces règles tout au long du développement du projet. Ce document est la référence absolue de notre façon de travailler ensemble, sur **tous les projets**, quels que soient le langage, la stack ou le domaine (SaaS, IA, jeu vidéo, mobile, backend...).
>
> Les spécificités techniques d'un projet donné (services cloud utilisés, base de données, etc.) ne figurent **jamais** ici : elles vivent dans un fichier `PROJECT_CONFIG.md` à la racine de chaque dépôt. Ce Playbook reste universel.

> **Méthodologie :** Ce Playbook orchestre la boucle **AI SDD** (*AI Spec-Driven Development*). Dans ce cycle, l'humain **Définit** les spécifications et **Vérifie** les livrables. L'IA **Analyse/Conçoit** (§2 à §4) puis **Implémente/Teste** (§8) — toujours sous les contraintes mécaniques ci-dessous.

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
- **Fichiers :** `300 à 400 lignes max` (code source uniquement).
  - **Note :** Les artefacts générés automatiquement (package-lock.json, yarn.lock, etc.) sont exclus de cette limite selon ADR-002.

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
- **Rigueur :** Lint obligatoire (la CI doit échouer en cas d'erreur de linting, interdiction d'utiliser `|| true`), typage strict (TypeScript/mypy), zéro warning ignoré sans commentaire explicite.
  - *Note : Certains linters modernes (Biome, Ruff) n'imposent pas strictement les Hard Limits du GEF par défaut. Le développeur doit s'assurer de leur configuration ou se fier aux avertissements du pre-commit.*

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

### 3.1. Base de données & Migrations
- **Stratégie de Migration :** Toute modification de schéma de base de données DOIT être scriptée de manière réversible (Up / Down) via un outil de migration (Prisma, Alembic, Flyway, etc.).
- **Rollback :** Le Playbook impose de tester la migration `Down` localement avant toute PR impliquant un changement de schéma, afin de garantir un rollback de la DB en production si nécessaire.

---

## 4. Sécurité : OWASP Secure-by-Design & Hard Limits

*"La complexité est l'ennemie de la sécurité."* La stricte limite de Complexité Cyclomatique (`{{MAX_COMPLEXITY}}` max) vue au §1 est la première défense contre les angles morts de sécurité.

- **Defense in Depth & Sanitisation :** Ne jamais faire confiance aux entrées. Validation stricte (ex: `Zod`, `Joi`). Requêtes paramétrées obligatoires contre SQLi et encodage contre XSS.
- **Fail-Safe Defaults :** Tout accès est refusé par défaut.

### 4.1. Hard Limits de Sécurité (Standard OWASP)
- **Authentification & Sessions :** 
  - Durée de vie d'un **Access Token (JWT) : {{JWT_EXPIRATION}} max** (défini dans PROJECT_CONFIG.md).
  - Durée de vie d'un **Refresh Token : 7 jours max** (en `HttpOnly`).
- **Limites de Charge (Payload Limits) :**
  - Corps de requête API (JSON) : **{{MAX_PAYLOAD}} max** (Protection DoS).
  - Upload d'image : **5 Mo max**.
- **Anti-Brute Force (Rate Limiting) :**
  - Bloquer un compte/IP après **{{RATE_LIMIT_MAX_ATTEMPTS}} tentatives échouées** pendant **{{RATE_LIMIT_WINDOW}} minutes** (défini dans PROJECT_CONFIG.md).
  - Limite globale par IP : **100 requêtes API / minute**.
- **Gestion des secrets :** Toujours via variables d'environnement (`.env`). Jamais hardcodés.
- **Analyse SCA et SAST (Obligatoire) :** 
  - L'analyse SCA (Software Composition Analysis via Dependabot, Snyk, ou Trivy) pour détecter les dépendances vulnérables est **obligatoire**.
  - Le scan SAST du code via `Semgrep` (règles OWASP Top 10) est **obligatoire** et bloquant dans la CI.

---

## 5. Stratégie Git : Git Flow / GitHub Flow / GitLab Flow

La stabilité de la branche principale est primordiale. Nous utilisons un flux basé sur les Pull Requests/Merge Requests (PR/MR) :
- **Branche `main` verrouillée :** Les pushes directs sur `main` sont **strictement interdits**.
- **Branches Courtes :** Créez des branches par fonctionnalité (`feat/xxx`, `fix/xxx`). Les branches ne doivent pas durer plus de quelques jours.
- **Pull/Merge Requests Obligatoires :** Tout code doit passer par une PR/MR. L'intégration Continue (CI) s'exécute sur la PR/MR pour valider les tests et le linting.
- **Revue de Code (Code Review) :** Une approbation est requise avant le merge. Le respect du Playbook y est vérifié.
- **Conventional Commits :** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. Tout commit doit inclure l'ID du ticket Kanban (`#XYZ`).

### 5.5. Workflow Quotidien Développeur

Pour garantir une synchronisation constante avec l'équipe et éviter les conflits :
- **Routine matinale** : Avant de commencer à coder, toujours faire `git pull origin main` (ou `git pull origin master` selon la convention du projet).
- **Création de branche** : Toujours travailler sur une branche `feat/xxx` ou `fix/xxx` créée depuis `main` à jour.
- **Commit fréquent** : `git add .` + `git commit -m "message descriptif"` avant chaque push. Les commits doivent être atomiques et cohérents.
- **Push régulier** : Pousser régulièrement le travail sur la branche distante pour sauvegarder le progrès et permettre la revue continue.

### 5.6. Rôles et Responsabilités

Une équipe structurée avec des responsabilités claires évite les conflits et les blocages :
- **Developer** : Code, commits, tests locaux, création de PR/MR, résolution des commentaires de revue.
- **Reviewer** : Revue de code, validation du respect du Playbook, vérification de la logique métier et de la sécurité.
- **Owner** : Gestion du projet, configuration initiale, invitation des membres, définition des priorités, validation des merges majeurs.
- **Tech Lead (IA)** : Pilotage Kanban, Crash Clause, autonomie dans l'exécution technique, toujours sous contrôle de l'intention métier.

**Exception Solo Developer** : Pour les projets avec un seul développeur, l'Owner peut approuver ses propres PRs. La règle de revue de code obligatoire par un tiers s'applique uniquement lorsqu'il y a plusieurs contributeurs actifs sur le projet.

### 5.7. Pipeline CI/CD (Étapes)

Le pipeline CI/CD doit suivre ces étapes séquentielles pour garantir la qualité :
1. **Build Test** : Compilation du projet, vérification que le code compile sans erreur.
2. **Quality Test** : Linting (ESLint, Pylint, etc.), analyse statique de code (SAST/SCA), vérification des conventions de nommage.
3. **Integration Test** : Tests d'intégration (DB, API externes), validation de la communication entre composants.
4. **Functional Test** : Tests E2E (Playwright, Cypress), validation des scénarios métier complets. *Note : Ces tests peuvent être manuels initialement mais doivent être automatisés progressivement.*
5. **Performance Test** : Benchmarks, tests de charge, vérification des temps de réponse. *Note : Cette étape est modulée selon la phase du projet déclarée dans PROJECT_CONFIG. Elle est non-bloquante ou désactivée en phase Idée/R&D pour privilégier la vélocité.*

### 5.8. Stratégies de Merge

Pour optimiser le flux de travail tout en maintenant la qualité :
- **AUTO MERGE** : Pour les changements triviaux et non-risqués (documentation, configuration, corrections mineures). Le pipeline CI/CD doit être vert et au moins un reviewer doit avoir approuvé.
- **MANUAL MERGE** : Pour les features, fixes majeurs, refactors, et tout changement impactant la logique métier ou la sécurité. Une validation humaine explicite est requise.
- **MARK MERGE REQUEST AS READY** : Indiquer que la PR/MR est prête pour revue (statut "Ready for review" sur GitLab, "Ready" sur GitHub).

### 5.9. Environnements

La séparation des environnements garantit une isolation claire des risques :
- **Local** : Environnement de développement, tests manuels, expérimentation rapide.
- **Pre-production (Staging)** : Environnement de pré-production, identique à la production, pour les tests fonctionnels et la validation avant release.
- **Production** : Environnement de production, accessible aux utilisateurs finaux, déploiement automatisé via CI/CD après validation complète.

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
- **Processus de Vérification Systématique (Anti-Amnésie) :** À chaque nouveau prompt de l'utilisateur, la TOUTE PREMIÈRE action de l'IA doit être de lire et relire le fichier `ENGINEERING_PLAYBOOK.md` (ou `PROJECT_CONFIG.md`) pour se recharger avec les règles dures, avant même de commencer à analyser la demande ou d'écrire du code.
- **Le "Pourquoi" avant tout :** Chaque Issue, PR/MR ou tâche doit obligatoirement commencer par expliciter le but ultime (l'intention métier). L'IA ne doit pas deviner le but, elle doit le suivre.
  - *Mécanique CI :* L'intention déclarée dans une PR doit faire au minimum **30 caractères**, sous peine de rejet par la CI anti-contournement.
- **Découpage en Issues :** Utiliser la CLI de la plateforme (GitHub `gh issue create`, GitLab `glab issue create`) pour découper un grand chantier en sous-tâches.
- **Création de Pull/Merge Requests :** Si des branches temporaires sont requises pour une revue par l'utilisateur, utiliser la CLI appropriée (GitHub `gh pr create`, GitLab `glab mr create`).
- **Validation Humaine Obligatoire :** L'IA ne merge **JAMAIS** de Pull/Merge Request elle-même. Elle prépare tout et demande à l'utilisateur de cliquer sur le bouton de Merge.
- **Crash Clause Anti-Contournement :** Face à un mur (erreur technique, consigne ambiguë, outil manquant), l'IA doit échouer bruyamment (Fail Fast) et s'arrêter pour demander de l'aide à l'utilisateur, plutôt que d'improviser une solution toxique ou de masquer l'erreur en silence.
- **Synchronisation IA :** L'IA doit s'assurer que ses règles de comportement sont universelles. Les fichiers `.cursorrules` et `.windsurfrules` doivent être gardés parfaitement identiques (vérifié via pre-commit).

---

## 9. Hygiène, CI/CD et Séparation R&D

- **Zéro Scories :** Scripts temporaires, fichiers de debug ou commentaires commentés doivent être supprimés avant tout push.
- **CI/CD :** À chaque push, les workflows CI/CD (GitHub Actions, GitLab CI, etc.) doivent vérifier : Lint, Build, Tests Unitaires, Analyse de sécurité.
- **Gestion des versions :** La gestion des versions (Semantic Versioning) est pilotée automatiquement via les Conventional Commits. Outils recommandés : Release Please (GitHub), GitLab Release, semantic-release, etc.
- **Séparation R&D :** Les expérimentations sans cahier des charges validé se font sur un dépôt privé séparé. L'historique Git officiel du produit final doit rester propre et professionnel.

---

## 10. Verrouillage Mécanique (Ultimate Lockdown)

Le GEF ne repose pas uniquement sur la discipline humaine ou l'obéissance de l'IA, il impose ses règles de manière **mécanique et incontournable** :
- **Documentation Forcée (Git Hooks) :** Tout correctif (`fix/`) sans mise à jour du `RESEARCH_LOG.md` sera rejeté au commit. Tout ajout de dépendance sans nouvel `ADR` sera bloqué.
- **Limites dures (Hard Limits) :** Les avertissements de taille de fichier (> 400 lignes) ou de contournement de linter (`@ts-ignore`) ne sont plus de simples warnings, mais des erreurs fatales (`exit 1`) dans les hooks de pre-commit locaux ET dans la CI.
- **Issue Forms (YAML) :** La création de ticket est stricte. Les `Issue Forms` exigent formellement le renseignement de l'Intention Métier et la validation manuelle des engagements GEF via des Checklists bloquantes.
- **Chain of Thought IA :** Toute IA opérant sur le projet a pour interdiction de générer du code sans avoir préalablement vérifié et validé sa conformité dans un bloc XML `<gef_compliance_check>`.

---

## 11. Opérations & Run (Day 2) — Pratiques Avancées

Conscient que le succès d'un logiciel se joue autant après le déploiement qu'avant, le GEF vise à intégrer progressivement les standards de l'industrie (Big Tech) pour la phase de Run, dès que la maturité du projet le permet :

- **Observabilité (Logging Structuré) :** Remplacer les simples `console.log` par des logs structurés (JSON) incluant le contexte d'exécution (Trace ID, User ID) pour permettre un debugging asynchrone efficace sur Datadog/ELK.
- **Feature Flags :** Protéger le développement collaboratif en encapsulant tout code inachevé ou risqué derrière des Feature Flags, permettant de merger du code continuellement sans impacter les utilisateurs.
- **Rollout Progressif :** Préférer les déploiements Canary (ex: 5% des utilisateurs d'abord) ou Blue/Green, couplés à un rollback automatisé en cas de pic d'erreurs (SLO Breach).
- **Post-Mortem Blameless :** Tout incident de production doit donner lieu à un document structuré (Cause racine, Impact, 5 Whys, Action Items) orienté sur la défaillance systémique et non sur l'erreur humaine.

---

*Ce document évolutif garantit un niveau d'ingénierie d'excellence (Standard DORA "Elite") sur l'ensemble de nos projets.*
