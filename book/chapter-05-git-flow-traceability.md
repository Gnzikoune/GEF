# Chapitre 5 : Git Flow et Traçabilité

## 5.1. GitHub Flow vs Trunk-Based Development

La traçabilité en ingénierie logicielle repose sur deux piliers : un workflow Git clair et une historique des commits exploitable. GEF supporte deux stratégies Git principales, chacune adaptée à des contextes différents.

### GitHub Flow (Recommandé)

GitHub Flow est une stratégie simple et efficace pour la plupart des équipes, particulièrement celles qui déploient fréquemment.

**Principe de base :**
1. La branche `main` est toujours déployable
2. Pour chaque nouvelle fonctionnalité, créer une branche depuis `main`
3. Faire les commits sur cette branche
4. Ouvrir une Pull Request vers `main`
5. Discuter, revoir le code
6. Merger la PR dans `main`
7. Déployer immédiatement

**Avantages :**
- Branche principale toujours stable
- Revue de code systématique avant merge
- Historique Git propre et linéaire
- Facile à comprendre pour les nouvelles équipes

**Inconvénients :**
- Peut sembler lent pour des changements mineurs
- Nécessite une culture de revue de code établie

### Trunk-Based Development

Trunk-Based Development est une stratégie plus radicale où les développeurs commettent directement sur la branche principale (trunk), avec des protections automatisées.

**Principe de base :**
1. Les développeurs commettent directement sur `main`
2. Chaque commit doit passer les tests automatisés
3. Les features sont activées via feature flags
4. Les problèmes sont corrigés rapidement sur `main`

**Avantages :**
- Pas de friction de merge
- Intégration continue maximale
- Adapté aux équipes très expérimentées avec tests solides

**Inconvénients:**
- Nécessite une excellente couverture de tests
- Risque de régressions si les tests sont insuffisants
- Plus difficile à mettre en place

### Choix dans GEF

Lors de la création du projet, le générateur demande quelle stratégie Git utiliser :

- **GitHub Flow** (recommandé) : Le hook `pre-push` bloque tout push direct sur `main`
- **Trunk-Based Development** : Le hook `pre-push` autorise les pushes sur `main` mais exécute les tests locaux avant

Ce choix est ensuite :
- Documenté dans `PROJECT_CONFIG.md`
- Configuré dans les hooks Git générés
- Intégré dans les prompts IA pour guider le workflow

## 5.2. Hooks Git bloquants

Les hooks Git sont des scripts qui s'exécutent automatiquement à des moments précis du workflow Git. GEF génère trois hooks principaux qui imposent mécaniquement les règles d'ingénierie.

### Hook commit-msg

Ce hook valide le format du message de commit. Il s'exécute après que le développeur a écrit le message mais avant que le commit ne soit finalisé.

**Règles imposées :**

1. **Format Conventional Commits** : Le message doit commencer par l'un des types suivants :
   - `feat:` : Nouvelle fonctionnalité
   - `fix:` : Correction de bug
   - `chore:` : Tâche de maintenance
   - `refactor:` : Refactoring sans changement de comportement
   - `docs:` : Documentation uniquement
   - `test:` : Tests uniquement
   - `style:` : Style uniquement (formatage, etc.)

2. **Référence Kanban obligatoire** : Le message doit inclure une référence à un ticket Kanban avec le format `#XYZ`

**Exemples valides :**
```
feat: ajout de l'authentification OAuth (#42)
fix: correction du bug de pagination sur la liste des produits (#43)
chore: mise à jour des dépendances (#44)
```

**Exemples invalides :**
```
ajout auth
fix bug
update deps
```

**Comportement en cas d'échec :**
Si le message ne respecte pas le format, le hook affiche un message d'erreur explicite et bloque le commit. Le développeur doit corriger le message avant de pouvoir committer.

**Pourquoi cette règle ?**
- L'historique Git devient exploitable (`git log` peut filtrer par type)
- Chaque commit est lié à un ticket, assurant la traçabilité
- Facilite la génération automatique du CHANGELOG via Release Please

### Hook pre-commit

Ce hook s'exécute avant chaque commit et effectue trois vérifications critiques.

**Vérification 1 : Détection de secrets**

Le hook scanne les fichiers stagés pour détecter des secrets en clair :
- Clés API (ex: `sk-`, `AIza`, `AKIA`)
- Tokens (ex: `Bearer`, `Authorization`)
- Mots de passe (ex: `password:`, `passwd:`)
- Certificats (ex: `-----BEGIN CERTIFICATE-----`)

Si un secret est détecté, le commit est bloqué avec un message indiquant le fichier et la ligne concernée.

**Vérification 2 : Vérification du formatage**

Le hook exécute le linter configuré (Biome, ESLint, Ruff) sur les fichiers modifiés :
- Vérifie le formatage du code
- Vérifie le respect des conventions de nommage
- Vérifie les limites de taille (fonctions, fichiers)

