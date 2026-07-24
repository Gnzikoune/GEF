# Changelog

## [1.3.1](https://github.com/Gnzikoune/GEF/compare/v1.3.0...v1.3.1) (2026-07-24)


### Bug Fixes

* implementation des correctifs de l'audit ([#42](https://github.com/Gnzikoune/GEF/issues/42)) ([62fc02c](https://github.com/Gnzikoune/GEF/commit/62fc02c305a713efc675c0d94ebc23642c19448c))
* resolution des vulnerabilites de l'audit ([#42](https://github.com/Gnzikoune/GEF/issues/42)) ([300371f](https://github.com/Gnzikoune/GEF/commit/300371f978282965188765b789f001d1715e8a07))

## [1.3.0](https://github.com/Gnzikoune/GEF/compare/v1.2.0...v1.3.0) (2026-07-21)


### Features

* **generator:** automatisation des verrous mecaniques ([#10](https://github.com/Gnzikoune/GEF/issues/10)) ([1b92577](https://github.com/Gnzikoune/GEF/commit/1b9257770bb33ddf653ecbcb09cb4e5c50ff4826))
* **generator:** verrous physiques anti-contournement (Linter, PR, CI) ([fede0ce](https://github.com/Gnzikoune/GEF/commit/fede0ce4a9dfa9e4fd5de6f84108fe4aee24ea48))

## [1.2.0](https://github.com/Gnzikoune/GEF/compare/v1.1.1...v1.2.0) (2026-07-21)


### Features

* ajout des regles cursor et IDE IA lors du scaffold ([#4](https://github.com/Gnzikoune/GEF/issues/4)) ([b9fa757](https://github.com/Gnzikoune/GEF/commit/b9fa75744fa8229ca31c6c0d93dc16e18bd947f2))
* ajout des regles IA globales au framework lui-meme ([#6](https://github.com/Gnzikoune/GEF/issues/6)) ([e4c32b5](https://github.com/Gnzikoune/GEF/commit/e4c32b5bfbb4fffeed782c1d0ebb0d33d3573452))
* ajout du verrouillage de la branche main dans le hook pre-commi… ([61513df](https://github.com/Gnzikoune/GEF/commit/61513dfabe876cbb5e71a1ea35bbd4bbf296d469))
* ajout du verrouillage de la branche main dans le hook pre-commit ([#3](https://github.com/Gnzikoune/GEF/issues/3)) ([9f76e4f](https://github.com/Gnzikoune/GEF/commit/9f76e4f11a9edfe1dfeb8481351331b4b18339df))
* ajout du workflow CI forcant l intention dans la PR ([#5](https://github.com/Gnzikoune/GEF/issues/5)) ([389a31a](https://github.com/Gnzikoune/GEF/commit/389a31a63b7c7029cd8c02d4f1721a5a06b30ba0))
* cursorrules completement refait avec toutes les regles GEF + source unique de verite ([#8](https://github.com/Gnzikoune/GEF/issues/8)) ([bc50b69](https://github.com/Gnzikoune/GEF/commit/bc50b69758b8fa8d8c158c00f5bd1d4e3c02708c))
* cursorrules complets - toutes les regles GEF injectees nativement dans les IDEs IA ([60fefcf](https://github.com/Gnzikoune/GEF/commit/60fefcf6d6156f90e88207a89264ef468c52c732))
* integration de toutes les regles du playbook dans les cursorrules ([#7](https://github.com/Gnzikoune/GEF/issues/7)) ([888feae](https://github.com/Gnzikoune/GEF/commit/888feaefb71901570c18781736537e3b912c85b4))
* workflow CI qui bloque les PR sans intention metier declaree ([bee28e3](https://github.com/Gnzikoune/GEF/commit/bee28e322613abbb95b7adec2f3d8beb3ffaa013))

## [1.1.1](https://github.com/Gnzikoune/GEF/compare/v1.1.0...v1.1.1) (2026-07-20)


### Bug Fixes

* **generator:** installation Next/Vite non-interactive ([98882ae](https://github.com/Gnzikoune/GEF/commit/98882ae59fbcb78c628cadfa149a9b6ec3823006))
* **generator:** rendre l'installation Next et Vite silencieuse et non-interactive ([#8](https://github.com/Gnzikoune/GEF/issues/8)) ([4806b15](https://github.com/Gnzikoune/GEF/commit/4806b1526dcdcd356ab8817c55f374b2485ece35))

## [1.1.0](https://github.com/Gnzikoune/GEF/compare/v1.0.0...v1.1.0) (2026-07-20)


### Features

* **ci:** pipeline ci/cd progressif selon severite ([293050f](https://github.com/Gnzikoune/GEF/commit/293050f106aa1cf6f816ddc919aba6079c840e9c))
* **ci:** pipeline ci/cd progressif selon severite ([#5](https://github.com/Gnzikoune/GEF/issues/5)) ([4b9d574](https://github.com/Gnzikoune/GEF/commit/4b9d574a31df7459a2b19b0155f39f5b91b1df98))
* **cli:** ajout commandes --help et --version + mise a jour README et site ([#4](https://github.com/Gnzikoune/GEF/issues/4)) ([ca63acb](https://github.com/Gnzikoune/GEF/commit/ca63acbecb834af24648f881ec07f3fa46a3797c))
* **generator:** implémentation des fonctionnalités promises manquantes ([#7](https://github.com/Gnzikoune/GEF/issues/7)) ([df35f62](https://github.com/Gnzikoune/GEF/commit/df35f6213f0b77937d98edb5b071dd0e9a6c0dee))
* **generator:** implémentation des promesses manquantes ([1242c33](https://github.com/Gnzikoune/GEF/commit/1242c33f12ca8b854648ce7d21ac9ac8b8eedbf4))


### Bug Fixes

* **cli:** rendre la commande update dynamique ([45e6f19](https://github.com/Gnzikoune/GEF/commit/45e6f194be8545d36610c73e7340a1fcaec06463))
* **cli:** rendre la commande update dynamique via PROJECT_CONFIG.md ([#6](https://github.com/Gnzikoune/GEF/issues/6)) ([5288ff3](https://github.com/Gnzikoune/GEF/commit/5288ff31a951e21e83a92a4e2b56bdc3e87ddf42))

## 1.0.0 (2026-07-20)


### Features

* **ci:** ajout du template github actions main.yml ([e544634](https://github.com/Gnzikoune/GEF/commit/e5446344266f903e4e512c1f717b9f990594abe3))
* **ci:** automatisation de la publication NPM lors de la création d'une release ([112a7a2](https://github.com/Gnzikoune/GEF/commit/112a7a2b4b4993ce698e6c9704fb8d53a9af7d0f))
* **framework:** Tech Lead Virtuel (Kanban, ADR, TDD/Playwright, release-please, commande update) ([0871596](https://github.com/Gnzikoune/GEF/commit/0871596abf10ed89829b801fe99b379b4e9ab4d2))
* **generator:** ajout de la génération vercel.json, dossier supabase/ et désactivation auto de Docker si Vercel ([0f2773b](https://github.com/Gnzikoune/GEF/commit/0f2773b6dd8714597235064e65a6b4e3ac6144ae))
* **generator:** ajout du scaffolding intelligent et des options Cloud/DB ([3c3daf8](https://github.com/Gnzikoune/GEF/commit/3c3daf8643a437ccd94a8723acaf8abe5051502d))
* **generator:** ajout du script bash gef-new.sh ([852c48d](https://github.com/Gnzikoune/GEF/commit/852c48d7d7f84c27f92f98994a67c1704b065195))
* **generator:** ajout du script powershell gef-new.ps1 ([1f85e87](https://github.com/Gnzikoune/GEF/commit/1f85e87108f67d62b8d30cd1d5322cc1e14c13a2))
* **generator:** CI/CD généré dynamiquement selon la stack et le cloud provider ([0000ff3](https://github.com/Gnzikoune/GEF/commit/0000ff3862eace614cc45d01e7165d8560265405))
* **generator:** génération intelligente des fichiers Docker selon la stack et la base de données choisies ([2223b9b](https://github.com/Gnzikoune/GEF/commit/2223b9ba0a1984bb4d534653d8f20f2868c93dcc))
* **generator:** implémentation de la CLI interactive en Node.js ([25a88db](https://github.com/Gnzikoune/GEF/commit/25a88dba1663c9ad54e5c6a277fd930756ed9a3c))
* **generator:** intégration du Playbook et des Prompts au sein du projet généré (.gef/) ([4771b79](https://github.com/Gnzikoune/GEF/commit/4771b79b43e80d5348e07c14ea3752a7d0ea84a1))
* **generator:** mode dynamique (Git, Limites, Linter, DB, Langue) ([#2](https://github.com/Gnzikoune/GEF/issues/2)) ([7fc98a9](https://github.com/Gnzikoune/GEF/commit/7fc98a9088f6d710aa3943106cf15464ce768463))
* **hooks:** ajout du hook commit-msg ([ed70325](https://github.com/Gnzikoune/GEF/commit/ed70325032ec9ab82e32d7063a640d45a8504271))
* **hooks:** ajout du hook pre-commit ([8b476a2](https://github.com/Gnzikoune/GEF/commit/8b476a2ab161d98fb7581104a579b480e698924a))
* **hooks:** ajout du hook pre-push ([cbaa323](https://github.com/Gnzikoune/GEF/commit/cbaa3237691b92ac1e6e0aabaf936d852f37feab))
* **playbook:** ajout des Hard Limits quantitatives (Clean Code & OWASP Security) ([7552a41](https://github.com/Gnzikoune/GEF/commit/7552a41711067c3115489fb31222b442e1f757d7))
* **prompts:** ajout du prompt adr_writing ([e34c386](https://github.com/Gnzikoune/GEF/commit/e34c386ca4b7b186c2f04604bc4eeae6d964cd27))
* **prompts:** ajout du prompt bugfix ([3c26c60](https://github.com/Gnzikoune/GEF/commit/3c26c60666c5b2b2157154473361aafe4c4c708d))
* **prompts:** ajout du prompt code_review ([e7aa901](https://github.com/Gnzikoune/GEF/commit/e7aa90170b5fa626881369514807f74df9551d05))
* **prompts:** ajout du prompt feature_development ([6d0869a](https://github.com/Gnzikoune/GEF/commit/6d0869a352b8b49de0d5ac762b8c86712c23d9f9))
* **prompts:** ajout du prompt new_project_kickoff ([1a06d13](https://github.com/Gnzikoune/GEF/commit/1a06d13973fc2b44455f5fd4dfdb55bdaf73559c))
* **prompts:** ajout du system_prompt.md (Brique D) ([cace7d8](https://github.com/Gnzikoune/GEF/commit/cace7d8070b3ae85d088f0ffd188f7f7279dabe2))
* **prompts:** refonte complete de tous les prompts IA (system, code_review, bugfix, kickoff, adr) ([337288e](https://github.com/Gnzikoune/GEF/commit/337288e0dd6bdd52c24a3977bd5e479e6d12412f))
* transformation du GEF en package npm root exécutable via npx create-gef ([c49a559](https://github.com/Gnzikoune/GEF/commit/c49a5591ecb5226edbe9b10f220cc1c5bf096b09))
* **website:** création de la landing page vitrine pour le framework GEF ([96e7376](https://github.com/Gnzikoune/GEF/commit/96e73769cf01d75bae73d994bb7ed5c7ff525850))
* **website:** remplacement du terminal animé par un lecteur vidéo (autoplay/loop/mute) ([aed0cde](https://github.com/Gnzikoune/GEF/commit/aed0cde4d673b311b57a70bb0d7405a4e855f9f3))


### Bug Fixes

* **ci:** correction de la branche cible (master au lieu de main) pour release-please ([b1687ce](https://github.com/Gnzikoune/GEF/commit/b1687ce0f9d1f253fbab33d2c9a41842f9f5a65b))
* **ci:** migration master -&gt; main + mise en conformite TBD du hook pre-push ([df45d6a](https://github.com/Gnzikoune/GEF/commit/df45d6ac3b07b2cb4995acdf9511cc344a240c8b))
* **gef:** restauration de la strategie GitHub Flow par defaut pour le GEF lui-meme ([#3](https://github.com/Gnzikoune/GEF/issues/3)) ([c982c5b](https://github.com/Gnzikoune/GEF/commit/c982c5b424be15e2df2f670c965ce2a42222f90e))
* **gef:** restauration GitHub Flow par défaut ([8e4792a](https://github.com/Gnzikoune/GEF/commit/8e4792ada7ff41f871c78de0eb4747bd1e51007c))
* **generator:** correction du doublon — message de bienvenue déplacé dans run() pour éviter l'exécution au chargement du module ([a68b217](https://github.com/Gnzikoune/GEF/commit/a68b217768f0e02045df8915a46171da313c480b))
* **generator:** force la branche par défaut à 'main' lors de l'initialisation de git (git init && git branch -M main) ([3099d90](https://github.com/Gnzikoune/GEF/commit/3099d9059ad2165a3b5d8e29b2e7f5a4c3324bde))
* **generator:** scaffolding Next.js et Vite en mode interactif natif, sans flags imposés ([ff05a1c](https://github.com/Gnzikoune/GEF/commit/ff05a1c985d4dacdc86f307f1728cefa073460c5))
* **generator:** verrou anti-double-execution + suppression du champ 'main' du package.json ([3234341](https://github.com/Gnzikoune/GEF/commit/3234341e9ac6f8efba1f13851e619f63c08725e6))
* **template:** suppression des mentions spécifiques et remplacement par des placeholders dynamiques ([f94a970](https://github.com/Gnzikoune/GEF/commit/f94a970554ffdfe6fc4c53946d4faab3c6690c29))
