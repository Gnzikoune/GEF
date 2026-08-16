# Changelog Archive

Cet archive contient l'historique complet des versions antérieures à 1.16.0.

## [1.15.0](https://github.com/Gnzikoune/GEF/compare/v1.14.1...v1.15.0) (2026-08-11)


### Features

* implémentation de la commande gef doctor ([#81](https://github.com/Gnzikoune/GEF/issues/81)) ([#82](https://github.com/Gnzikoune/GEF/issues/82)) ([bac2ae6](https://github.com/Gnzikoune/GEF/commit/bac2ae601afb03004d7f13be7fad66c502bb57b4))

## [1.14.1](https://github.com/Gnzikoune/GEF/compare/v1.14.0...v1.14.1) (2026-08-11)


### Bug Fixes

* bump version to 1.15.0 pour débloquer la publication CI ([#76](https://github.com/Gnzikoune/GEF/issues/76)) ([#79](https://github.com/Gnzikoune/GEF/issues/79)) ([e005cf3](https://github.com/Gnzikoune/GEF/commit/e005cf3b3cc713e31ac3f146ea2bb83c2a7648f4))

## [1.14.0](https://github.com/Gnzikoune/GEF/compare/v1.13.0...v1.14.0) (2026-08-11)


### Features

* implémentation Phase 4 (CI/CD et tests) ([#76](https://github.com/Gnzikoune/GEF/issues/76)) ([#77](https://github.com/Gnzikoune/GEF/issues/77)) ([f71ee71](https://github.com/Gnzikoune/GEF/commit/f71ee717b486c1626f69dde2cc44d8ea4a414f16))

## [1.13.0](https://github.com/Gnzikoune/GEF/compare/v1.12.0...v1.13.0) (2026-08-11)


### Features

* audit continu verify-self, SAST Semgrep, commit body obligatoire ([#73](https://github.com/Gnzikoune/GEF/issues/73)) ([#73](https://github.com/Gnzikoune/GEF/issues/73)) ([0872d43](https://github.com/Gnzikoune/GEF/commit/0872d43f548fcabab3a09939c2529cc8376bdbf9b8))


### Bug Fixes

* corrections critiques du générateur et traduction (Audit Phase 1) ([#72](https://github.com/Gnzikoune/GEF/issues/72)) ([#72](https://github.com/Gnzikoune/GEF/issues/72)) ([d945e66](https://github.com/Gnzikoune/GEF/commit/d945e6604eb52ddae51cd7ac53561a0c56341849))

## [1.15.0](https://github.com/Gnzikoune/GEF/compare/v1.12.0...v1.15.0) (2026-08-11)

### Features

* **sdd:** transformer GEF en infrastructure Agentic SDD — pivot vers l'Agentic Software Engineering avec dossier `specs/`, workflow SDD obligatoire (Intent → Spec → Plan → Validation humaine → Code), assouplissement du TDD (Unit/Integration > E2E), et correction du hook `commit-msg` (suppression du bloc `gef_compliance_check` des commits Git) ([#70](https://github.com/Gnzikoune/GEF/issues/70))

## [1.12.0](https://github.com/Gnzikoune/GEF/compare/v1.11.0...v1.12.0) (2026-08-11)


### Features

* absorber les prompts contextuels dans les regles IA auto-chargees ([#67](https://github.com/Gnzikoune/GEF/issues/67)) ([#68](https://github.com/Gnzikoune/GEF/issues/68)) ([f983bb5](https://github.com/Gnzikoune/GEF/commit/f983bb543d88b7a32292864ac202390fda428cfa))
* integration de la methodologie AI SDD et bump v1.13.0 ([#65](https://github.com/Gnzikoune/GEF/issues/65)) ([121864b](https://github.com/Gnzikoune/GEF/commit/121864b8df81a657ac6222e6fd8a37be39ea77e7))
* transformer GEF en infrastructure Agentic SDD ([#70](https://github.com/Gnzikoune/GEF/issues/70)) ([#70](https://github.com/Gnzikoune/GEF/issues/70)) ([fe38005](https://github.com/Gnzikoune/GEF/commit/fe38005bdc85cdaa69cc1c35a61422d8a1d806a9))

## [1.11.0](https://github.com/Gnzikoune/GEF/compare/v1.10.0...v1.11.0) (2026-08-10)


### Features

* add anti-amnesia checkpoints and external context memory ([#48](https://github.com/Gnzikoune/GEF/issues/48)) ([#46](https://github.com/Gnzikoune/GEF/issues/46)) ([4733c8b](https://github.com/Gnzikoune/GEF/commit/4733c8bf3129e0a6dded2f314e3c6700a67e7109))
* add automatic certification to release-please PRs ([#48](https://github.com/Gnzikoune/GEF/issues/48)) ([#41](https://github.com/Gnzikoune/GEF/issues/41)) ([64b31c8](https://github.com/Gnzikoune/GEF/commit/64b31c85c16915a64116377cc45a6bed86ecb8a0))
* ajout des regles cursor et IDE IA lors du scaffold ([#4](https://github.com/Gnzikoune/GEF/issues/4)) ([b9fa757](https://github.com/Gnzikoune/GEF/commit/b9fa75744fa8229ca31c6c0d93dc16e18bd947f2))
* ajout des regles IA globales au framework lui-meme ([#6](https://github.com/Gnzikoune/GEF/issues/6)) ([e4c32b5](https://github.com/Gnzikoune/GEF/commit/e4c32b5bfbb4fffeed782c1d0ebb0d33d3573452))
* ajout du verrouillage de la branche main dans le hook pre-commi… ([61513df](https://github.com/Gnzikoune/GEF/commit/61513dfabe876cbb5e71a1ea35bb4d4bb296d469))
* ajout du verrouillage de la branche main dans le hook pre-commit ([#3](https://github.com/Gnzikoune/GEF/issues/3)) ([9f76e4f](https://github.com/Gnzikoune/GEF/commit/9f76e4f11a9edfe1dfeb8481351331b4b18339df))
* ajout du workflow CI forcant l intention dans la PR ([#5](https://github.com/Gnzikoune/GEF/issues/5)) ([389a31a](https://github.com/Gnzikoune/GEF/commit/389a31a63b7c7029cd8c02d4f1721a5a06b30ba0))
* alignement avec les standards Big Tech et renforcement de l'anti-contournement ([#61](https://github.com/Gnzikoune/GEF/issues/61)) ([845cca9](https://github.com/Gnzikoune/GEF/commit/845cca9c1cd9878d2e9d8e604575686a042c5852))
* apply anti-amnesia rules to all generated projects ([#48](https://github.com/Gnzikoune/GEF/issues/48)) ([#47](https://github.com/Gnzikoune/GEF/issues/47)) ([49e82a0](https://github.com/Gnzikoune/GEF/commit/49e82a0a6cd48aa6df5447ad69d519c5dff5e41d))
* **ci:** ajout du template github actions main.yml ([e544634](https://github.com/Gnzikoune/GEF/commit/e5446344266f903e4e512c1f717b9f990594abe3))
* **ci:** automatisation de la publication NPM lors de la création d'une release ([112a7a2](https://github.com/Gnzikoune/GEF/commit/112a7a2b4b4993ce698e6c9704fb8d53a9af7d0f))
* **ci:** pipeline ci/cd progressif selon severite ([293050f](https://github.com/Gnzikoune/GEF/commit/293050f106aa1cf6f816ddc919aba6079c840e9c))
* **ci:** pipeline ci/cd progressif selon severite ([#5](https://github.com/Gnzikoune/GEF/issues/5)) ([4b9d574](https://github.com/Gnzikoune/GEF/commit/4b9d574a31df7459a2b19b0155f39f5b91b1df98))
* **cli:** ajout commandes --help et --version + mise a jour README et site ([#4](https://github.com/Gnzikoune/GEF/issues/4)) ([ca63acb](https://github.com/Gnzikoune/GEF/commit/ca63acbecb834af24648f881ec07f3fa46a3797c))
* cursorrules completement refait avec toutes les regles GEF + source unique de verite ([#8](https://github.com/Gnzikoune/GEF/issues/8)) ([bc50b69](https://github.com/Gnzikoune/GEF/commit/bc50b69758b8fa8d8c158c00f5bd1d4e3c02708c))
* cursorrules complets - toutes les regles GEF injectees nativement dans les IDEs IA ([60fefcf](https://github.com/Gnzikoune/GEF/commit/60fefcf6d6156f90e88207a89264ef468c52c732))
* **framework:** Tech Lead Virtuel (Kanban, ADR, TDD/Playwright, release-please, commande update) ([0871596](https://github.com/Gnzikoune/GEF/commit/0871596abf10ed89829b801fe99b379b4e9ab4d2))
* **generator:** ajout de la génération vercel.json, dossier supabase/ et désactivation auto de Docker si Vercel ([0f2773b](https://github.com/Gnzikoune/GEF/commit/0f2773b6dd8714597235064e65a6b4e3ac6144ae))
* **generator:** ajout du scaffolding intelligent et des options Cloud/DB ([3c3daf8](https://github.com/Gnzikoune/GEF/commit/3c3daf8643a437ccd94a8723acaf8abe5051502d))
* **generator:** ajout du script bash gef-new.sh ([852c48d](https://github.com/Gnzikoune/GEF/commit/852c48d7d7f84c27f92f98994a67a1704b065195))
* **generator:** ajout du script powershell gef-new.ps1 ([1f85e87](https://github.com/Gnzikoune/GEF/commit/1f85e87108f67d62b8d30cd1d5322cc1e14c13a2))
* **generator:** automatisation des verrous mecaniques ([#10](https://github.com/Gnzikoune/GEF/issues/10)) ([1b92577](https://github.com/Gnzikoune/GEF/commit/1b9257770bb33ddf653ecbcb09cb4e5c50ff4826))
* **generator:** CI/CD généré dynamiquement selon la stack et le cloud provider ([0000ff3](https://github.com/Gnzikoune/GEF/commit/0000ff3862eace614cc45d01e7165d8560265405))
* **generator:** génération intelligente des fichiers Docker selon la stack et la base de données choisies ([2223b9b](https://github.com/Gnzikoune/GEF/commit/2223b9ba0a1984bb4d53465d3f20f2868c93dcc))
* **generator:** implémentation de la CLI interactive en Node.js ([25a88db](https://github.com/Gnzikoune/GEF/commit/25a88dba1663c9ad54e5c6a277fd930756ed9a3c))
* **generator:** implémentation des fonctionnalités promises manquantes ([#7](https://github.com/Gnzikoune/GEF/issues/7)) ([df35f62](https://github.com/Gnzikoune/GEF/commit/df35f6213f0b77937d98edb5b071dd0e9a6c0dee))
* **generator:** implémentation des promesses manquantes ([1242c33](https://github.com/Gnzikoune/GEF/commit/1242c33f12ca8b854648ce7d21ac9ac8b8eedbf4))
* **generator:** intégration du Playbook et des Prompts au sein du projet généré (.gef/) ([4771b79](https://github.com/Gnzikoune/GEF/commit/4771b79b43e80d5348e07c14ea3752a7d0ea84a1))
* **generator:** mode dynamique (Git, Limites, Linter, DB, Langue) ([#2](https://github.com/Gnzikoune/GEF/issues/2)) ([7fc98a9](https://github.com/Gnzikoune/GEF/commit/7fc98a9088f6d710aa3943106cf15464ce768463))
* **generator:** verrous physiques anti-contournement (Linter, PR, CI) ([fede0ce](https://github.com/Gnzikoune/GEF/commit/fede0ce4a9dfa9e4fd5de6f84108fe4ee24ea48))
* **hooks:** ajout du hook commit-msg ([ed70325](https://github.com/Gnzikoune/GEF/commit/ed70325032ec9ab82e32d703a640d45a8504271))
* **hooks:** ajout du hook pre-commit ([8b476a2](https://github.com/Gnzikoune/GEF/commit/8b476a2ab161d98fb7581104a579b4806e98924a))
* **hooks:** ajout du hook pre-push ([cbaa323](https://github.com/Gnzikoune/GEF/commit/cbaa3237691b92ac1e6e0aabaf936d852f37feab))
* integration de toutes les regles du playbook dans les cursorrules ([#7](https://github.com/Gnzikoune/GEF/issues/7)) ([888feae](https://github.com/Gnzikoune/GEF/commit/888feaefb71901570c18781736537e3b912c85b4))
* juge sémantique hybride (IA/Heuristique) pour la validation des PRs ([#44](https://github.com/Gnzikoune/GEF/issues/44)) ([b8434f0](https://github.com/Gnzikoune/GEF/commit/b8434f086164a2945488828d80a37b83d553e31e))
* juge sémantique hybride (IA/Heuristique) pour la validation des PRs ([#44](https://github.com/Gnzikoune/GEF/issues/44)) ([c3d442e](https://github.com/Gnzikoune/GEF/commit/c3d442ecf8985503d066a9c148c5b5987ce94f5))
* **playbook:** ajout des Hard Limits quantitatives (Clean Code & OWASP Security) ([7552a41](https://github.com/Gnzikoune/GEF/commit/7552a41711067c3115489fb31222b442e1f757d7))
* **prompts:** ajout du prompt adr_writing ([e34c386](https://github.com/Gnzikoune/GEF/commit/e34c386ca4b7b186c2f04604bc4eeae6d964cd27))
* **prompts:** ajout du prompt bugfix ([3c26c60](https://github.com/Gnzikoune/GEF/commit/3c26c60666c5b2b2157154473361aafe4c4c708d))
* **prompts:** ajout du prompt code_review ([e7aa901](https://github.com/Gnzikoune/GEF/commit/e7aa90170b5fa626881369514807f74df9551d05))
* **prompts:** ajout du prompt feature_development ([6d0869a](https://github.com/Gnzikoune/GEF/commit/6d0869a352b8b49de0d5ac7648b8c86712c23d9f9))
* **prompts:** ajout du prompt new_project_kickoff ([1a06d13](https://github.com/Gnzikoune/GEF/commit/1a06d13973fc2b44455f5fd4dfdb55bdaf73559c))
* **prompts:** ajout du system_prompt.md (Brique D) ([cace7d8](https://github.com/Gnzikoune/GEF/commit/cace7d8070b3ae85d088f0ffd188f7f7279dabe2))
* **prompts:** refonte complete de tous les prompts IA (system, code_review, bugfix, kickoff, adr) ([337288e](https://github.com/Gnzikoune/GEF/commit/337288e0dd6bdd52c24a3977bd5e479e6d12412f))
* securisation des contributions externes et CODEOWNERS ([#47](https://github.com/Gnzikoune/GEF/issues/47)) ([9a4df5b](https://github.com/Gnzikoune/GEF/commit/9a4df5be04da0661db1bb8a2ae2596d39f185181))
* transformation du GEF en package npm root exécutable via npx create-gef ([c49a559](https://github.com/Gnzikoune/GEF/commit/c49a5591ecb5226edbe9b10f220cc1c5bf096b09))
* verrouillage mécanique absolu de l'architecture (Issue Forms, Hooks, CoT) ([a82af05](https://github.com/Gnzikoune/GEF/commit/a82af05a0c745d2f721262d2a9bfa8f257b7a68f))
* verrouillage mécanique absolu de l'architecture (Issue Forms, Hooks, CoT) ([#43](https://github.com/Gnzikoune/GEF/issues/43)) ([c4be363](https://github.com/Gnzikoune/GEF/commit/c4be3630c6738c8bd5a85ffcaf40a43cd508ff2))