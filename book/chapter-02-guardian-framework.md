# Chapitre 2 : Le Guardian Engineering Framework

## 2.1. Architecture du GEF : les 6 briques

Le Guardian Engineering Framework (GEF) est un système composé de six briques interconnectées qui travaillent ensemble pour imposer mécaniquement les règles d'ingénierie.

Chaque brique résout une partie spécifique du problème de la gouvernance dans le développement assisté par IA. Ensemble, elles forment un système cohérent où les règles ne sont pas seulement documentées — elles sont appliquées à chaque étape du cycle de développement.

Voici les six briques :

- **Brique A : Le générateur de projet** — Crée un projet avec toutes les règles pré-configurées
- **Brique B : Les hooks Git** — Bloquent les commits qui violent les règles
- **Brique C : Le pipeline CI/CD** — Valide automatiquement la qualité avant le merge
- **Brique D : Les prompts IA** — Guident les assistants IA selon le contexte
- **Brique E : Le Tech Lead Virtuel** — Transforme l'IA en orchestrateur autonome
- **Brique F : La garantie anti-contournement** — Implantation native dans les IDEs IA

Dans ce chapitre, nous explorerons chaque brique en détail.

## 2.2. Brique A : Le générateur de projet

Le générateur de projet est le point d'entrée de GEF. Il s'exécute via une simple commande :

```bash
npx create-gef
```

Cette commande lance un assistant interactif qui pose 11 questions :

1. Nom du projet
2. Framework (Next.js, React/Vite, Express, FastAPI, vide)
3. Base de données (PostgreSQL, MongoDB, Supabase, aucune)
4. Cloud provider (Vercel, AWS, GCP, Azure, aucun)
5. Stratégie Git (GitHub Flow, Trunk-Based Development)
6. Linter (Biome, ESLint+Prettier, Ruff, aucun)
7. Niveau de sévérité (Startup, Standard, Mission Critical)
8. Langue de documentation
9. Activation des tests automatisés
10. Activation de Docker
11. Activation de Supabase (si applicable)

Une fois les réponses collectées, le générateur exécute automatiquement 11 actions :

1. **Scaffolding** — Installe le framework choisi (ex: `npx create-next-app`)
2. **Arborescence GEF** — Crée la structure Diátaxis (`docs/tutorials/`, `docs/how-to/`, etc.)
3. **Template ADR** — Crée `docs/explanation/adr/0000-template.md`
4. **Configuration** — Génère `PROJECT_CONFIG.md` avec tous les choix
5. **Documentation** — Génère `README.md` et `docs/research/RESEARCH_LOG.md`
6. **Linter** — Génère `biome.json`, `.eslintrc.json`, ou `ruff.toml`
7. **Docker** — Génère `docker/Dockerfile` et `docker/docker-compose.yml`
8. **Playbook & Prompts** — Copie le Playbook et les Prompts dans `.gef/`
9. **Hooks Git** — Génère les hooks dynamiques selon la stratégie Git choisie
10. **CI/CD** — Génère `.github/workflows/main.yml` adapté à la stack
11. **Release Please** — Génère `.github/workflows/release-please.yml`

Le résultat est un projet prêt à l'emploi, avec toutes les règles d'ingénierie pré-configurées et imposées mécaniquement.

Ce qui est crucial : le développeur n'a pas à lire de documentation pour connaître les règles. Elles sont déjà actives dans le projet.

## 2.3. Brique B : Les hooks Git

Les hooks Git sont des scripts qui s'exécutent automatiquement à des moments précis du workflow Git. GEF génère trois hooks principaux :

### Hook commit-msg

Ce hook valide le format du message de commit. Il impose deux règles :

1. **Format Conventional Commits** : `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`
2. **Référence Kanban obligatoire** : `#XYZ` où XYZ est l'ID du ticket

Exemple de message valide :
```
feat: ajout de l'authentification OAuth (#42)
```

Exemple de message invalide :
```
ajout auth
```

Si le message ne respecte pas le format, le commit est bloqué. Le développeur doit corriger avant de pouvoir committer.

### Hook pre-commit

Ce hook s'exécute avant chaque commit et effectue trois vérifications :

