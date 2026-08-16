# Plan d'Implémentation — Governance-First Innovation

**Issue:** #89
**Spec:** specs/spec-governance-first-innovation.md
**Date:** 2026-08-15

---

## 1. Design Architecture

### 1.1. Structure du Module

```
generator/
├── features/
│   ├── compliance.js          ← Nouveau (Compliance as Code)
│   ├── certification.js       ← Nouveau (Certification System)
│   ├── extensions.js          ← Nouveau (Extension System)
│   ├── smart-cli.js           ← Nouveau (Smart CLI)
│   └── dora-metrics.js        ← Nouveau (DORA Metrics Complètes)
├── cli/
│   ├── index.js               ← Modification (ajout commandes smart)
│   └── questions.js           ← Modification (ajout options compliance)
├── templates/
│   ├── compliance.yml         ← Nouveau (template compliance.yml)
│   └── extension-template.js  ← Nouveau (template extensions)
└── extensions/                ← Nouveau (dossier extensions)
    ├── healthcare/
    ├── finance/
    └── security/
```

### 1.2. Flux d'Exécution

```
npx create-gef compliance validate
    ↓
Parser compliance.yml
    ↓
Validator YAML schema
    ↓
Applier (hooks + CI check)
    ↓
Rapport de conformité

npx create-gef certify --level=standard
    ↓
Calcul score GEF (doctor)
    ↓
Calcul métriques DORA
    ↓
Détermination niveau certification
    ↓
Génération badge + rapport public

npx create-gef extension install healthcare
    ↓
Vérification extension marketplace
    ↓
Installation extension (npm ou local)
    ↓
Application règles extension
    ↓
Mise à jour compliance.yml

npx create-gef chat
    ↓
Context-aware analysis (lecture fichiers projet)
    ↓
Appel IA API (OpenAI/Anthropic)
    ↓
Suggestions et assistance
    ↓
Application ou affichage suggestions
```

### 1.3. Réutilisation de Code Existant

- `generator/features/doctor.js` : Pour calcul score GEF
- `generator/features/setup-ci.js` : Pour appliquer compliance.yml dans CI
- `generator/features/setup-git.js` : Pour appliquer compliance.yml dans hooks
- `scripts/verify-self.js` : Pour validation interne

---

## 2. Tâches Détaillées

### Tâche 1 : Compliance as Code

**Fichier :** `generator/features/compliance.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `generateComplianceTemplate()` :
  - Créer template compliance.yml
  - Inclure Hard Limits (max_lines, max_params, max_complexity, max_payload)
  - Inclure DORA targets
  - Inclure security rules
- [ ] Implémenter `validateComplianceFile()` :
  - Parser compliance.yml (js-yaml)
  - Valider schema YAML
  - Vérifier cohérence avec ENGINEERING_PLAYBOOK.md
- [ ] Implémenter `applyComplianceToHooks()` :
  - Modifier hooks pour lire compliance.yml
  - Appliquer hard limits depuis compliance.yml
- [ ] Implémenter `applyComplianceToCI()` :
  - Modifier CI pour lire compliance.yml
  - Appliquer validation compliance.yml dans pipeline
- [ ] Intégrer dans CLI : `npx create-gef compliance validate`

**Critère de succès :** compliance.yml est généré et validé correctement.

---

### Tâche 2 : Certification System

**Fichier :** `generator/features/certification.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `calculateGEFScore()` :
  - Réutiliser doctor.js pour calculer score GEF
  - Normaliser score (0-100%)
- [ ] Implémenter `calculateDORAScore()` :
  - Calculer les 4 métriques DORA
  - Comparer avec benchmarks industrie
  - Normaliser score (0-100%)
- [ ] Implémenter `determineCertificationLevel()` :
  - Bronze : GEF ≥ 60%, DORA ≥ 40%
  - Silver : GEF ≥ 70%, DORA ≥ 60%
  - Gold : GEF ≥ 85%, DORA ≥ 80%
  - Platinum : GEF ≥ 95%, DORA ≥ 95%
- [ ] Implémenter `generateBadge()` :
  - Génération SVG badge
  - Inclusion README.md automatique
- [ ] Implémenter `generatePublicReport()` :
  - Page HTML statique avec détails certification
  - Audit trail (historique scans)
- [ ] Intégrer dans CLI : `npx create-gef certify --level=standard`

**Critère de succès :** Certification fonctionne et badges sont générés.

---

### Tâche 3 : Extension System