Si le linter échoue, le commit est bloqué. Le développeur peut exécuter `npm run lint:fix` pour corriger automatiquement les problèmes de formatage.

**Vérification 3 : Blocage de main/master**

Le hook vérifie que le développeur n'essaie pas de committer directement sur `main` ou `master` (en GitHub Flow). Si c'est le cas, le commit est bloqué avec un message expliquant qu'il faut créer une branche.

**Comportement en cas d'échec :**
Pour chaque vérification échouée, le hook affiche un message d'erreur explicite avec des instructions sur comment corriger le problème. Le commit est bloqué jusqu'à ce que toutes les vérifications passent.

### Hook pre-push

Ce hook est dynamique selon la stratégie Git choisie lors de la création du projet.

**En GitHub Flow :**
Le hook bloque tout push direct sur `main`. Il vérifie la branche actuelle et refuse le push si c'est `main` ou `master`.

**Message d'erreur :**
```
❌ Push direct sur main interdit en GitHub Flow.
Créez une Pull Request via : gh pr create
```

**En Trunk-Based Development :**
Le hook autorise les pushes sur `main` mais exécute d'abord les tests locaux :
- `npm test` pour les projets Node.js
- `pytest` pour les projets Python

Si les tests échouent, le push est bloqué.

**Pourquoi cette différence ?**
- GitHub Flow privilégie la revue de code via PR
- Trunk-Based privilégie l'intégration continue avec tests automatisés

## 5.3. Conventional Commits et référence Kanban

La spécification Conventional Commits est un standard pour les messages de commit qui rend l'historique Git plus lisible et automatisable.

### Structure d'un message Conventional Commit

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types supportés par GEF :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `chore` : Changement de build, dépendances, etc.
- `refactor` : Refactoring sans changement de comportement
- `docs` : Documentation uniquement
- `test` : Ajout ou modification de tests
- `style` : Style uniquement (formatage, point-virgule, etc.)

**Scope optionnel :**
Le scope indique la partie du code affectée (ex: `feat(auth):`, `fix(api):`).

**Description :**
Une description courte en présentatif, sans point final (ex: `ajout de l'authentification OAuth`).

**Référence Kanban obligatoire :**
GEF exige que chaque commit inclue une référence à un ticket Kanban avec le format `#XYZ`.

**Exemple complet :**
```
feat(auth): ajout de l'authentification OAuth (#42)

Implémente l'authentification via Google OAuth2.
Les utilisateurs peuvent maintenant se connecter avec leur compte Google.

Closes #42
```

### Pourquoi laréférence Kanban ?

