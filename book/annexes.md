# Annexes

## Annexe A : Référence complète du Engineering Playbook

Cette annexe contient la référence complète du Engineering Playbook de GEF. Pour la version la plus à jour, consultez le fichier `ENGINEERING_PLAYBOOK.md` dans le dépôt GEF.

### § 0. Cycle de Vie du Projet & Clause d'Antériorité

L'IA doit toujours identifier la phase du projet avant d'agir (Idée → R&D → Dev Contractuel → Release → Maintenance).

**Clause d'Antériorité (Fix Forward) :** L'IA applique les règles du Playbook sur tout le nouveau code produit. Elle ne doit jamais refactoriser proactivement du code existant uniquement pour le rendre conforme à une nouvelle règle, sauf demande explicite.

### § 1. Clean Code : Métriques, Tailles et Refactoring

**Tailles Maximales (Hard Limits) :**
- Fonctions / Méthodes : `{{MAX_LINES}} lignes max`
- Paramètres : `{{MAX_PARAMS}} arguments max`
- Composants UI : `150 à 200 lignes max`
- Fichiers : `300 à 400 lignes max`

**Complexité et Nesting :**
- Profondeur (Nesting) : `3 niveaux max`
- Guard Clauses (Early Return) : Obligatoire
- Complexité Cyclomatique : Maximum `{{MAX_COMPLEXITY}}` chemins logiques par fonction

**Règles de Refactoring (The Rule of Three) :**
- 1ère fois : Écrire pour résoudre
- 2ème fois : Tolérer la duplication
- 3ème fois : Refactorisation obligatoire en abstraction réutilisable

**Conventions de Nommage :**
- Fichiers / Dossiers : `kebab-case`
- Classes / Composants : `PascalCase`
- Variables / Fonctions : `camelCase`
- Constantes Globales : `UPPER_SNAKE_CASE`

### § 2. Architecture & Design (Clean Architecture & SOLID)

**Principe de Responsabilité Unique (SRP) :** Une classe/fonction ne fait qu'une seule chose.

**Dependency Inversion (DIP) :** Le domaine dépend d'interfaces, pas d'implémentations.

**Architecture par Fonctionnalité (Feature-Sliced Design) :**
- Mauvais : `/controllers`, `/models`, `/views`
- Bon : `/features/auth/api.ts`, `/features/auth/components/`, `/features/billing/model.ts`

### § 3. Gestion Avancée des Erreurs (Resilience)

**Information Hiding :** Ne JAMAIS exposer de stack traces ou de détails techniques au client final.

**Typage des Erreurs :** Créer des classes d'exceptions (ex: `DomainError`, `InfraError`, `ValidationError`).

**Result Pattern :** Remplacer les blocs `try/catch` massifs par des retours prévisibles de type `Result<Success, Failure>`.

### § 4. Sécurité : OWASP Secure-by-Design & Hard Limits

**Defense in Depth & Sanitisation :** Ne jamais faire confiance aux entrées. Validation stricte (ex: `Zod`, `Joi`). Requêtes paramétrées obligatoires.

**Fail-Safe Defaults :** Tout accès est refusé par défaut.

**Hard Limits de Sécurité :**
- Access Token (JWT) : 15 minutes max
- Refresh Token : 7 jours max (en `HttpOnly`)
- Corps de requête API (JSON) : `{{MAX_PAYLOAD}} max`
- Upload d'image : 5 Mo max
- Anti-Brute Force : Bloquer après 5 échecs pendant 15 minutes
- Limite globale : 100 requêtes API / minute / IP
- Gestion des secrets : Toujours via `.env`. Jamais hardcodés.

### § 5. Stratégie Git : GitHub Flow (Pull Requests)

**Branche `main` verrouillée :** Les pushes directs sur `main` sont strictement interdits.

**Branches Courtes :** Créez des branches par fonctionnalité (`feat/xxx`, `fix/xxx`).

**Pull Requests (PR) Obligatoires :** Tout code doit passer par une PR.

**Revue de Code :** Une approbation est requise avant le merge.

**Conventional Commits (strict) :** Format : `type: description courte (#ticket-kanban)`

### § 6. Documentation : Diátaxis & Docs-as-Code

**Structure Diátaxis :**
1. Tutoriels (Prise en main)
2. How-to Guides (Tâches spécifiques)
3. Référence (API, DB)
4. Explication (Architecture, ADR)

**Docs-as-Code & Modèle C4 :** L'architecture doit être visuelle et versionnée.

**ADR & RESEARCH_LOG :**
- ADR : Tout changement structurel majeur nécessite un rapport d'Architecture
- RESEARCH_LOG.md : Tout bug critique bloquant doit être détaillé

### § 7. Assurance Qualité (QA) : Shift-Left & Test Pyramid