**Fichier :** `generator/features/extensions.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Créer template extension :
  - Structure package.json pour extension
  - Schema extension (metadata, rules, compliance)
- [ ] Implémenter `installExtension()` :
  - Vérifier marketplace (registry GitHub ou npm)
  - Télécharger extension
  - Appliquer règles extension
  - Mettre à jour compliance.yml
- [ ] Implémenter `listExtensions()` :
  - Lister extensions installées
  - Lister extensions disponibles marketplace
- [ ] Implémenter `removeExtension()` :
  - Désinstaller extension
  - Nettoyer compliance.yml
- [ ] Créer 3 extensions par défaut :
  - Healthcare (règles HIPAA)
  - Finance (règles PCI-DSS)
  - Security (règles OWASP étendues)
- [ ] Intégrer dans CLI : `npx create-gef extension install/list/remove`

**Critère de succès :** Extension system fonctionne avec 3 extensions par défaut.

---

### Tâche 4 : Smart CLI

**Fichier :** `generator/features/smart-cli.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `chatAssistant()` :
  - Lecture contexte projet (fichiers, config)
  - Appel IA API (OpenAI/Anthropic)
  - Suggestions de configuration
  - Application automatique (optionnel)
- [ ] Implémenter `explainRule()` :
  - Explication détaillée d'une règle GEF
  - Référence ENGINEERING_PLAYBOOK.md
  - Exemples et contre-exemples
- [ ] Implémenter `suggestImprovements()` :
  - Analyse code existant
  - Suggestions basées sur GEF
  - Priorisation par impact
- [ ] Implémenter `deepAudit()` :
  - Audit en profondeur + recommandations
  - Corrélation compliance/performance
  - Plan d'amélioration priorisé
- [ ] Intégrer dans CLI : `npx create-gef chat/explain/suggest/audit`

**Critère de succès :** Smart CLI fonctionne avec IA et mode offline.

---

### Tâche 5 : DORA Metrics Complètes

**Fichier :** `generator/features/dora-metrics.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `trackChangeFailureRate()` :
  - Détection hotfixes et rollbacks
  - Tracking automatique via Git tags
  - Calcul % échecs production
- [ ] Implémenter `trackTimeToRestore()` :
  - Détection incidents (tags incident-* ou similar)
  - Calcul temps résolution
  - Tracking automatique
- [ ] Implémenter `benchmarkAgainstIndustry()` :
  - Standards DORA (Elite, High, Medium, Low)
  - Comparaison automatique
  - Rapport d'écart
- [ ] Implémenter `generateTrendCharts()` :
  - Collecte historique métriques
  - Génération graphiques (Mermaid.js ou Chart.js)
  - Visualisation dans rapport
- [ ] Intégrer dans doctor et certification

**Critère de succès :** DORA metrics complètes et benchmarking fonctionnel.

---

### Tâche 6 : Documentation et Écosystème

**Fichiers :** `docs/tutorials/`, `docs/how-to/`, `docs/explanation/`

**Sous-tâches :**
- [ ] Créer Quick Start Guide (style Spec Kit)
- [ ] Créer walkthroughs pour différents cas d'usage
- [ ] Créer guides de contribution communautaire
- [ ] Créer documentation premium (guides, walkthroughs)
- [ ] Mettre à jour README.md avec nouvelles features
- [ ] Créer examples d'extensions
- [ ] Créer templates contribution extensions

**Critère de succès :** Documentation complète et accessible.

---

## 3. Ordre d'Exécution

1. **Tâche 1** : Compliance as Code (fondation)
2. **Tâche 2** : Certification System (dépend de Compliance)
3. **Tâche 3** : Extension System (dépend de Compliance)
4. **Tâche 5** : DORA Metrics Complètes (parallèle à Tâche 2-3)
5. **Tâche 4** : Smart CLI (dépend de Compliance et DORA)
6. **Tâche 6** : Documentation et Écosystème (tout au long)

---

## 4. Critères de Validation

- [AC1] compliance.yml est généré et validé
- [AC2] Certification System fonctionne avec 4 niveaux
- [AC3] Extension System fonctionne avec 3 extensions par défaut
- [AC4] Smart CLI fonctionne avec IA et mode offline
- [AC5] DORA metrics complètes sont implémentées
- [AC6] Documentation est complète et accessible
- [AC7] Tests unitaires pour chaque module
- [AC8] Tests E2E pour workflows critiques
- [AC9] Backward compatibility maintenue
- [AC10] Performance acceptable (< 2s pour commandes)

---

## 5. Estimation

- Tâche 1 (Compliance as Code) : 2 jours
- Tâche 2 (Certification System) : 3 jours
- Tâche 3 (Extension System) : 4 jours
- Tâche 4 (Smart CLI) : 3 jours
- Tâche 5 (DORA Metrics Complètes) : 3 jours
- Tâche 6 (Documentation) : 2 jours

**Total estimé :** 17 jours (~3.5 semaines)

---

## 6. Risques et Mitigations

| Risque | Mitigation |
|--------|------------|
| Complexité accrue | Modularisation, tests complets |
| Performance | Optimisation, cache, async |
| Adoption difficile | Backward compatibility, migration guide |
| Smart CLI dépendance IA | Fallback sans IA, mode offline |
| Marketplace inactive | Extensions officielles, incentives |

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*