1. **Détection de secrets** — Détecte les clés API, tokens, mots de passe en clair
2. **Vérification du formatage** — Exécute le linter (Biome, ESLint, Ruff)
3. **Blocage de main/master** — Empêche tout commit direct sur la branche principale

Si l'une de ces vérifications échoue, le commit est bloqué.

### Hook pre-push

Ce hook est dynamique selon la stratégie Git choisie :

- **GitHub Flow** : Bloque tout push direct sur `main`. Force l'usage de branches et Pull Requests.
- **Trunk-Based Development** : Autorise les pushes sur `main`, mais exécute les tests locaux avant.

Ces hooks sont générés à la volée par le générateur en fonction des choix de l'équipe, et installés dans `.git/hooks/` du projet.

## 2.4. Brique C : Le pipeline CI/CD

Le générateur crée deux fichiers dans `.github/workflows/` :

### main.yml — Contrôle Qualité & Déploiement

Ce workflow est adapté à votre stack et cloud. Il se déclenche sur :
- Push sur `main`, `feat/**`, `fix/**`
- Tags `v*.*.*`
- Pull Requests

Il exécute les jobs suivants :
1. **Setup runtime** — Installation de Node.js, Python, etc.
2. **Install** — Installation des dépendances
3. **Lint** — Vérification du code avec le linter
4. **Tests** — Exécution des tests unitaires et d'intégration
5. **Analyse sécurité** — Scan de vulnérabilités
6. **Déploiement** — Déploiement sur Vercel/AWS ou release GitHub

### release-please.yml — Automatisation des Releases

Ce workflow automatise la gestion des versions via Semantic Versioning :

- À chaque push sur `main`, il génère une Pull Request de Release
- Le numéro de version est calculé depuis les commits (`feat:` = minor, `fix:` = patch)
- Le `CHANGELOG.md` est généré automatiquement
- Quand la PR est mergée : le tag Git et la Release GitHub sont créés automatiquement

Le développeur n'a plus à gérer manuellement les versions. Le système le fait pour lui, de manière cohérente.

## 2.5. Brique D : Les prompts IA

Les prompts IA sont des directives à charger dans votre assistant IA selon le contexte de travail. Ils sont copiés dans `.gef/prompts/` de chaque projet généré.

GEF fournit six prompts spécialisés :

| Fichier | Quand l'utiliser |
|---|---|
| `system_prompt.md` | **Toujours** — à charger en début de chaque session |
| `feature_development.md` | Lors du développement d'une nouvelle fonctionnalité |
| `code_review.md` | Lors d'une revue de code |
| `bugfix.md` | Lors de la correction d'un bug |
| `adr_writing.md` | Lors d'une décision architecturale importante |
| `new_project_kickoff.md` | Au tout démarrage d'un nouveau projet |

Ces prompts contiennent les règles du Playbook, injectées avec les Hard Limits adaptés au niveau de sévérité choisi (Startup, Standard, Mission Critical).

Par exemple, le `system_prompt.md` contient :
- Les limites de taille de fonctions (30 lignes pour Standard)
- Les limites de paramètres (3 pour Standard)
- Les règles d'architecture (Feature-Sliced Design)
- Les règles de sécurité (OWASP)
- Les règles Git (GitHub Flow)

L'IA connaît donc instantanément toutes les règles du projet, sans que le développeur ait à les répéter.

## 2.6. Brique E : Le Tech Lead Virtuel

Au-delà de la génération, GEF transforme l'IA en Tech Lead autonome grâce à trois règles inscrites dans le Playbook :

### Pilotage Kanban & Pull Requests

L'IA peut créer ses propres tickets via `gh issue create`, lier chaque commit à un ticket (`feat: ... (#42)`), ouvrir les Pull Requests via `gh pr create`, et **demander votre validation avant de merger**.

### Auto-Documentation ADR

Avant tout choix architectural majeur (nouvelle dépendance, nouveau service), l'IA **doit** rédiger un rapport dans `docs/adr/` en utilisant le template fourni. Elle ne peut pas coder sans avoir d'abord documenté sa décision.

### TDD Piloté par l'IA

