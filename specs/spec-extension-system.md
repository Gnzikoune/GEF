# Spec — Extension System

**Date:** 2026-08-16
**Auteur:** Devin (AI Assistant)
**Status:** Draft
**Issue:** À créer

---

## 1. Intent (Intention)

Créer un système d'extensions pour GEF qui permet à la communauté de contribuer des règles de gouvernance spécifiques par industrie, framework ou standard de sécurité. L'objectif est de rendre GEF extensible et modulaire, permettant aux utilisateurs d'installer des packs de règles prédéfinis au lieu de configurer manuellement compliance.yml.

## 2. Requirements (Exigences)

### 2.1. Requirements Fonctionnels

- **FR1** : Système d'extensions installables via CLI
- **FR2** : Extensions par industrie (Healthcare, Finance, GovTech)
- **FR3** : Extensions par framework (React, Node, Python, Rust)
- **FR4** : Extensions par sécurité (OWASP, GDPR, PCI-DSS, SOC2)
- **FR5** : Marketplace communautaire (GitHub registry)
- **FR6** : Commandes CLI `npx create-gef extension install/list/remove`
- **FR7** : Template pour créer des extensions facilement
- **FR8** : 3 extensions par défaut incluses dans GEF

### 2.2. Requirements Non-Fonctionnels

- **NFR1** : Extensions doivent être versionnées
- **NFR2** : Extensions doivent avoir des métadonnées (description, version, dépendances)
- **NFR3** : Installation d'extension doit mettre à jour compliance.yml
- **NFR4** : Désinstallation doit nettoyer compliance.yml proprement
- **NFR5** : Extensions doivent être testables

## 3. User Stories

### US1 - Installation d'extension
**En tant que** développeur  
**Je veux** installer une extension Healthcare  
**Afin de** que mon projet respecte automatiquement les règles HIPAA

### US2 - Listing des extensions
**En tant que** développeur  
**Je veux** lister les extensions disponibles  
**Afin de** découvrir des règles pertinentes pour mon domaine

### US3 - Création d'extension
**En tant que** contributeur  
**Je veux** créer une extension facilement  
**Afin de** partager mes règles avec la communauté

### US4 - Désinstallation d'extension
**En tant que** développeur  
**Je veux** désinstaller une extension  
**Afin de** nettoyer mon projet si l'extension n'est plus pertinente

## 4. Acceptance Criteria (Critères d'Acceptation)

- **AC1** : Le système d'extensions est fonctionnel
- **AC2** : 3 extensions par défaut sont fournies (Healthcare, Finance, Security)
- **AC3** : La commande `npx create-gef extension install <name>` fonctionne
- **AC4** : La commande `npx create-gef extension list` fonctionne
- **AC5** : La commande `npx create-gef extension remove <name>` fonctionne
- **AC6** : Les extensions mettent à jour compliance.yml
- **AC7** : Le template d'extension est documenté
- **AC8** : Les extensions sont testables

## 5. Out of Scope (Hors Périmètre)

- Marketplace web avec interface UI (Phase 2)
- Système de payement pour extensions premium (Phase 2)
- Review automatique des extensions soumises (Phase 2)
- Intégration avec GitHub Actions pour marketplace (Phase 2)

## 6. Constraints (Contraintes)

- Extensions doivent être compatibles avec compliance.yml existant
- Extensions ne doivent pas casser les règles GEF de base
- Extensions doivent respecter les Hard Limits du Playbook
- Extensions doivent être installables localement sans dépendance externe

## 7. Risks & Mitigations (Risques et Atténuations)

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Conflits entre extensions | High | Validation lors de l'installation |
| Extensions malveillantes | High | Marketplace GitHub avec review |
| Complexité excessive | Medium | Template et documentation claire |
| Maintenance difficile | Medium | Versioning et dépendances explicites |

---

*Conforme au ENGINEERING_PLAYBOOK.md (§10 Mode Feature)*