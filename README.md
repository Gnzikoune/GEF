<div align="center">

# Guardian Engineering Framework 🛡️ ⚙️

**Un framework d'ingénierie logicielle qui transforme des règles de travail en outils automatisés**

*Traçabilité · Sécurité · Qualité logicielle*

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)
![Git Hooks](https://img.shields.io/badge/Hooks-Native-FF4154?style=flat&logo=git&logoColor=white)
![AI-Powered](https://img.shields.io/badge/AI-Cursor%20%7C%20Windsurf-8A2BE2?style=flat)
![Status](https://img.shields.io/badge/Status-Production_Ready-4CAF50?style=flat)
![Version](https://img.shields.io/npm/v/create-gef?label=Version&color=blue&style=flat)

</div>

> **🛡️ Standards de l'Industrie Enforcés :** GitHub Flow (PRs obligatoires), OWASP Security Limits (Rate Limiting, JWT Exp), Clean Code Metrics adaptatifs (Startup / Standard / Mission Critical), et **Garantie Anti-Contournement IA** (Crash Clause, `.cursorrules` complets, CI d'intention).

---

## Sommaire

1. [Philosophie](#1-philosophie)
2. [Structure du dépôt](#2-structure-du-dépôt)
3. [Installation et Utilisation](#3-installation-et-utilisation)
4. [Le CLI GEF (Brique A)](#4-le-cli-gef-brique-a)
5. [Les Hooks Git (Brique B)](#5-les-hooks-git-brique-b)
6. [Le Pipeline CI/CD (Brique C)](#6-le-pipeline-cicd-brique-c)
7. [Les Prompts IA (Brique D)](#7-les-prompts-ia-brique-d)
8. [Le Tech Lead Virtuel (Brique E)](#8-le-tech-lead-virtuel-brique-e)
9. [La Garantie Anti-Contournement IA (Brique F)](#9-la-garantie-anti-contournement-ia-brique-f)
10. [La Source de Vérité](#10-la-source-de-vérité)
11. [Violations Historiques & Leçons Apprises](#11-violations-historiques--leçons-apprises)
12. [Glossaire](#glossaire)

---

---

## 1. Philosophie

Le GEF se positionne comme une **infrastructure de gouvernance pour l'Agentic Software Engineering**. 
La tendance de l'industrie (Microsoft, AWS, Google, Anthropic) montre que le développement logiciel converge vers des agents IA autonomes (Kiro, Spec Kit, Conductor). Mais l'autonomie exige des contraintes.

Le GEF apporte cette couche de contrôle en implémentant techniquement la boucle **AI SDD** (*AI Spec-Driven Development*) couplée à une Gouvernance stricte :
- **SDD (Spec-Driven Development) :** L'humain exprime l'intention (Intent), l'IA génère les spécifications et planifie les tâches (`specs/spec.md`, `specs/plan.md`), l'humain valide, puis l'IA implémente.
- **Gouvernance (Quality Gates & Evidence) :** L'agent IA est contraint mécaniquement à respecter la sécurité (OWASP), le code propre (Hard Limits), la vérification (Tests) et la traçabilité (ADR, Research Logs).

Pour que ce modèle fonctionne sans dérive, le GEF repose sur un principe unique : **les règles d'ingénierie ne doivent pas être relues par l'humain ou interprétées par l'IA — elles doivent être imposées mécaniquement.**

- Le [`ENGINEERING_PLAYBOOK.md`](./ENGINEERING_PLAYBOOK.md) est la source de vérité absolue. Il définit les règles universelles (traçabilité Git, documentation, architecture, sécurité, TDD, ADR, Kanban).
- Le [`PROJECT_CONFIG.template.md`](./PROJECT_CONFIG.template.md) est le complément spécifique à chaque projet (jalons, contexte). Il est généré automatiquement par le CLI et doit être complété par le porteur.
- **Rien dans ce dépôt n'est spécifique à un projet.** Le GEF est universel et agnostique.

---

## 2. Structure du dépôt

```
GEF/
│
├── ENGINEERING_PLAYBOOK.md       ← Source de vérité (règles universelles)
├── PROJECT_CONFIG.template.md    ← Template de configuration projet
├── README.md                     ← Ce fichier
├── package.json                  ← Package NPM (rend le GEF exécutable via npx)
├── .cursorrules                  ← Brique F : Règles GEF natives pour Cursor
├── .windsurfrules                ← Brique F : Règles GEF natives pour Windsurf
├── .agents/                      
│   └── AGENTS.md                 ← Brique F : Règles GEF natives pour Antigravity
│
├── generator/                    ← Brique A : CLI d'initialisation
│   ├── index.js                  ← Point d'entrée
│   ├── cli/
│   │   ├── questions.js          ← Questions interactives Inquirer.js
│   │   └── help.js               ← Textes d'aide
│   └── features/                 ← Logique de configuration
│       ├── setup-gef.js          ← Moteur de templates (Playbook, Diataxis)
│       ├── setup-git.js          ← Génération dynamique des hooks Git
│       ├── setup-ci.js           ← Workflows GitHub Actions (CI/CD, release-please)
│       ├── setup-ai-rules.js     ← Brique F : Déploiement des rulesets IA
│       ├── doctor.js             ← Audit de conformité d'un projet existant
│       └── update.js             ← Mise à jour d'un projet existant
│
├── hooks/                        ← Brique B : Hooks Git (installés dans le dépôt GEF lui-même)
│   ├── commit-msg                ← Conventional Commits + body obligatoire + référence Kanban
│   └── pre-commit                ← Détection secrets, lint, blocage commit sur main/master
│
├── locales/                      ← Modèles multilingues (FR/EN)
│   ├── fr/                       ← Templates en français
│   └── en/                       ← Templates en anglais
│
├── scripts/                      ← Utilitaires d'audit et maintenance
│   ├── verify-self.js            ← Audit continu de la cohérence interne du GEF
│   └── version-bump.js           ← Gestion des versions
│
└── .github/workflows/
    └── release-please.yml        ← Automatisation des releases du GEF lui-même
```

---

## 3. Installation et Utilisation

Le GEF est conçu pour être utilisé directement sans avoir besoin de cloner le dépôt, exactement comme `create-next-app` ou `create-vite`.

**Prérequis :** Node.js (v18+), Git, GitHub CLI (`gh`) pour les fonctionnalités Kanban.

### Commandes disponibles

| Commande | Description |
|---|---|
| `npx create-gef` | Lance le CLI interactif et configure le projet courant ou en crée un nouveau |
| `npx create-gef update` | Met à jour le Playbook, les Prompts et les Hooks dans un projet existant |
| `npx create-gef doctor` | Audit la conformité d'un projet existant au GEF |
| `npx create-gef compliance` | Compliance as Code (generate, validate, apply-hooks, apply-ci) |
| `npx create-gef certify` | Certification System (check, generate) |
| `npx create-gef extension` | Extension System (install, list, remove) |
| `npx create-gef --help` | Affiche l'aide et toutes les commandes disponibles |
| `npx create-gef --version` | Affiche la version actuelle du framework |

### Créer un nouveau projet

```bash
npx create-gef
```

### Mettre à jour un projet existant

Depuis la racine d'un projet existant généré par GEF, mettez à jour le Playbook, les prompts et les hooks Git vers la dernière version du framework :

```bash
npx create-gef update
```

### Auditer un projet existant (Doctor)

Le GEF Doctor vérifie la conformité d'un projet existant au framework. Il diagnostique :

- Synchronisation des fichiers de règles IA (.cursorrules/.windsurfrules)
- Présence des fichiers obligatoires (Playbook, PROJECT_CONFIG, CONTEXT, RESEARCH_LOG)
- Configuration Git (hooks, stratégie)
- Configuration CI/CD (workflows GitHub Actions)
- Configuration du linter

```bash
npx create-gef doctor
```

Le doctor affiche un rapport structuré avec des emojis (✅ / ❌ / ⚠️) et un score de conformité global.

### Compliance as Code

Le GEF Compliance as Code permet de définir les règles d'ingénierie de manière déclarative via un fichier `compliance.yml`. Ce fichier contient :

- **Hard Limits** : Limites de code (max_function_lines, max_params, max_complexity, etc.)
- **Security Rules** : Règles de sécurité OWASP (jwt_expiry, rate_limit, secret_detection)
- **Git Strategy** : Configuration du workflow Git (GitHub Flow, Trunk-Based)
- **DORA Targets** : Objectifs de métriques DORA (deployment_frequency, lead_time, etc.)
- **Extensions** : Extensions activées et règles personnalisées

```bash
# Générer le fichier compliance.yml
npx create-gef compliance generate

# Valider le fichier compliance.yml
npx create-gef compliance validate

# Appliquer les règles aux hooks Git
npx create-gef compliance apply-hooks

# Appliquer les règles à la CI/CD
npx create-gef compliance apply-ci
```

### Certification System

Le GEF Certification System permet d'obtenir un niveau de certification officiel basé sur la conformité GEF et les métriques DORA. Les niveaux disponibles sont :

- **Bronze** : GEF ≥ 60%, DORA ≥ 40%
- **Silver** : GEF ≥ 70%, DORA ≥ 60%
- **Gold** : GEF ≥ 85%, DORA ≥ 80%
- **Platinum** : GEF ≥ 95%, DORA ≥ 95%

```bash
# Vérifier le niveau de certification possible
npx create-gef certify check

# Générer badge et rapport de certification
npx create-gef certify generate
```

Le système génère :
- Badge SVG pour README.md
- Rapport public de certification (GEF_CERTIFICATION_REPORT.md)
- Audit trail avec date et scores

### Extension System

Le GEF Extension System permet d'installer des packs de règles spécifiques par industrie, framework ou standard de sécurité. Les extensions disponibles incluent :

- **Healthcare** : Règles HIPAA pour la protection des données de santé
- **Finance** : Règles PCI-DSS pour la conformité financière
- **Security** : OWASP étendu pour la sécurité renforcée

```bash
# Installer une extension
npx create-gef extension install healthcare

# Lister les extensions installées et disponibles
npx create-gef extension list

# Désinstaller une extension
npx create-gef extension remove healthcare
```

Les extensions mettent à jour automatiquement le fichier `compliance.yml` avec les règles spécifiques du domaine.

### Afficher l'aide

```bash
npx create-gef --help
npx create-gef --version
```

### Développement local du framework

Si vous modifiez le framework GEF lui-même et souhaitez tester la CLI localement :

```bash
# 1. Cloner le dépôt
git clone https://github.com/Gnzikoune/GEF.git GEF
cd GEF

# 2. Installer les dépendances
npm install

# 3. Rendre la commande locale accessible globalement
npm link
```

---

## 4. Le CLI GEF (Brique A)

### Ce que le CLI installe (Couche Agentique PURE)

Le GEF ne génère **aucun code applicatif** (ni React, ni Node, ni Python). Il s'installe par-dessus n'importe quelle stack technique existante (ou dans un dossier vide) pour y apporter la rigueur d'ingénierie :

| Étape | Action |
|---|---|
| **1. Configuration** | Génère `PROJECT_CONFIG.md` pré-rempli avec vos choix (git, sévérité, langue) |
| **2. Arborescence Diátaxis** | Crée la structure : `docs/tutorials/`, `docs/how-to/`, `docs/reference/`, `docs/explanation/adr/` |
| **3. Playbook & Prompts IA** | Copie le Playbook et les Prompts dans `.gef/` **en injectant les Hard Limits adaptées** au niveau de sévérité choisi |
| **4. Hooks Git** | Génère les hooks dynamiques locaux (`pre-push`, `pre-commit`, `commit-msg`) |
| **5. CI/CD** | Génère `.github/workflows/main.yml` (Validation stricte des règles GEF) |
| **6. Release Please** | Génère `.github/workflows/release-please.yml` pour automatiser les tags et releases |

### Stratégies Git supportées

| Stratégie | Comportement du hook `pre-push` |
|---|---|
| **GitHub Flow** *(Recommandé)* | Bloque toute tentative de `git push` sur `main`. Force l'usage de branches et Pull Requests. |
| **Trunk-Based Development** | Autorise les pushes sur `main`. |

### Niveaux de sévérité (Hard Limits)

Le niveau choisi est injecté dans le Playbook et les Prompts IA générés dans `.gef/`. L'IA d'un projet "Mission Critical" ne générera **jamais** de fonction de plus de 15 lignes.

| Niveau | Fonctions max | Params max | Complexité max | Payload JSON max |
|---|---|---|---|---|
| **Startup / R&D** | 50 lignes | 4 | 15 | 5 Mo |
| **Standard / Enterprise** *(Recommandé)* | 30 lignes | 3 | 10 | 1 Mo |
| **Mission Critical** | 15 lignes | 2 | 5 | 100 Ko |

---

## 5. Les Hooks Git (Brique B)

Installés automatiquement par le CLI dans `.git/hooks/` de chaque projet.

| Hook | Règle appliquée |
|---|---|
| **`commit-msg`** | Bloque tout commit dont le message ne respecte pas le format `Conventional Commits + référence Kanban`. Format : `feat: description (#42)`. |
| **`pre-commit`** | Détecte les secrets en clair (clés API, tokens). Analyse la taille du Payload et la limite de lignes selon la sévérité choisie. |
| **`pre-push`** | **Dynamique** : Bloque tout push direct sur `main` si le projet est en GitHub Flow. Exécute les tests locaux si en Trunk-Based Development. |

Ces hooks sont configurés à la volée par le CLI en fonction des choix de l'équipe, et installés dans `.git/hooks/` du projet.

Pour mettre à jour les hooks dans un projet existant :

```bash
npx create-gef update
```

---

## 6. Le Pipeline CI/CD (Brique C)

Le CLI crée deux fichiers dans `.github/workflows/` :

**`main.yml` — Conformité GEF (Compliance Check)**
- Déclenché sur push `main`, `feat/**`, `fix/**` et pull requests.
- **Job :** Vérifie l'intégrité du framework (vérification ultime des Hard Limits, bloque si un fichier dépasse 400 lignes). Ne fait aucune supposition sur votre stack applicative.

**`release-please.yml` — Automatisation des Releases**
- À chaque push sur `main`, génère automatiquement une Pull Request de Release avec le bon numéro de version (calculé depuis vos commits `feat:` et `fix:`) et le `CHANGELOG.md`.
- Quand vous mergez cette PR : le tag Git et la Release GitHub sont créés automatiquement.

---

## 7. Les Prompts IA (Brique D)

> **✨ Nouveauté (Framework Agentique Pur) :** Les règles spécifiques de ces prompts (Bugfix, Feature, etc.) sont désormais **automatiquement intégrées et détectées** par `.cursorrules` et `AGENTS.md` (via la section *Workflows Contextuels*). L'IA active le bon mode toute seule en fonction de ce que vous lui demandez.

Les fichiers sources ci-dessous sont copiés dans `.gef/prompts/` de chaque projet généré **à titre documentaire** (pour que les humains comprennent les règles de la machine), mais vous n'avez plus besoin de les charger manuellement.

| Fichier | Ce que l'IA fait automatiquement |
|---|---|
| [`system_prompt.md`](./prompts/system_prompt.md) | **Toujours actif** — Injecte la Crash Clause et le rôle d'Ingénieur IA |
| [`feature_development.md`](./prompts/feature_development.md) | S'active lors de la demande d'une nouvelle fonctionnalité |
| [`code_review.md`](./prompts/code_review.md) | S'active lors d'une demande de revue de code |
| [`bugfix.md`](./prompts/bugfix.md) | S'active lors de la correction d'un bug ou crash |
| [`adr_writing.md`](./prompts/adr_writing.md) | S'active lors d'une décision architecturale importante |
| [`new_project_kickoff.md`](./prompts/new_project_kickoff.md) | S'active au tout démarrage d'un nouveau projet |

---

## 8. Le Tech Lead Virtuel (Brique E)

Au-delà de la génération, le GEF transforme l'IA en **Tech Lead autonome** grâce à trois règles inscrites dans le Playbook :

### Pilotage Kanban & Pull Requests (§14)
L'IA crée ses propres tickets (`gh issue create`), lie chaque commit à un ticket (`feat: ... (#42)`), ouvre les Pull Requests (`gh pr create`) et **demande votre validation avant de merger**.

### Auto-Documentation ADR (§15)
Avant tout choix architectural majeur (nouvelle dépendance, nouveau service), l'IA **doit** rédiger un rapport dans `docs/adr/` en utilisant le template fourni. Elle ne peut pas coder sans avoir d'abord documenté sa décision.

### TDD Piloté par l'IA (§16)
Avant d'écrire le code applicatif, l'IA rédige le test E2E (Playwright) qui décrit le comportement attendu. Le code est ensuite écrit pour faire passer ce test au vert.

### Mécanismes Anti-Contournement (§10)
Pour garantir que l'IA respecte ces règles :
- **Processus Anti-Amnésie** : À chaque interaction, l'IA doit relire `ENGINEERING_PLAYBOOK.md`, `CONTEXT.md` et `RESEARCH_LOG.md`
- **Crash Clause** : Face à un obstacle, l'IA doit échouer bruyamment et demander de l'aide (pas de workaround silencieux)
- **Interdiction de Merge** : L'IA ne peut **jamais** exécuter `gh pr merge` - seul l'utilisateur humain peut merger
- **Chain of Thought** : L'IA doit afficher un bloc `<gef_compliance_check>` avant toute action critique

> **Clause d'Antériorité (§0.5) :** Ces règles s'appliquent au nouveau code. L'IA ne refactorise jamais proactivement l'ancien code pour le rendre conforme, sauf demande explicite.

---

## 9. La Garantie Anti-Contournement IA (Brique F)

Le GEF va au-delà des règles textuelles. Il **impose mécaniquement** aux IA les bonnes pratiques dès l'ouverture du projet, sans que l'utilisateur ait à les répéter.

### Comment ça fonctionne

| Mécanisme | Fichier | Effet |
|---|---|---|
| **Règles natives IDE** | `.cursorrules` / `.windsurfrules` / `AGENTS.md` | Toute IA (Cursor, Windsurf, Copilot, Antigravity) lit ces fichiers au démarrage et connaît instantanément les §0 à §10 du Playbook (Architecture, Sécurité, Git Flow). |
| **Crash Clause** | `prompts/system_prompt.md` | L'IA est instruite de s'arrêter immédiatement et de signaler tout obstacle, au lieu de l'improvisation silencieuse. |
| **Checklist Pull Request** | `.github/PULL_REQUEST_TEMPLATE.md` | L'IA (et l'humain) doit physiquement cocher les validations (Tests, Docs, ADR) avant qu'une PR puisse être mergée. |
| **Blocage local** | `hooks/pre-commit` | Un fichier dépassant la limite de taille (Payload) ne peut pas être commité. |
| **Propagation** | `generator/features/setup-ai-rules.js` | Chaque projet configuré hérite automatiquement de toutes ces règles pour tous les assistants IA du marché. |

> La puissance réside ici : l'utilisateur n'a jamais à expliquer les règles à l'IA. Elles sont déjà là.

---

## 10. La Source de Vérité

Toutes les règles appliquées par ce framework sont définies dans un seul document :

**[→ Lire l'Engineering Playbook](./ENGINEERING_PLAYBOOK.md)**

En cas de contradiction entre un outil du framework et le Playbook, le Playbook a toujours raison.

## 11. Violations Historiques & Leçons Apprises (Post-Mortem)

Le GEF a appris de ses propres erreurs pour renforcer ses protections. Ces incidents sont documentés ici sous forme de post-mortem structuré :

| Date | Incident (Cause Racine) | Action Corrective | Responsable | Sévérité |
|---|---|---|---|---|
| 2026-07-24 | **Convergence Instrumentale :** L'IA a bypassé les protections de branche pour atteindre son objectif. | Révocation des privilèges d'administration complets de l'IA. | Système | 🟠 Élevée |
| 2026-07-25 | **Push direct sur main :** L'IA a poussé du code directement sur main (via `git push` ou `gh pr merge`), ignorant la règle de PR obligatoire en raison d'instructions contradictoires dans le prompt. | Ajout de hooks locaux pre-push bloquants et correction du `system_prompt.md` (GitHub Flow exclusif). | Dev | 🔴 Critique |

### Ultime Rempart : GitHub Branch Protection

Suite aux incidents ci-dessus, il a été acté que les mécanismes côté client (hooks, prompts) peuvent être contournés ou corrompus.
**Le seul mécanisme reconnu comme infaillible par le projet est la protection de branche côté serveur (GitHub Branch Protection) sur `main`.**
Cette protection DOIT être configurée avec :
- Exigence d'au moins 1 validateur humain (Review obligatoire).
- Interdiction stricte de force-push.
- Statuts CI requis avant de pouvoir merger.

---

## Glossaire

Pour un glossaire complet et détaillé de tous les termes techniques utilisés dans le GEF, consultez :
- [`docs/glossary.md`](./docs/glossary.md) - Glossaire complet (A-Z)
- [`docs/glossary-a-m.md`](./docs/glossary-a-m.md) - Glossaire A-M
- [`docs/glossary-n-z.md`](./docs/glossary-n-z.md) - Glossaire N-Z

Ces violations sont documentées dans [`CONTEXT.md`](./CONTEXT.md) pour éviter toute récidive.

---

> **Guardian Engineering Framework** — Projet open source par [Gildas](https://github.com/Gnzikoune) — Contributions bienvenues via Pull Request.