Avant d'écrire le code applicatif, l'IA rédige le test E2E (Playwright) qui décrit le comportement attendu. Le code est ensuite écrit pour faire passer ce test au vert.

### Clause d'Antériorité

Ces règles s'appliquent au nouveau code. L'IA ne refactorise jamais proactivement l'ancien code pour le rendre conforme, sauf demande explicite. Si un fichier est modifié pour un bugfix/feature, l'IA applique la Boy Scout Rule : nettoyer le code environnant sans casser les tests.

## 2.7. Brique F : La garantie anti-contournement

C'est la brique la plus innovante de GEF. Elle va au-delà des règles textuelles pour **imposer mécaniquement** aux IA les bonnes pratiques dès l'ouverture du projet.

### Comment ça fonctionne

| Mécanisme | Fichier | Effet |
|---|---|---|
| **Règles natives IDE** | `.cursorrules` / `.windsurfrules` | Toute IA (Cursor, Windsurf, Copilot) lit ces fichiers au démarrage et connaît instantanément les règles du Playbook |
| **Crash Clause** | `prompts/system_prompt.md` | L'IA est instruite de s'arrêter immédiatement et de signaler tout obstacle, au lieu de l'improvisation silencieuse |
| **Checklist Pull Request** | `.github/PULL_REQUEST_TEMPLATE.md` | L'IA (et l'humain) doit physiquement cocher les validations (Tests, Docs, ADR) avant qu'une PR puisse être mergée |
| **Blocage Linter** | `biome.json` / `.eslintrc.json` / `ruff.toml` | Le linter est configuré avec les limites et plantera si l'IA tente de bypasser le framework |
| **Blocage local** | `hooks/pre-commit` | Un commit direct sur `main` est physiquement impossible |
| **Validation CI** | `ci-templates/pr-intention-check.yml` & `main.yml` | La CI rejette les PRs sans intention métier et bloque si la couverture de tests < 80% |
| **Propagation** | `generator/features/scaffold-ai-rules.js` | Chaque projet généré hérite automatiquement du `.cursorrules` complet |

La puissance réside ici : l'utilisateur n'a jamais à expliquer les règles à l'IA. Elles sont déjà là, implantées nativement dans l'environnement de développement.

## 2.8. Ce qui est unique dans l'approche GEF

GEF n'est pas le premier outil à proposer des règles d'ingénierie. Ce qui le rend unique est la combinaison de trois propriétés :

### 1. Intégration complète

La plupart des outils résolvent une partie du problème :
- Husky pour les hooks Git
- Biome pour le linting
- GitHub Actions pour la CI/CD
- Release Please pour les versions

GEF réunit tous ces outils dans un workflow cohérent, pré-configuré et adapté à votre stack.

### 2. Implantation native dans les IDEs IA

Aucun autre outil n'implante ses règles directement dans `.cursorrules` et `.windsurfrules`. C'est ce qui permet aux assistants IA de connaître instantanément les règles du projet sans que le développeur ait à les répéter.

### 3. Verrous mécaniques à chaque niveau

GEF ne se contente pas de recommander. Il bloque :
- Les commits invalides (hooks Git)
- Le code mal formaté (linters)
- Les PRs sans intention (CI)
- Les pushes sur main (hooks Git)
- Les décisions architecturales non documentées (prompts IA)

Chaque couche ajoute un verrou mécanique. Pour contourner GEF, il faudrait désactiver tous ces verrous — un effort conscient et évident.

## Résumé du chapitre

Le Guardian Engineering Framework est composé de six briques interconnectées : le générateur de projet, les hooks Git, le pipeline CI/CD, les prompts IA, le Tech Lead Virtuel, et la garantie anti-contournement.

Chaque brique résout une partie spécifique du problème de la gouvernance dans le développement assisté par IA. Ensemble, elles forment un système où les règles ne sont pas documentées — elles sont imposées mécaniquement à chaque étape du cycle de développement.

Ce qui rend GEF unique est son intégration complète, son implantation native dans les IDEs IA, et ses verrous mécaniques à chaque niveau du workflow.

Dans le chapitre suivant, nous explorerons en détail les règles de Clean Code quantitatif que GEF impose.
