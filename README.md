# Gildas Engineering Framework (GEF)

> Un framework d'ingénierie logicielle qui transforme des règles de travail en outils automatisés. Il garantit traçabilité, sécurité et qualité sur chaque projet, dès le premier commit.
> 
> **🛡️ Standards de l'Industrie Enforcés :** GitHub Flow (PRs obligatoires), OWASP Security Limits (Rate Limiting, JWT Exp), Clean Code Metrics adaptatifs (Startup / Standard / Mission Critical), et **Garantie Anti-Contournement IA** (Crash Clause, `.cursorrules` complets, CI d'intention).

---

## Sommaire

1. [Philosophie](#1-philosophie)
2. [Structure du dépôt](#2-structure-du-dépôt)
3. [Installation et Utilisation](#3-installation-et-utilisation)
4. [Le Générateur de Projet (Brique A)](#4-le-générateur-de-projet-brique-a)
5. [Les Hooks Git (Brique B)](#5-les-hooks-git-brique-b)
6. [Le Pipeline CI/CD (Brique C)](#6-le-pipeline-cicd-brique-c)
7. [Les Prompts IA (Brique D)](#7-les-prompts-ia-brique-d)
8. [Le Tech Lead Virtuel (Brique E)](#8-le-tech-lead-virtuel-brique-e)
9. [La Garantie Anti-Contournement IA (Brique F)](#9-la-garantie-anti-contournement-ia-brique-f)
10. [La Source de Vérité](#10-la-source-de-vérité)

---

## 1. Philosophie

Le GEF repose sur un principe unique : **les règles d'ingénierie ne doivent pas être relues — elles doivent être imposées mécaniquement.**

- Le [`ENGINEERING_PLAYBOOK.md`](./ENGINEERING_PLAYBOOK.md) est la source de vérité absolue. Il définit les règles universelles (traçabilité Git, documentation, architecture, sécurité, TDD, ADR, Kanban). Il ne contient jamais d'informations propres à un projet.
- Le [`PROJECT_CONFIG.template.md`](./PROJECT_CONFIG.template.md) est le complément spécifique à chaque projet (cloud, base de données, jalons). Il est généré automatiquement par le générateur et doit être complété par le porteur.
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
├── .cursorrules                  ← Brique F : Toutes les règles GEF pour les IDEs IA (Cursor, Windsurf)
├── .windsurfrules                ← Brique F : Alias .cursorrules pour Windsurf
│
├── generator/                    ← Brique A : CLI de génération de projet
│   ├── index.js                  ← Point d'entrée (routage des commandes : help, version, update, interactif)
│   ├── cli/
│   │   ├── questions.js          ← 11 questions Inquirer (stack, DB, cloud, git, lint, sévérité, langue...)
│   │   └── help.js               ← Affichage de l'aide et de la version
│   ├── features/
│   │   ├── scaffold-stack.js     ← Scaffolding du framework cible (Next, Vite, Express, FastAPI)
│   │   ├── scaffold-gef.js       ← Moteur de templates (Playbook, Prompts IA, Diataxis)
│   │   ├── scaffold-git.js       ← Génération dynamique des hooks Git
│   │   ├── scaffold-linter.js    ← Génération des configs Biome, ESLint, Ruff
│   │   ├── scaffold-docker.js    ← Dockerfile, docker-compose, init.sql
│   │   ├── scaffold-ci.js        ← Workflows GitHub Actions (CI/CD, release-please)
│   │   ├── scaffold-ai-rules.js  ← Brique F : Copie .cursorrules dans chaque projet généré
│   │   └── update.js             ← Mise à jour d'un projet existant
│   └── templates/
│       └── adr-template.md       ← Template d'ADR prêt à l'emploi
│
├── hooks/                        ← Brique B : Hooks Git (installés dans le dépôt GEF lui-même)
│   ├── commit-msg                ← Conventional Commits + référence Kanban obligatoire (#XYZ)
│   └── pre-commit                ← Détection secrets, lint, blocage commit sur main/master
│
├── ci-templates/                 ← Brique C : Templates de base CI/CD
│   ├── main.yml                  ← (le générateur produit un CI adapté à la stack)
│   └── pr-intention-check.yml   ← Brique F : Bloque les PRs sans intention métier déclarée
│
├── .github/workflows/
│   └── release-please.yml        ← Automatisation des releases du GEF lui-même
│
└── prompts/                      ← Brique D : Prompts pour assistants IA
    ├── system_prompt.md          ← Prompt de base (avec variables de template {{MAX_LINES}} etc.)
    ├── feature_development.md    ← Pour le développement d'une fonctionnalité
    ├── code_review.md            ← Pour une revue de code
    ├── bugfix.md                 ← Pour une correction de bug
    ├── adr_writing.md            ← Pour la rédaction d'un ADR
    └── new_project_kickoff.md    ← Pour le démarrage d'un nouveau projet
```

---

## 3. Installation et Utilisation

Le GEF est conçu pour être utilisé directement sans avoir besoin de cloner le dépôt, exactement comme `create-next-app` ou `create-vite`.

**Prérequis :** Node.js (v18+), Git, GitHub CLI (`gh`) pour les fonctionnalités Kanban.

### Commandes disponibles

| Commande | Description |
|---|---|
| `npx create-gef` | Lance le générateur interactif et crée un nouveau projet |
| `npx create-gef update` | Met à jour le Playbook, les Prompts et les Hooks dans un projet existant |
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

## 4. Le Générateur de Projet (Brique A)

### Ce que le générateur fait

L'assistant pose **11 questions**, puis exécute automatiquement :

| Étape | Action |
|---|---|
| **1. Scaffolding** | Installe le framework choisi (`npx create-next-app`, `npm create vite`, etc.) |
| **2. Arborescence GEF** | Crée la structure Diatáxis : `docs/tutorials/`, `docs/how-to/`, `docs/reference/`, `docs/explanation/adr/` |
| **3. Template ADR** | Crée `docs/explanation/adr/0000-template.md` prêt à l'emploi |
| **4. Configuration** | Génère `PROJECT_CONFIG.md` pré-rempli avec tous les choix (stack, cloud, DB, git, lint, sévérité, langue) |
| **5. Documentation** | Génère `README.md` et `docs/research/RESEARCH_LOG.md` |
| **6. Linter** | Génère `biome.json`, `.eslintrc.json`, ou `ruff.toml` selon le choix |
| **7. Docker** | Génère `docker/Dockerfile` et `docker/docker-compose.yml`. Si PostgreSQL : crée `database/init.sql` monté dans le container |
| **8. Playbook & Prompts IA** | Copie le Playbook et les Prompts dans `.gef/` **en injectant les Hard Limits adaptées** au niveau de sévérité choisi |
| **9. Hooks Git** | Génère les hooks dynamiques (`pre-push` bloque `main` si GitHub Flow, lance les tests si TBD) |
| **10. CI/CD** | Génère `.github/workflows/main.yml` adapté à la stack et au cloud provider |
| **11. Release Please** | Génère `.github/workflows/release-please.yml` pour automatiser les tags et releases |

### Stacks supportées

| Framework | Scaffolding | Docker | CI |
|---|---|---|---|
| Next.js (React) | `npx create-next-app@latest` | Multi-stage → Node | Setup Node 20 + lint + tests |
| React (Vite) | `npm create vite@latest` | Multi-stage → Nginx | Setup Node 20 + lint + tests |
| API Node.js (Express) | `npm init` + `express` | Node Alpine + DB service | Setup Node 20 + lint + tests |
| API Python (FastAPI) | `venv` + `requirements.txt` | Python 3.12-slim + DB service | Setup Python 3.12 + flake8 + pytest |
| Projet vide | — | Alpine générique | Générique |

### Stratégies Git supportées

| Stratégie | Comportement du hook `pre-push` |
|---|---|
| **GitHub Flow** *(Recommandé)* | Bloque toute tentative de `git push` sur `main`. Force l'usage de branches et Pull Requests. |
| **Trunk-Based Development** | Autorise les pushes sur `main`, mais exécute les tests locaux avant de valider. |

### Niveaux de sévérité (Hard Limits)

Le niveau choisi est injecté dans le Playbook et les Prompts IA générés dans `.gef/`. L'IA d'un projet "Mission Critical" ne générera **jamais** de fonction de plus de 15 lignes.

| Niveau | Fonctions max | Params max | Complexité max | Payload JSON max |
|---|---|---|---|---|
| **Startup / R&D** | 50 lignes | 4 | 15 | 5 Mo |
| **Standard / Enterprise** *(Recommandé)* | 30 lignes | 3 | 10 | 1 Mo |
| **Mission Critical** | 15 lignes | 2 | 5 | 100 Ko |

### Linters supportés

| Linter | Fichier généré | Commandes ajoutées dans `package.json` |
|---|---|---|
| **Biome** | `biome.json` | `npm run lint`, `npm run lint:fix` |
| **ESLint + Prettier** | `.eslintrc.json` + `.prettierrc` | `npm run lint`, `npm run lint:fix` |
| **Ruff** *(Python)* | `ruff.toml` | — |
| **Aucun** | — | — |

### Cloud Providers supportés

| Framework | Scaffolding | Docker | CI |
|---|---|---|---|
| Next.js (React) | `npx create-next-app@latest` | Multi-stage → Node | Setup Node 20 + lint + tests |
| React (Vite) | `npm create vite@latest` | Multi-stage → Nginx | Setup Node 20 + lint + tests |
| API Node.js (Express) | `npm init` + `express` | Node Alpine + DB service | Setup Node 20 + lint + tests |
| API Python (FastAPI) | `venv` + `requirements.txt` | Python 3.12-slim + DB service | Setup Python 3.12 + flake8 + pytest |
| Projet vide | — | Alpine générique | Générique |

### Cloud Providers supportés

| Cloud | Effet |
|---|---|
| **Vercel** | Génère `vercel.json`, supprime la question Docker, déploiement auto dans le CI sur push `main` |
| **AWS** | Job de déploiement AWS dans le CI sur tag `v*.*.*` |
| **GCP / Azure** | Release GitHub automatique sur tag `v*.*.*` |
| **Aucun** | Release GitHub automatique sur tag `v*.*.*` |

### Bases de données supportées

| DB | Effet |
|---|---|
| **PostgreSQL** | Service `db` PostgreSQL dans `docker-compose.yml` |
| **MongoDB** | Service `db` MongoDB dans `docker-compose.yml` |
| **Supabase** | Génère `supabase/config.toml` + `supabase/migrations/` + `supabase/seed.sql` |
| **Aucune** | Aucune configuration DB |

---

## 5. Les Hooks Git (Brique B)

Installés automatiquement par le générateur dans `.git/hooks/` de chaque projet.

| Hook | Règle appliquée |
|---|---|
| **`commit-msg`** | Bloque tout commit dont le message ne respecte pas le format `Conventional Commits + référence Kanban`. Format : `feat: description (#42)`. |
| **`pre-commit`** | Détecte les secrets en clair (clés API, tokens). Vérifie le formatage (linter). Analyse la taille des fichiers selon la sévérité choisie. **Bloque tout commit direct sur `main` ou `master`.** |
| **`pre-push`** | **Dynamique** : Bloque tout push direct sur `main` si le projet est en GitHub Flow. Exécute les tests locaux si en Trunk-Based Development. |

Ces hooks sont générés à la volée par le générateur en fonction des choix de l'équipe, et installablés dans `.git/hooks/` du projet.

Pour mettre à jour les hooks dans un projet existant :

```bash
npx create-gef update
```

---

## 6. Le Pipeline CI/CD (Brique C)

Le générateur crée deux fichiers dans `.github/workflows/` :

**`main.yml` — Contrôle Qualité & Déploiement**
- Adapté à votre stack et cloud. Déclenché sur push `main`, `feat/**`, `fix/**`, tags `v*.*.*`, et pull requests.
- **Jobs :** setup runtime → install → lint → tests → analyse sécurité → déploiement (Vercel/AWS) ou release GitHub.

**`release-please.yml` — Automatisation des Releases**
- À chaque push sur `main`, génère automatiquement une Pull Request de Release avec le bon numéro de version (calculé depuis vos commits `feat:` et `fix:`) et le `CHANGELOG.md`.
- Quand vous mergez cette PR : le tag Git et la Release GitHub sont créés automatiquement.

---

## 7. Les Prompts IA (Brique D)

Des directives à charger dans votre assistant IA selon le contexte de travail. Ils sont copiés dans `.gef/prompts/` de chaque projet généré.

| Fichier | Quand l'utiliser |
|---|---|
| [`system_prompt.md`](./prompts/system_prompt.md) | **Toujours** — à charger en début de chaque session de travail |
| [`feature_development.md`](./prompts/feature_development.md) | Lors du développement d'une nouvelle fonctionnalité |
| [`code_review.md`](./prompts/code_review.md) | Lors d'une revue de code |
| [`bugfix.md`](./prompts/bugfix.md) | Lors de la correction d'un bug |
| [`adr_writing.md`](./prompts/adr_writing.md) | Lors d'une décision architecturale importante |
| [`new_project_kickoff.md`](./prompts/new_project_kickoff.md) | Au tout démarrage d'un nouveau projet |

---

## 8. Le Tech Lead Virtuel (Brique E)

Au-delà de la génération, le GEF transforme l'IA en **Tech Lead autonome** grâce à trois règles inscrites dans le Playbook :

### Pilotage Kanban & Pull Requests (§14)
L'IA crée ses propres tickets (`gh issue create`), lie chaque commit à un ticket (`feat: ... (#42)`), ouvre les Pull Requests (`gh pr create`) et **demande votre validation avant de merger**.

### Auto-Documentation ADR (§15)
Avant tout choix architectural majeur (nouvelle dépendance, nouveau service), l'IA **doit** rédiger un rapport dans `docs/adr/` en utilisant le template fourni. Elle ne peut pas coder sans avoir d'abord documenté sa décision.

### TDD Piloté par l'IA (§16)
Avant d'écrire le code applicatif, l'IA rédige le test E2E (Playwright) qui décrit le comportement attendu. Le code est ensuite écrit pour faire passer ce test au vert.

> **Clause d'Antériorité (§0.5) :** Ces règles s'appliquent au nouveau code. L'IA ne refactorise jamais proactivement l'ancien code pour le rendre conforme, sauf demande explicite.

---

## 9. La Garantie Anti-Contournement IA (Brique F)

Le GEF va au-delà des règles textuelles. Il **impose mécaniquement** aux IA les bonnes pratiques dès l'ouverture du projet, sans que l'utilisateur ait à les répéter.

### Comment ça fonctionne

| Mécanisme | Fichier | Effet |
|---|---|---|
| **Règles natives IDE** | `.cursorrules` / `.windsurfrules` | Toute IA (Cursor, Windsurf, Copilot) lit ces fichiers au démarrage et connaît instantanément les §0 à §10 du Playbook (Clean Code, Architecture, Sécurité OWASP, Git Flow, Tests, Workflows). |
| **Crash Clause** | `prompts/system_prompt.md` | L'IA est instruite de s'arrêter immédiatement et de signaler tout obstacle, au lieu de l'improvisation silencieuse. |
| **Checklist Pull Request** | `.github/PULL_REQUEST_TEMPLATE.md` | L'IA (et l'humain) doit physiquement cocher les validations (Tests, Docs, ADR) avant qu'une PR puisse être mergée. |
| **Blocage Linter (Hard Limits)** | `biome.json` / `.eslintrc.json` / `ruff.toml` | Le linter est configuré avec les limites (ex: 15 lignes max, 2 paramètres) et plantera si l'IA tente de bypasser le framework. |
| **Blocage local** | `hooks/pre-commit` | Un commit direct sur `main` est physiquement impossible, tout comme un commit qui ne passe pas le Linter. |
| **Validation CI (Intention & Tests)** | `ci-templates/pr-intention-check.yml` & `main.yml` | La CI rejette les PRs sans intention métier, et bloque si la couverture de tests < 80%. |
| **Propagation** | `generator/features/scaffold-ai-rules.js` | Chaque projet généré hérite automatiquement du `.cursorrules` complet (source unique de vérité). |

> La puissance réside ici : l'utilisateur n'a jamais à expliquer les règles à l'IA. Elles sont déjà là.

---

## 10. La Source de Vérité

Toutes les règles appliquées par ce framework sont définies dans un seul document :

**[→ Lire l'Engineering Playbook](./ENGINEERING_PLAYBOOK.md)**

En cas de contradiction entre un outil du framework et le Playbook, le Playbook a toujours raison.

---

> Projet open source par [Gildas](https://github.com/Gnzikoune) — Contributions bienvenues via Pull Request.
