# Chapitre 7 : Démonstration Pratique

## 7.1. Création d'un projet Next.js standard

Pour comprendre la valeur ajoutée de GEF, comparons deux approches : la création d'un projet Next.js standard avec `create-next-app`, et la création d'un projet avec `create-gef`.

### Approche standard : create-next-app

```bash
npx create-next-app@latest my-app
```

Cette commande lance un assistant interactif qui pose quelques questions :
- TypeScript ? Yes/No
- ESLint ? Yes/No
- Tailwind CSS ? Yes/No
- `src/` directory ? Yes/No
- App Router ? Yes/No
- Import alias ? @/*

Une fois les réponses fournies, `create-next-app` :
1. Installe les dépendances
2. Crée la structure de base
3. Initialise Git
4. Génère un README basique

**Résultat :** Un projet Next.js fonctionnel, mais sans gouvernance d'ingénierie.

### Structure du projet standard

```
my-app/
├── .git/
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
└── public/
```

**Ce qui manque :**
- Pas de hooks Git pour valider les commits
- Pas de workflow CI/CD
- Pas de règles de Clean Code quantifiées
- Pas de documentation structurée (Diátaxis)
- Pas de template ADR
- Pas de prompts IA
- Pas de configuration de sécurité OWASP
- Pas de règles Git (Conventional Commits, GitHub Flow)

Le développeur doit configurer tout cela manuellement, ce qui prend des heures, voire des jours, et est souvent oublié ou incomplètement fait.

## 7.2. Création d'un projet avec create-gef

Maintenant, créons le même projet avec GEF.

```bash
npx create-gef
```

Cette commande lance un assistant interactif plus complet qui pose 11 questions :

1. **Nom du projet** : `my-app`
2. **Framework** : Next.js (React)
3. **Base de données** : PostgreSQL
4. **Cloud provider** : Vercel
5. **Stratégie Git** : GitHub Flow
6. **Linter** : Biome
7. **Niveau de sévérité** : Standard / Enterprise
8. **Langue de documentation** : Français
9. **Activation des tests automatisés** : Yes
10. **Activation de Docker** : Yes
11. **Activation de Supabase** : No

Une fois les réponses fournies, GEF exécute automatiquement 11 actions :

1. **Scaffolding Next.js** : Exécute `npx create-next-app@latest` avec les flags appropriés
2. **Arborescence Diátaxis** : Crée `docs/tutorials/`, `docs/how-to/`, `docs/reference/`, `docs/explanation/adr/`
3. **Template ADR** : Crée `docs/explanation/adr/0000-template.md`
4. **Configuration** : Génère `PROJECT_CONFIG.md` avec tous les choix
5. **Documentation** : Génère `README.md` et `docs/research/RESEARCH_LOG.md`
6. **Linter** : Génère `biome.json` avec les limites (30 lignes, 3 params, 10 complexité)
7. **Docker** : Génère `docker/Dockerfile` et `docker/docker-compose.yml` avec service PostgreSQL
8. **Playbook & Prompts** : Copie le Playbook et les Prompts dans `.gef/` avec les Hard Limits injectés
9. **Hooks Git** : Génère `commit-msg`, `pre-commit`, `pre-push` configurés pour GitHub Flow
10. **CI/CD** : Génère `.github/workflows/main.yml` adapté à Next.js + Vercel
11. **Release Please** : Génère `.github/workflows/release-please.yml`

**Temps total :** Environ 2-3 minutes (vs plusieurs heures de configuration manuelle)

## 7.3. Comparaison côte à côte

Comparons les structures des deux projets :

### Projet standard (create-next-app)

```
my-app/
├── .git/
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
└── public/
```

### Projet GEF (create-gef)

```
my-app/
├── .git/
│   └── hooks/                    ← Hooks Git installés
│       ├── commit-msg
│       ├── pre-commit
│       └── pre-push
├── .gitignore
├── .cursorrules                  ← Règles IA natives
├── .windsurfrules                ← Règles IA natives
├── README.md                     ← README enrichi
├── PROJECT_CONFIG.md             ← Configuration projet
├── next.config.js
├── package.json
├── biome.json                    ← Linter configuré
├── tsconfig.json
├── .github/
│   └── workflows/
│       ├── main.yml              ← CI/CD
│       ├── release-please.yml    ← Automatisation releases
│       └── PULL_REQUEST_TEMPLATE.md ← Template PR
├── .gef/                         ← Dossier GEF
│   ├── ENGINEERING_PLAYBOOK.md   ← Playbook avec Hard Limits
│   └── prompts/
│       ├── system_prompt.md
│       ├── feature_development.md
│       ├── code_review.md
│       ├── bugfix.md
│       ├── adr_writing.md
│       └── new_project_kickoff.md
├── docs/                         ← Documentation Diátaxis
│   ├── tutorials/
│   ├── how-to/
│   ├── reference/
│   ├── explanation/
│   │   └── adr/
│   │       └── 0000-template.md
│   └── research/
│       └── RESEARCH_LOG.md
├── docker/                       ← Docker
│   ├── Dockerfile
│   └── docker-compose.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
└── public/
```

### Différences clés

| Aspect | Standard | GEF |
|---|---|---|
| **Temps de setup** | 5 minutes (base) | 2-3 minutes (complet) |
| **Hooks Git** | Aucun | commit-msg, pre-commit, pre-push |
| **CI/CD** | Aucun | main.yml, release-please.yml |
| **Linter** | ESLint (basique) | Biome (configuré avec Hard Limits) |
| **Documentation** | README basique | Diátaxis complète + ADR template |
| **Prompts IA** | Aucun | 6 prompts spécialisés |
| **Règles IA natives** | Aucun | .cursorrules, .windsurfrules |
| **Docker** | Aucun | Dockerfile + docker-compose.yml |
| **Configuration projet** | Aucun | PROJECT_CONFIG.md |
| **Playbook** | Aucun | ENGINEERING_PLAYBOOK.md |
| **Template PR** | Aucun | Checklist obligatoire |

## 7.4. Ce qui change au quotidien

La différence la plus importante n'est pas dans la structure initiale, mais dans ce qui change au quotidien pendant le développement.

### Scénario 1 : Commiter du code

**Projet standard :**
```bash
git add .
git commit -m "ajout auth"
# Commit accepté
```

**Projet GEF :**
```bash
git add .
git commit -m "ajout auth"
# ❌ Erreur : Le message ne respecte pas le format Conventional Commits
# ❌ Erreur : La référence Kanban (#XYZ) est manquante

git commit -m "feat(auth): ajout de l'authentification (#42)"
# ✅ Accepté (après vérification du linter et détection de secrets)
```

### Scénario 2 : Pousser sur main

**Projet standard :**
```bash
git push origin main
# Push accepté
```

**Projet GEF (GitHub Flow) :**
```bash
git push origin main
# ❌ Erreur : Push direct sur main interdit
# ℹ️ Créez une branche et ouvrez une Pull Request

git checkout -b feat/auth
git push origin feat/auth
gh pr create
# ✅ PR créée avec template
```

### Scénario 3 : Écrire une fonction longue

**Projet standard :**
```typescript
// src/app/auth/login.ts
function processAuthentication(user: User, credentials: Credentials, config: Config, metadata: Metadata) {
  // 50 lignes de code...
  // Accepté par le linter ESLint basique
}
```

**Projet GEF :**
```typescript
// src/app/auth/login.ts
function processAuthentication(user: User, credentials: Credentials, config: Config, metadata: Metadata) {
  // 31 lignes de code...
}
```

```bash
npm run lint
# ❌ Erreur : La fonction dépasse 30 lignes (limite Standard)
# ❌ Erreur : La fonction a 4 paramètres (limite : 3)
# ℹ️ Refactorisez en créant un objet de configuration
```

### Scénario 4 : Décision architecturale

**Projet standard :**
Le développeur choisit d'utiliser Redux pour la gestion d'état. Il l'implémente directement. Aucune documentation. Six mois plus tard, un nouveau développeur se demande pourquoi Redux a été choisi.

**Projet GEF :**
Le développeur (ou l'IA) doit d'abord créer un ADR :

```bash
# docs/explanation/adr/0001-state-management.md
# ADR-0001 : Choix de la gestion d'état

## Contexte
L'application nécessite une gestion d'état globale pour partager les données d'authentification entre les composants.

## Décision
Utiliser Zustand pour la gestion d'état.

## Conséquences
- Positifs : API plus simple que Redux, moins de boilerplate
- Négatifs : Écosystème plus petit que Redux

## Alternatives
- Redux : Plus mature, mais plus verbeux
- Context API : Natif, mais pas optimisé pour les updates fréquents
```

Une fois l'ADR validée, l'implémentation peut commencer. Six mois plus tard, tout le monde comprend pourquoi Zustand a été choisi.

## 7.5. Interaction avec Cursor/Windsurf/Copilot

La différence la plus significative de GEF est dans l'interaction avec les assistants IA (Cursor, Windsurf, GitHub Copilot).

### Sans GEF

Un développeur ouvre Cursor et demande : "Crée une fonction d'authentification".

Cursor génère du code basé sur son entraînement général :
- Peut utiliser des conventions différentes de celles du projet
- Peut créer des fonctions de 50 lignes
- Peut ne pas inclure de validation de sécurité
- Peut ne pas respecter l'architecture Feature-Sliced Design

Le développeur doit ensuite :
- Relire le code pour vérifier les conventions
- Corriger manuellement les violations
- Ajouter la validation manquante
- Refactoriser pour respecter l'architecture

### Avec GEF

Le même développeur ouvre Cursor sur un projet GEF. Au démarrage, Cursor lit automatiquement le fichier `.cursorrules` qui contient toutes les règles du projet.

Le développeur demande : "Crée une fonction d'authentification".

Cursor génère du code en connaissant :
- Les limites de taille (30 lignes max)
- Les limites de paramètres (3 max)
- Les conventions de nommage (camelCase)
- L'architecture Feature-Sliced Design
- Les règles de sécurité OWASP
- Les conventions Git (Conventional Commits)

Le résultat :
- Code conforme aux règles du projet
- Fonction de 25 lignes (pas 50)
- Validation incluse
- Architecture respectée
- Moins de corrections manuelles nécessaires

### Exemple concret

**Demande :** "Crée une fonction pour valider un email"

**Sans GEF (réponse typique de Cursor) :**
```typescript
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```

Cette fonction est correcte mais ne respecte pas les conventions du projet si celui-ci utilise Zod pour la validation.

**Avec GEF (réponse de Cursor après lecture de .cursorrules) :**
```typescript
import { z } from 'zod';

const EmailSchema = z.string().email();

function validateEmail(email: unknown): boolean {
  const result = EmailSchema.safeParse(email);
  return result.success;
}
```

Cette fonction :
- Utilise Zod (convention du projet documentée dans .cursorrules)
- Accepte `unknown` (typage strict)
- Utilise `safeParse` (gestion d'erreur)
- Respecte les conventions du projet

### Workflow avec l'IA

Le workflow typique avec GEF et un assistant IA :

1. **Charger le prompt contextuel** : Le développeur charge `feature_development.md` dans l'IA
2. **Spécifier la tâche** : "Je veux ajouter une fonctionnalité de réinitialisation de mot de passe"
3. **L'IA crée une issue** : L'IA utilise `gh issue create` pour créer le ticket
4. **L'IA rédige un ADR** : Si nécessaire, l'IA crée un ADR pour documenter la décision
5. **L'IA écrit le test E2E** : L'IA écrit d'abord le test Playwright
6. **L'IA implémente le code** : L'IA écrit le code pour faire passer le test
7. **L'IA commite** : L'IA commite avec le format Conventional Commits + référence Kanban
8. **L'IA crée une PR** : L'IA utilise `gh pr create` avec le template
9. **Le développeur révise** : Le développeur révise le code et merge

Tout ce workflow est guidé par les règles de GEF, implantées dans `.cursorrules` et les prompts.

## Résumé du chapitre

La démonstration pratique compare la création d'un projet Next.js standard avec `create-next-app` et la création avec `create-gef`. Le projet standard nécessite des heures de configuration manuelle pour ajouter hooks Git, CI/CD, linter configuré, documentation, etc. GEF génère tout cela automatiquement en 2-3 minutes.

La structure du projet GEF inclut : hooks Git (commit-msg, pre-commit, pre-push), CI/CD (main.yml, release-please.yml), linter configuré avec Hard Limits, documentation Diátaxis complète, prompts IA spécialisés, règles IA natives (.cursorrules, .windsurfrules), Docker, et template de PR.

Au quotidien, GEF change le développement : les commits doivent respecter Conventional Commits et inclure une référence Kanban, les pushes directs sur main sont bloqués, le linter refuse les fonctions qui dépassent les limites, et les décisions architecturales doivent être documentées via ADR.

L'interaction avec les assistants IA (Cursor, Windsurf, Copilot) est transformée : l'IA lit automatiquement `.cursorrules` au démarrage et connaît instantanément toutes les règles du projet, générant du code conforme aux conventions sans que le développeur ait à les répéter.

Dans le chapitre suivant, nous explorerons des études de cas réelles d'implémentation de GEF.