La référence Kanban (#42) lie chaque commit à un ticket de suivi. Cela permet de :

1. **Traçabilité complète** : Savoir quel ticket a implémenté quel code
2. **Automatisation** : Release Please peut automatiquement lier les releases aux tickets
3. **Audit** : En cas de problème, retracer le contexte métier du commit
4. **Reporting** : Générer des rapports de progression basés sur les tickets

### Intégration avec GitHub CLI

GEF recommande l'utilisation de GitHub CLI (`gh`) pour la gestion des tickets :
- `gh issue create` : Créer un nouveau ticket
- `gh issue view` : Voir les détails d'un ticket
- `gh pr create` : Créer une Pull Request liée au ticket

L'IA, en tant que Tech Lead Virtuel, peut utiliser ces commandes pour piloter le workflow Kanban.

## 5.4. Pull Requests obligatoires

En GitHub Flow, les Pull Requests (PR) sont obligatoires. Aucun code ne peut être mergé dans `main` sans passer par une PR.

### Processus de PR

1. **Création de la branche** : `git checkout -b feat/nouvelle-feature`
2. **Développement et commits** : Commits avec messages Conventional Commits + référence Kanban
3. **Push de la branche** : `git push origin feat/nouvelle-feature`
4. **Ouverture de la PR** : `gh pr create` ou via l'interface GitHub
5. **Remplissage du template** : GEF génère un template de PR avec checklist
6. **Revue de code** : Au moins une approbation requise
7. **Exécution de la CI** : Tests, linting, analyse de sécurité
8. **Merge** : Une fois la PR approuvée et la CI verte

### Template de PR généré par GEF

GEF génère un fichier `.github/PULL_REQUEST_TEMPLATE.md` avec une checklist obligatoire :

```markdown
## Description
<!-- Décrivez brièvement ce que cette PR change -->

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Changement cassant
- [ ] Documentation

## Checklist
- [ ] Les tests passent localement
- [ ] Le code respecte les conventions de style
- [ ] L'ADR a été mise à jour (si applicable)
- [ ] La documentation a été mise à jour
- [ ] Les commits suivent le format Conventional Commits
- [ ] La référence Kanban est incluse (#XYZ)

## Ticket lié
Closes #XYZ
```

Cette checklist doit être physiquement cochée avant que la PR puisse être mergée. C'est un verrou mécanique supplémentaire.

### Validation CI des PR

La CI configurée par GEF s'exécute automatiquement sur chaque PR :
- **Lint** : Vérifie le formatage et les conventions
- **Tests** : Exécute les tests unitaires et d'intégration
- **Sécurité** : Analyse les vulnérabilités
- **Intention** : Vérifie que la PR a une intention métier déclarée

Si l'un de ces checks échoue, la PR ne peut pas être mergée.

## 5.5. CI/CD comme dernier rempart

La CI/CD (Continuous Integration / Continuous Deployment) est le dernier rempart avant que le code n'atteigne la production. GEF génère un pipeline CI/CD adapté à votre stack.

### Workflow main.yml

Le fichier `.github/workflows/main.yml` généré par GEF définit les jobs suivants :

**Job 1 : Setup**
- Installation du runtime (Node.js, Python, etc.)
- Installation des dépendances

**Job 2 : Lint**
- Exécution du linter (Biome, ESLint, Ruff)
- Vérification des conventions de code

**Job 3 : Tests**
- Exécution des tests unitaires
- Exécution des tests d'intégration
- Génération du rapport de couverture

**Job 4 : Sécurité**
- Scan de vulnérabilités (npm audit, Snyk, etc.)
- Analyse SAST (Static Application Security Testing)

**Job 5 : Build**
- Build de l'application
- Tests E2E (si configurés)

**Job 6 : Déploiement**
- Déploiement sur Vercel (si configuré)
- Déploiement sur AWS (si configuré)
- Création d'une release GitHub (si tag)

### Déclencheurs

Le workflow se déclenche sur :
- Push sur `main`
- Push sur les branches `feat/**` et `fix/**`
- Pull Requests
- Tags `v*.*.*`

### Échec et blocage

Si l'un des jobs échoue, le workflow échoue et :
- La PR ne peut pas être mergée
- Le push sur `main` est rejeté
- Le déploiement n'a pas lieu

C'est le dernier verrou mécanique : même si un développeur contourne les hooks locaux (ce qui est difficile mais possible), la CI bloquera toujours le code non conforme.

## 5.6. Release Please et Semantic Versioning

Release Please est un outil qui automatise la gestion des versions via Semantic Versioning (SemVer). GEF l'intègre pour éliminer la gestion manuelle des versions.

### Semantic Versioning

SemVer définit le format de version : `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements cassants incompatibles (ex: 1.0.0 → 2.0.0)
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles (ex: 1.0.0 → 1.1.0)
- **PATCH** : Corrections de bugs rétrocompatibles (ex: 1.0.0 → 1.0.1)

### Fonctionnement de Release Please

Release Please analyse les commits sur `main` pour déterminer le prochain numéro de version :

- Les commits `feat:` incrémentent MINOR
- Les commits `fix:` incrémentent PATCH
- Les commits contenant `BREAKING CHANGE` incrémentent MAJOR

### Processus automatisé

1. **Push sur main** : Un développeur merge une PR dans `main`
2. **Déclenchement** : Release Please analyse les commits depuis la dernière release
3. **Création de PR** : Release Please crée automatiquement une PR de release avec :
   - Le bon numéro de version (ex: v1.2.0)
   - Le CHANGELOG.md généré
   - Les notes de release
4. **Merge de la PR** : L'équipe merge la PR de release
5. **Création du tag** : Release Please crée le tag Git (v1.2.0)
6. **Création de la release GitHub** : Release est créée sur GitHub
7. **Publication NPM** : Le package est publié sur NPM (si applicable)

### Avantages

- **Pas de gestion manuelle** : Plus besoin de décider manuellement du numéro de version
- **CHANGELOG automatique** : Le CHANGELOG est généré depuis les commits
- **Traçabilité** : Chaque release est liée aux commits et tickets correspondants
- **Consistance** : Le versioning suit toujours SemVer

### Configuration GEF

GEF génère `.github/workflows/release-please.yml` avec la configuration adaptée au projet :

```yaml
name: Release Please
on:
  push:
    branches:
      - main
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v3
        with:
          release-type: node
          package-name: create-gef
```

## Résumé du chapitre

La traçabilité dans GEF repose sur deux stratégies Git : GitHub Flow (recommandé) et Trunk-Based Development. GitHub Flow impose des Pull Requests obligatoires avec revue de code, tandis que Trunk-Based permet des commits directs sur main avec tests automatisés.

Les hooks Git bloquants imposent mécaniquement les règles : commit-msg valide le format Conventional Commits et la référence Kanban, pre-commit détecte les secrets et vérifie le linting, pre-push bloque les pushes directs sur main (GitHub Flow) ou exécute les tests (Trunk-Based).

Les Pull Requests obligatoires utilisent un template avec checklist physique à cocher. La CI/CD est le dernier rempart : lint, tests, sécurité, build, déploiement. Enfin, Release Please automatise la gestion des versions via Semantic Versioning, générant le CHANGELOG depuis les commits.

Dans le chapitre suivant, nous explorerons comment GEF transforme l'IA en Tech Lead Virtuel capable de piloter ce workflow.
