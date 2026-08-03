# Glossaire N-Z du Guardian Engineering Framework

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