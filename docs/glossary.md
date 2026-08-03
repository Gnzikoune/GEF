# Glossaire du Guardian Engineering Framework

Ce glossaire définit tous les termes techniques et concepts clés utilisés dans le Guardian Engineering Framework.

## A

- **ADR (Architecture Decision Record)** : Document qui enregistre les décisions architecturales importantes, leur contexte, les alternatives considérées et les conséquences. Format standardisé dans `docs/explanation/adr/`.
- **Anti-Amnésie** : Mécanisme du GEF qui force l'IA à relire systématiquement les fichiers de configuration (Playbook, Context, Research Log) à chaque interaction pour éviter la perte de contexte.
- **Anti-Contournement** : Ensemble de mécanismes (hooks, CI, vérifications) qui empêchent le contournement silencieux des règles du GEF.

## B

- **BDD (Behavior-Driven Development)** : Méthodologie de développement qui utilise la syntaxe `Given / When / Then` pour décrire le comportement attendu, particulièrement pour les tests d'intégration et E2E.
- **Biome** : Linter formateur moderne pour JavaScript/TypeScript, alternative à ESLint + Prettier.
- **Branches Courtes** : Principe Git Flow selon lequel les branches de fonctionnalité ne doivent durer que quelques jours maximum.

## C

- **CI/CD (Continuous Integration / Continuous Deployment)** : Pipeline d'intégration et déploiement continu qui exécute automatiquement les tests, linting et déploiement.
- **Clean Architecture** : Pattern architectural qui sépare le domaine métier de l'infrastructure technique (frameworks, DB, UI).
- **Clean Code** : Ensemble de pratiques de codage visant la clarté, la maintenabilité et la qualité (principe KISS).
- **Commit-msg Hook** : Hook Git qui vérifie que les messages de commit suivent le format Conventional Commits avec un numéro de ticket Kanban.
- **Conventional Commits** : Format standardisé de messages de commit : `type: description (#ticket)`. Types : `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`.
- **Context Memory** : Fichier `CONTEXT.md` qui sert de mémoire externe pour l'IA, contenant l'état actuel du projet et les règles essentielles.
- **Crash Clause** : Règle fondamentale du GEF : face à une erreur ou ambiguïté, arrêter immédiatement et signaler le problème plutôt que d'improviser une solution silencieuse.
- **Cursor/Windsurf** : IDEs avec intégration IA qui lisent nativement les fichiers `.cursorrules` et `.windsurfrules`.

## D

- **Dependency Inversion (DIP)** : Principe SOLID selon lequel le domaine dépend d'interfaces, jamais d'implémentations concrètes.
- **Diátaxis** : Framework de documentation structuré en 4 quadrants : Tutorials, How-to, Reference, Explanation.
- **DORA Metrics** : Métriques DevOps Research and Assessment (Deployment Frequency, Lead Time, Change Failure Rate, MTTR) pour mesurer la performance d'ingénierie.

## E

- **Early Return** : Technique de programmation (Guard Clauses) qui réduit le nesting en retournant tôt les cas d'erreur ou conditions spéciales.
- **ENGINEERING_PLAYBOOK.md** : Source de vérité absolue du GEF, contenant toutes les règles universelles d'ingénierie.
- **E2E (End-to-End)** : Tests qui valident des scénarios métier complets de bout en bout (ex: Playwright, Cypress).

## F

- **Fail-Safe Defaults** : Principe de sécurité selon lequel tout accès est refusé par défaut et doit être explicitement accordé.
- **Feature-Sliced Design** : Organisation des dossiers par fonctionnalité métier, non par couche technique (ex: `/features/auth/` au lieu de `/controllers/`).
- **Force Push** : Opération Git interdite par le GEF car elle peut écraser l'historique et causer la perte de données.

## G

- **Guard Clauses** : Technique de réduction du nesting via des retours anticipés pour les conditions d'erreur.
- **GitHub Flow** : Stratégie Git basée sur des branches courtes et des Pull Requests obligatoires avant merge sur main.
- **Git Hooks** : Scripts automatiques exécutés à des moments clés (pre-commit, commit-msg, pre-push) pour enforcing les règles.

## H

- **Hard Limits** : Limites absolues et non-négociables du GEF (taille de fichiers, complexité, nesting) qui déclenchent une erreur si violées.
- **Hooks Git** : Scripts automatiques qui s'exécutent à des moments clés du workflow Git pour enforcing les règles du GEF.

## I