**Shift-Left Testing :** La réflexion sur les tests et la sécurité commence dès l'écriture des spécifications.

**Behavior-Driven Development (BDD) :** Les tests doivent suivre la syntaxe `Given / When / Then`.

**La Pyramide des Tests :**
- Base : 80% de Tests Unitaires
- Milieu : 15% de Tests d'Intégration
- Sommet : 5% de Tests End-to-End (E2E type Playwright)

### § 8. Pilotage Kanban et Autonomie de l'IA

**Le "Pourquoi" avant tout :** Chaque Issue, PR ou tâche doit obligatoirement commencer par expliciter le but ultime.

**Découpage en Issues :** Utiliser la CLI GitHub (`gh issue create`) pour découper un grand chantier en sous-tâches.

**Création de Pull Requests (PR) :** Utiliser `gh pr create`.

**Validation Humaine Obligatoire :** L'IA ne merge JAMAIS de Pull Request elle-même.

**Crash Clause Anti-Contournement :** Face à un mur, l'IA doit échouer bruyamment et s'arrêter pour demander de l'aide.

### § 9. Hygiène, CI/CD et Séparation R&D

**Zéro Scories :** Scripts temporaires, fichiers de debug ou commentaires commentés doivent être supprimés avant tout push.

**CI/CD :** À chaque push, les workflows GitHub Actions doivent vérifier : Lint, Build, Tests Unitaires, Analyse de sécurité.

**Release Please :** La gestion des versions est pilotée automatiquement via les Conventional Commits.

**Séparation R&D :** Les expérimentations sans cahier des charges validé se font sur un dépôt privé séparé.

---

## Annexe B : Guide d'installation rapide

### Prérequis

- Node.js (v18+)
- Git
- GitHub CLI (`gh`) pour les fonctionnalités Kanban (optionnel mais recommandé)

### Installation

**Créer un nouveau projet :**
```bash
npx create-gef
```

**Mettre à jour un projet existant :**
```bash
npx create-gef update
```

**Afficher l'aide :**
```bash
npx create-gef --help
npx create-gef --version
```

### Développement local

Si vous modifiez le framework GEF lui-même :

```bash
# Cloner le dépôt
git clone https://github.com/Gnzikoune/GEF.git GEF
cd GEF

# Installer les dépendances
npm install

# Rendre la commande locale accessible globalement
npm link
```

### Configuration du projet

Après création, le fichier `PROJECT_CONFIG.md` contient toute la configuration du projet. Modifiez-le selon vos besoins.

### Niveaux de sévérité

Choisissez le niveau approprié lors de la création du projet :

| Niveau | Fonctions max | Params max | Complexité max | Payload JSON max |
|---|---|---|---|---|
| **Startup / R&D** | 50 lignes | 4 | 15 | 5 Mo |
| **Standard / Enterprise** | 30 lignes | 3 | 10 | 1 Mo |
| **Mission Critical** | 15 lignes | 2 | 5 | 100 Ko |

---

## Annexe C : Configuration avancée

### Personnalisation des Hard Limits

Pour modifier les Hard Limits après création du projet :

1. Éditez `PROJECT_CONFIG.md`
2. Modifiez les valeurs `MAX_LINES`, `MAX_PARAMS`, `MAX_COMPLEXITY`, `MAX_PAYLOAD`
3. Éditez la configuration du linter (`biome.json`, `.eslintrc.json`, ou `ruff.toml`)
4. Mettez à jour les prompts IA dans `.gef/prompts/` si nécessaire

### Personnalisation des hooks Git

Les hooks Git sont générés dans `.git/hooks/`. Pour les personnaliser :

1. Éditez les fichiers `.git/hooks/commit-msg`, `.git/hooks/pre-commit`, `.git/hooks/pre-push`
2. Testez vos modifications
3. Pour les propager à l'équipe, ajoutez les hooks personnalisés dans un dossier du projet et créez un script d'installation

### Personnalisation de la CI/CD

Le workflow CI/CD est dans `.github/workflows/main.yml`. Pour le personnaliser :

1. Éditez `.github/workflows/main.yml`
2. Ajoutez ou modifiez les jobs selon vos besoins
3. Testez via une PR avant de merger

### Intégration avec d'autres outils

**SonarQube :**
```yaml
# Ajouter dans .github/workflows/main.yml
- name: SonarQube Scan
  uses: sonarsource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**Slack Notifications :**
```yaml
# Ajouter dans .github/workflows/main.yml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Annexe D : Bibliographie et références

### Livres

- *Clean Code* de Robert C. Martin
- *The Pragmatic Programmer* de Andy Hunt et Dave Thomas
- *Software Engineering at Google* de Titus Winters et al.
- *Building Microservices* de Sam Newman
- *Domain-Driven Design* de Eric Evans

