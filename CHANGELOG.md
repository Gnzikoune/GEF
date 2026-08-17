# Changelog

## [1.20.1](https://github.com/Gnzikoune/GEF/compare/v1.20.0...v1.20.1) (2026-08-17)

### Bug Fixes

* corriger création du dossier .gef et chemin dans setupGef ([#89](https://github.com/Gnzikoune/GEF/issues/89))
* ajouter vérification et création du dossier .gef avant écriture des fichiers
* corriger dépendance projectPath dans setupGef pour copie correcte des fichiers

## [1.20.0](https://github.com/Gnzikoune/GEF/compare/v1.18.0...v1.20.0) (2026-08-16)


### Features

* ajouter Smart CLI avec assistant intelligent et mode offline garanti ([#89](https://github.com/Gnzikoune/GEF/issues/89))
* implémenter module smart-cli.js avec routing des actions (analyze, chat, explain, suggest, audit)
* analyse contextuelle du projet avec calcul de score de conformité
* mode assistant conversationnel interactif (offline)
* explication détaillée des règles GEF avec exemples et références
* suggestions d'améliorations basées sur l'analyse du code
* audit en profondeur avec corrélation GEF/DORA
* mode offline garanti (basé sur ENGINEERING_PLAYBOOK.md)
* intégration CLI : npx create-gef smart <action>
* tests unitaires complets (25 tests passants après refactor)
* documentation complète (guides FR/EN, README)
* ADR-011 pour Smart CLI

---

## [1.18.0](https://github.com/Gnzikoune/GEF/compare/v1.17.1...v1.18.0) (2026-08-16)

### Features

* Extension System avec marketplace intégré ([#89](https://github.com/Gnzikoune/GEF/issues/89)) ([#97](https://github.com/Gnzikoune/GEF/issues/97)) ([9347abe](https://github.com/Gnzikoune/GEF/commit/9347abe6a4fce8138247b25c20fc62de958a80ca))

## [1.19.0](https://github.com/Gnzikoune/GEF/compare/v1.18.0...v1.19.0) (2026-08-16)


### Features

* ajouter DORA Metrics Enhancement avec analyse de tendances et benchmarks industriels ([#89](https://github.com/Gnzikoune/GEF/issues/89))
* implémenter le module dora.js avec calcul de CFR, MTTR et corrélation GEF/DORA
* ajouter les benchmarks industriels DORA (Elite, High, Medium, Low)
* intégrer CFR et MTTR dans le système de certification
* créer le module dora-trends.js pour l'analyse sur 30 jours
* ajouter la commande CLI `npx create-gef dora trends`
* générer des graphiques Mermaid pour visualiser les tendances
* créer l'ADR-010 pour documenter l'architecture DORA
* mettre à jour la documentation (README, guides d'utilisation)
* ajouter les tests unitaires pour DORA et DORA trends

---

## [1.18.0](https://github.com/Gnzikoune/GEF/compare/v1.17.0...v1.18.0) (2026-08-16)


### Features

* implémentation Extension System avec marketplace intégré ([#89](https://github.com/Gnzikoune/GEF/issues/89))
* ajout commande CLI `npx create-gef extension` (install, list, remove)
* 3 extensions par défaut : Healthcare (HIPAA), Finance (PCI-DSS), Security (OWASP)
* marketplace intégré pour extensions
* merge automatique des règles extension avec compliance.yml
* template d'extension pour contributions communautaires
* tests unitaires pour extension module (13 tests pass)
* documentation ADR-009 pour Extension System

---

## [1.17.1](https://github.com/Gnzikoune/GEF/compare/v1.17.0...v1.17.1) (2026-08-16)


### Bug Fixes

* remove broken certification badge from README ([#94](https://github.com/Gnzikoune/GEF/issues/94)) ([#95](https://github.com/Gnzikoune/GEF/issues/95)) ([1c96371](https://github.com/Gnzikoune/GEF/commit/1c963711c88386e64184e8b938f4f14889d80075))

---

## [1.17.0](https://github.com/Gnzikoune/GEF/compare/v1.16.0...v1.17.0) (2026-08-15)


### Features

* implémentation Certification System avec niveaux Bronze/Silver/Gold/Platinum ([#89](https://github.com/Gnzikoune/GEF/issues/89)) ([#92](https://github.com/Gnzikoune/GEF/issues/92)) ([d55d5cd](https://github.com/Gnzikoune/GEF/commit/d55d5cd5474a7ec4d5b03ba52b5f623445eedbb5))
* ajout commande CLI `npx create-gef certify` (check, generate)
* calcul score GEF et DORA pour certification
* génération badge SVG automatique pour README.md
* génération rapport public de certification
* 4 niveaux de certification avec critères DORA industry benchmarks
* tests unitaires pour certification module
* documentation ADR-008 pour Certification System

---

## [1.16.0](https://github.com/Gnzikoune/GEF/compare/v1.15.0...v1.16.0) (2026-08-16)


### Features

* implémentation Compliance as Code avec fichier compliance.yml ([#89](https://github.com/Gnzikoune/GEF/issues/89)) ([#90](https://github.com/Gnzikoune/GEF/issues/90)) ([069b058](https://github.com/Gnzikoune/GEF/commit/069b058f08c0e2f92142b93c9dd0e594c210a28c))

---

## Versions Antérieures

Pour l'historique complet des versions antérieures, voir :
[CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md)