- **Information Hiding** : Principe de résilience selon lequel les détails techniques (stack traces) ne doivent jamais être exposés aux utilisateurs finaux.
- **Intention Métier** : Description du "pourquoi" d'une tâche, obligatoire dans les Issues et PRs pour assurer la traçabilité.

## K

- **Kanban** : Méthodologie de gestion de projet utilisée par le GEF pour le pilotage des tâches via GitHub Issues.

## L

- **Linting** : Analyse statique du code pour vérifier le respect des conventions de style et détecter les erreurs potentielles.
- **Lock Files** : Fichiers générés automatiquement (package-lock.json, yarn.lock) qui contiennent les métadonnées précises des dépendances.

## M

- **Main Verrouillée** : Règle Git Flow selon laquelle la branche `main` est intouchable : pushes directs strictement interdits.
- **Mission Critical** : Niveau de sévérité maximum du GEF avec les Hard Limits les plus strictes (15 lignes max par fonction, 2 paramètres max, complexité 5).

## N

- **Nesting** : Profondeur d'imbrication du code (if/else dans des if/else). Le GEF limite à 3 niveaux maximum.
- **Node.js** : Runtime JavaScript requis (v18+) pour exécuter le générateur GEF.

## O

- **OWASP** : Open Web Application Security Project, organisation qui définit les standards de sécurité web.
- **OWASP Top 10** : Liste des 10 risques de sécurité les plus critiques pour les applications web.

## P

- **Package.json** : Fichier de configuration Node.js qui définit les métadonnées, dépendances et scripts d'un projet.
- **Playbook** : Voir ENGINEERING_PLAYBOOK.md.
- **Pre-commit Hook** : Hook Git qui s'exécute avant chaque commit pour vérifier la conformité (secrets, linting, taille de fichiers).
- **Pre-push Hook** : Hook Git qui s'exécute avant chaque push pour vérifier la branche et lancer les tests si configuré.
- **PROJECT_CONFIG.md** : Fichier de configuration spécifique à chaque projet généré par GEF (cloud, DB, stack, sévérité).
- **Pull Request (PR)** : Demande de fusion de code qui passe obligatoirement par une revue avant merge sur main.

## R

- **Rate Limiting** : Limite du nombre de requêtes API par minute/IP pour prévenir les attaques DoS (100 req/min selon GEF).
- **RESEARCH_LOG.md** : Fichier obligatoire pour documenter les bugs critiques résolus (symptôme, cause racine, résolution, leçon apprise).
- **Result Pattern** : Pattern de gestion d'erreurs qui remplace les try/catch massifs par des retours explicites `Result<Success, Failure>`.
- **Ruff** : Linter moderne pour Python, alternative à pylint/flake8.

## S

- **SAST (Static Application Security Testing)** : Analyse statique de sécurité du code pour détecter les vulnérabilités (ex: Semgrep avec règles OWASP).
- **Semantic Versioning** : Système de numérotation de versions (MAJOR.MINOR.PATCH) qui communique l'impact des changements.
- **Shift-Left** : Principe selon lequel la réflexion sur les tests commence dès l'écriture des spécifications, avant le code.
- **SOLID** : 5 principes de conception orientée objet (SRP, OCP, LSP, ISP, DIP).
- **SRP (Single Responsibility Principle)** : Principe selon lequel une classe/fonction ne doit faire qu'une seule chose.
- **Startup** : Niveau de sévérité minimum du GEF avec des Hard Limits souples (50 lignes max par fonction, 4 paramètres max, complexité 15).
- **Standard** : Niveau de sévérité par défaut du GEF (30 lignes max par fonction, 3 paramètres max, complexité 10).

## T

- **Tag Git** : Marqueur sur un commit spécifique pour identifier une version (ex: v1.10.0).
- **Tech Lead Virtuel** : Concept du GEF où l'IA pilote le Kanban et l'autonomie technique sous contrôle de l'intention métier.
- **TDD (Test-Driven Development)** : Méthodologie où les tests sont écrits avant le code.
- **Tests d'Intégration** : Tests qui valident la communication entre composants (DB, API externes).

## U

- **Upload Limit** : Limite de taille des fichiers uploadés (5 Mo max selon GEF OWASP).

## V

- **Version Bump** : Incrémentation de version selon Semantic Versioning (patch, minor, major).
- **Violations Historiques** : Documentation des erreurs passées et leçons apprises pour éviter leur répétition.

## Z

- **Zero Trust** : Principe de sécurité selon lequel aucune entrée utilisateur ne doit être confiance par défaut.