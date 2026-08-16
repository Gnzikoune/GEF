# Spec — Governance-First Innovation

**Issue:** #89
**Date:** 2026-08-15
**Auteur:** IA Devin

---

## 1. Intent (Intention Métier)

Transformer GEF en framework de gouvernance coercitive différencié de Spec Kit (hard enforcement vs quality gates soft) pour attirer la communauté GitHub IA-first et devenir le standard de la gouvernance d'ingénierie.

## 2. Contexte

### Situation actuelle
- GEF est un package npm mature (v1.15.0) avec des fonctionnalités solides
- Core GEF fonctionne bien : CLI, hooks, CI/CD, prompts IA, audit continu
- GEF Cloud est en développement (Phase 1 MVP ~70% complet)

### Problème à résoudre
- **Différenciation insuffisante** : Spec Kit a 129k stars et 138 extensions
- **Écosystème limité** : Pas de marketplace d'extensions ou de presets
- **Manque d'innovation** : Pas de compliance as code, certification, smart CLI
- **DORA incomplet** : Change Failure Rate et Time to Restore non couverts mécaniquement

### Opportunité
Le marché des outils de gouvernance d'ingénierie est en croissance. GEF a un avantage unique : hard enforcement vs quality gates soft chez Spec Kit.

## 3. Requirements (Exigences Fonctionnelles)

### 3.1. Compliance as Code

- [ ] Fichier `compliance.yml` dans chaque projet généré
- [ ] Configuration déclarative des règles GEF
- [ ] Hard Limits déclaratives (max_lines, max_params, max_complexity, max_payload)
- [ ] DORA targets (deployment_frequency, lead_time_hours, change_failure_rate, time_to_restore_hours)
- [ ] Security rules (enforce_owasp, secret_detection, jwt_expiry)
- [ ] Versioning des règles (Git-friendly)
- [ ] Commande `npx create-gef compliance validate` pour vérifier compliance.yml

### 3.2. Certification System

- [ ] Niveaux de certification : Bronze, Silver, Gold, Platinum
- [ ] Critères par niveau (score de conformité GEF + métriques DORA)
- [ ] Badge GitHub automatique sur README.md
- [ ] Public compliance report (page publique)
- [ ] Audit trail (historique des scans et améliorations)
- [ ] Commande `npx create-gef certify --level=standard`

### 3.3. Extension System

- [ ] Système d'extensions pour GEF
- [ ] Extensions par industrie (Healthcare, Finance, GovTech)
- [ ] Extensions par framework (React, Node, Python, Rust)
- [ ] Extensions par sécurité (OWASP, GDPR, PCI-DSS, SOC2)
- [ ] Community marketplace
- [ ] Commandes `npx create-gef extension install/list/remove`
- [ ] Contribution system facile

### 3.4. Smart CLI

- [ ] `npx create-gef chat` : Assistant IA pour configuration
- [ ] `npx create-gef explain` : Expliquer pourquoi une règle existe
- [ ] `npx create-gef suggest` : Suggérer des améliorations
- [ ] `npx create-gef audit` : Audit en profondeur avec recommandations
- [ ] Context-aware : Comprend le contexte du projet

### 3.5. DORA Metrics Complètes

- [ ] **Change Failure Rate** : Couverture mécanique (au-delà Semgrep)
- [ ] **Time to Restore** : Mécanisme de tracking automatique
- [ ] Benchmarking industrie (Elite, High, Medium, Low)
- [ ] Trend charts (visualisation)
- [ ] Corrélation compliance/performance

### 3.6. Documentation et Écosystème

- [ ] Quick Start Guide à la Spec Kit
- [ ] Community walkthroughs pour différents cas d'usage
- [ ] Guides de contribution communautaire
- [ ] Documentation premium (guides, walkthroughs)
- [ ] Community marketplace (extensions contributées)

## 4. Acceptance Criteria (Critères d'Acceptation)

### Compliance as Code
- [AC1] compliance.yml est généré dans chaque projet
- [AC2] compliance.yml est Git-friendly et versionnable
- [AC3] La commande validate vérifie la conformité du fichier
- [AC4] Les règles sont appliquées mécaniquement via hooks et CI

### Certification System
- [AC5] Les 4 niveaux de certification sont implémentés
- [AC6] Les badges GitHub sont générés automatiquement
- [AC7] Les rapports publics sont accessibles
- [AC8] L'audit trail est fonctionnel

### Extension System
- [AC9] Le système d'extensions est fonctionnel
- [AC10] Au moins 3 extensions par défaut (Healthcare, Finance, OWASP)
- [AC11] La marketplace communautaire est accessible
- [AC12] La contribution est facile

### Smart CLI
- [AC13] Les 4 commandes smart sont implémentées
- [AC14] L'assistant IA est context-aware
- [AC15] Les explications sont compréhensibles
- [AC16] Les suggestions sont pertinentes

### DORA Metrics
- [AC17] Change Failure Rate est couvert mécaniquement
- [AC18] Time to Restore est couvert mécaniquement
- [AC19] Le benchmarking industrie est implémenté
- [AC20] Les trend charts sont fonctionnels

## 5. Non-Requirements (Hors Périmètre)

- GEF Cloud (projet séparé, priorité après GEF core)
- Replacement de Spec Kit (complémentaire, pas concurrent)
- SaaS features (réservé à GEF Cloud)
- Features enterprise (SSO, RBAC, SOC2 - réservé à GEF Cloud)

## 6. Technical Notes

### 6.1. Stack
- **Core** : Node.js, TypeScript, YAML (js-yaml)
- **Smart CLI** : Intégration avec IA (OpenAI ou Anthropic API)
- **Extensions** : NPM packages pour extensions
- **Documentation** : Markdown + Mermaid.js

### 6.2. Architecture

```
GEF Core
├── Compliance as Code
│   ├── compliance.yml (déclaratif)
│   ├── validator (parser + validation)
│   └── applier (hooks + CI)
├── Certification System
│   ├── certifier (calcul score)
│   ├── badge generator (SVG)
│   └── report generator (public)
├── Extension System
│   ├── extension manager (install/list/remove)
│   ├── marketplace (registry)
│   └── contribution templates
├── Smart CLI
│   ├── chat assistant (IA)
│   ├── explain engine (documentation)
│   ├── suggest engine (recommendations)
│   └── audit engine (deep analysis)
└── DORA Metrics
    ├── change failure rate (tracking)
    ├── time to restore (tracking)
    ├── benchmarking (industry standards)
    └── trend charts (visualization)
```

### 6.3. Dependencies
- `js-yaml` : Parser compliance.yml
- `axios` : Appels API pour smart CLI (IA)
- `chalk` : Coloration console
- `inquirer` : CLI interactif
- `commander` : CLI framework

## 7. Risques et Mitigations

| Risque | Mitigation |
|--------|------------|
| Complexité accrue du framework | Modularisation, tests complets, documentation |
| Adoption faible (trop complexe) | Backward compatibility, migration guide, presets |
| Smart CLI dépendance IA | Fallback sans IA, mode offline, local-first |
| Marketplace peu active | Extensions officielles de départ, incentives communautaires |
| Performance (compliance.yml parsing) | Optimisation, cache, validation async |

## 8. Modèle Business (Open-Source)

- **Core GEF** : Open-source MIT (gratuit)
- **Extensions** : Open-source (contributions communautaires)
- **Premium Extensions** : Optionnelles (future monétisation via GEF Cloud)
- **Smart CLI** : Gratuït avec API keys utilisateur (future monétisation)

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*