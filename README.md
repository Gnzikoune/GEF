# Gildas Engineering Framework (GEF)

> Un framework d'ingénierie logicielle qui transforme des règles de travail en outils automatisés. Il garantit traçabilité, sécurité et qualité sur chaque projet, dès le premier commit.

---

## Sommaire

1. [Philosophie](#1-philosophie)
2. [Structure du dépôt](#2-structure-du-dépôt)
3. [Installation](#3-installation)
4. [Le Générateur de Projet (Brique A)](#4-le-générateur-de-projet-brique-a)
5. [Les Hooks Git (Brique B)](#5-les-hooks-git-brique-b)
6. [Le Pipeline CI/CD (Brique C)](#6-le-pipeline-cicd-brique-c)
7. [Les Prompts IA (Brique D)](#7-les-prompts-ia-brique-d)
8. [La Source de Vérité](#8-la-source-de-vérité)

---

## 1. Philosophie

Le GEF repose sur un principe unique : **les règles d'ingénierie ne doivent pas être relues — elles doivent être imposées mécaniquement.**

- Le [`ENGINEERING_PLAYBOOK.md`](./02.ENGINEERING_PLAYBOOK.md) est la source de vérité absolue. Il définit les règles universelles (traçabilité Git, documentation, architecture, sécurité). Il ne contient jamais d'informations propres à un projet.
- Le [`PROJECT_CONFIG.template.md`](./PROJECT_CONFIG.template.md) est le complément spécifique à chaque projet (cloud, base de données, jalons). Il est généré automatiquement par le générateur et doit être complété par le porteur.
- **Rien dans ce dépôt n'est spécifique à un projet.** Le GEF est universel et agnostique.

---

## 2. Structure du dépôt

```
GEF/
│
├── 02.ENGINEERING_PLAYBOOK.md    ← Source de vérité (règles universelles)
├── PROJECT_CONFIG.template.md    ← Template de configuration projet
├── README.md                     ← Ce fichier
├── package.json                  ← Package NPM global (rend le GEF exécutable via npx)
│
├── generator/                    ← Brique A : CLI de génération de projet
│   └── index.js                  ← Point d'entrée (interface interactive)
│
├── hooks/                        ← Brique B : Hooks Git de sécurité
│   ├── commit-msg                ← Validation Conventional Commits
│   ├── pre-commit                ← Détection secrets, lint
│   └── pre-push                  ← Blocage push direct sur main
│
├── ci-templates/                 ← Brique C : Template de base CI/CD
│   └── main.yml                  ← (le générateur produit un CI adapté à la stack)
│
└── prompts/                      ← Brique D : Prompts pour assistants IA
    ├── system_prompt.md          ← Prompt de base (à charger en début de session)
    ├── feature_development.md    ← Pour le développement d'une fonctionnalité
    ├── code_review.md            ← Pour une revue de code
    ├── bugfix.md                 ← Pour une correction de bug
    ├── adr_writing.md            ← Pour la rédaction d'un ADR
    └── new_project_kickoff.md    ← Pour le démarrage d'un nouveau projet
```

---

## 3. Installation et Utilisation

Le GEF est conçu pour être utilisé directement sans avoir besoin de cloner le dépôt, exactement comme `create-next-app` ou `create-vite`.

**Prérequis :** Node.js (v18+), Git.

Lancez simplement la commande suivante depuis le dossier où vous souhaitez créer vos projets :

```bash
npx create-gef
```

### Développement local du framework

Si vous modifiez le framework GEF lui-même et que vous souhaitez tester la CLI localement :

```bash
# 1. Cloner le dépôt
git clone <url-du-dépôt-gef> GEF
cd GEF

# 2. Installer les dépendances
npm install

# 3. Rendre la commande locale accessible globalement
npm link
```
Après `npm link`, vous pouvez utiliser la commande `create-gef` partout sur votre machine.

---

## 4. Le Générateur de Projet (Brique A)

La commande `npx create-gef` (ou `create-gef` si linké) lance un assistant interactif.


### Ce que le générateur fait

L'assistant pose 7 questions, puis exécute automatiquement :

| Étape | Action |
|---|---|
| **1. Scaffolding** | Installe le framework choisi (`npx create-next-app`, `npm create vite`, etc.) |
| **2. Arborescence GEF** | Crée `docs/adr/`, `docs/research/`, `tests/`, `scripts/`, `infra/`, `database/` |
| **3. Configuration** | Génère `PROJECT_CONFIG.md` pré-rempli avec vos choix (stack, cloud, DB, phase) |
| **4. Documentation** | Génère `README.md` et `docs/research/RESEARCH_LOG.md` |
| **5. Docker** | Génère `docker/Dockerfile` et `docker/docker-compose.yml` adaptés à votre stack *(ignoré si Cloud = Vercel)* |
| **6. Vercel** | Génère `vercel.json` si Vercel est choisi comme Cloud Provider |
| **7. Supabase** | Génère `supabase/config.toml` et `supabase/migrations/` si Supabase est choisi |
| **8. Git & Hooks** | Initialise Git et installe les 3 hooks de sécurité GEF |
| **9. CI/CD** | Génère `.github/workflows/main.yml` adapté à la stack et au cloud provider |

### Stacks supportées

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
| **`commit-msg`** | Bloque tout commit dont le message ne respecte pas le format Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `perf:`, `test:`, `release:`). Avertissement si la description est trop courte. |
| **`pre-commit`** | Détecte les secrets en clair (clés API, tokens). Bloquant. |
| **`pre-push`** | Bloque tout push direct sur la branche `main`. |

Pour mettre à jour les hooks dans un projet existant, copiez les fichiers du dossier `hooks/` dans son `.git/hooks/`.

---

## 6. Le Pipeline CI/CD (Brique C)

Le générateur crée un fichier `.github/workflows/main.yml` **adapté à votre stack et cloud**, il ne copie pas un template générique.

**Déclencheurs :** push sur `main`, `feat/**`, `fix/**`, tout tag `v*.*.*`, et pull requests vers `main`.

**Jobs générés :**
- **`quality-gate`** : setup du runtime (Node ou Python) → install → lint → tests → analyse de sécurité.
- **`deploy` / `release`** : déploiement Vercel/AWS ou création de release GitHub selon le cloud choisi.

---

## 7. Les Prompts IA (Brique D)

Des directives à copier-coller dans votre assistant IA selon le contexte de travail.

| Fichier | Quand l'utiliser |
|---|---|
| [`system_prompt.md`](./prompts/system_prompt.md) | **Toujours** — à charger en début de chaque session de travail |
| [`feature_development.md`](./prompts/feature_development.md) | Lors du développement d'une nouvelle fonctionnalité |
| [`code_review.md`](./prompts/code_review.md) | Lors d'une revue de code |
| [`bugfix.md`](./prompts/bugfix.md) | Lors de la correction d'un bug |
| [`adr_writing.md`](./prompts/adr_writing.md) | Lors d'une décision architecturale importante |
| [`new_project_kickoff.md`](./prompts/new_project_kickoff.md) | Au tout démarrage d'un nouveau projet |

---

## 8. La Source de Vérité

Toutes les règles appliquées par ce framework sont définies dans un seul document :

**[→ Lire l'Engineering Playbook](./02.ENGINEERING_PLAYBOOK.md)**

En cas de contradiction entre un outil du framework et le Playbook, le Playbook a toujours raison.
