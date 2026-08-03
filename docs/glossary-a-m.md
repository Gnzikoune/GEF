# Glossaire A-M du Guardian Engineering Framework

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