### Standards et Spécifications

- Conventional Commits : https://www.conventionalcommits.org/
- Semantic Versioning : https://semver.org/
- OWASP Top 10 : https://owasp.org/www-project-top-ten/
- Diátaxis Framework : https://diataxis.fr/

### Outils

- Biome : https://biomejs.dev/
- ESLint : https://eslint.org/
- Playwright : https://playwright.dev/
- GitHub Actions : https://github.com/features/actions
- Release Please : https://github.com/googleapis/release-please

### Articles et Ressources

- Feature-Sliced Design : https://feature-sliced.design/
- MAPE-K Loop (Autonomic Computing) : IBM Research
- DORA Metrics : https://dora.dev/
- Google Engineering Practices : https://sre.google/sre/book/

### Communautés

- GitHub GEF : https://github.com/Gnzikoune/GEF
- NPM Package : https://www.npmjs.com/package/create-gef
- Issues et Discussions : https://github.com/Gnzikoune/GEF/issues

---

## Annexe E : Glossaire

**ADR (Architecture Decision Record)** : Document qui capture une décision architecturale importante, son contexte, et ses conséquences.

**Biome** : Linter et formateur pour JavaScript/TypeScript, plus rapide que ESLint/Prettier.

**CI/CD (Continuous Integration / Continuous Deployment)** : Pratique d'intégrer et déployer le code automatiquement.

**Conventional Commits** : Spécification pour les messages de commit (ex: `feat:`, `fix:`).

**Crash Clause** : Règle GEF obligeant l'IA à s'arrêter et signaler tout obstacle plutôt que d'improviser.

**DORA Metrics** : Quatre métriques clés pour mesurer la performance des équipes logicielles (Deployment Frequency, Lead Time, Restore Time, Failure Rate).

**Feature-Sliced Design** : Approche d'architecture organisant le code par fonctionnalité métier.

**GitHub Flow** : Stratégie Git simple avec branches courtes et Pull Requests obligatoires.

**Hard Limits** : Limites quantitatives strictes (ex: 30 lignes max par fonction).

**Hook Git** : Script qui s'exécute automatiquement à des moments précis du workflow Git.

**OWASP** : Open Web Application Security Project, organisation qui définit les standards de sécurité.

**Playwright** : Framework de tests E2E pour applications web.

**Release Please** : Outil qui automatise la gestion des versions via Semantic Versioning.

**Result Pattern** : Pattern de programmation pour gérer explicitement les succès et échecs.

**SonarQube** : Plateforme d'analyse de qualité de code.

**Trunk-Based Development** : Stratégie Git où les développeurs commettent directement sur la branche principale.

**Zero Trust** : Principe de sécurité ne faisant confiance à aucune entrée par défaut.

---

## Annexe F : Cheat Sheet

### Commandes GEF

```bash
# Créer un nouveau projet
npx create-gef

# Mettre à jour un projet existant
npx create-gef update

# Afficher l'aide
npx create-gef --help

# Afficher la version
npx create-gef --version
```

### Commandes Git (GitHub Flow)

```bash
# Créer une branche de fonctionnalité
git checkout -b feat/nouvelle-feature

# Committer avec format Conventional Commits
git commit -m "feat: description (#42)"

# Pousser la branche
git push origin feat/nouvelle-feature

# Créer une Pull Request
gh pr create

# Merger la PR (via interface GitHub)
```

### Commandes GitHub CLI

```bash
# Créer une issue
gh issue create --title "Titre" --body "Description"

# Voir les issues
gh issue list

# Créer une PR
gh pr create --title "Titre" --body "Description"

# Voir les PRs
gh pr list
```

### Format Conventional Commits

```
feat: nouvelle fonctionnalité (#42)
fix: correction de bug (#43)
chore: tâche de maintenance (#44)
refactor: refactoring sans changement de comportement (#45)
docs: documentation uniquement (#46)
test: ajout ou modification de tests (#47)
style: style uniquement (#48)
```

### Structure ADR

```markdown
# ADR-XXXX : [Titre]

## Statut
Proposé | Accepté | Rejeté

## Contexte
Quel est le problème ?

## Décision
Quelle est la décision ?

## Conséquences
Impacts positifs et négatifs

## Alternatives
Quelles alternatives considérées ?
```

### Niveaux de sévérité

| Niveau | MAX_LINES | MAX_PARAMS | MAX_COMPLEXITY | MAX_PAYLOAD |
|---|---|---|---|---|
| Startup | 50 | 4 | 15 | 5 Mo |
| Standard | 30 | 3 | 10 | 1 Mo |
| Mission Critical | 15 | 2 | 5 | 100 Ko |
