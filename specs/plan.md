# Plan d'Implémentation — Commande gef doctor

**Issue:** #81
**Spec:** specs/spec.md
**Date:** 2026-08-11

---

## 1. Design Architecture

### 1.1. Structure du Module

```
generator/
├── features/
│   └── doctor.js          ← Nouveau fichier (logique du doctor)
├── cli/
│   ├── index.js           ← Modification (ajout commande doctor)
│   └── questions.js       ← Modification (ajout option doctor)
```

### 1.2. Flux d'Exécution

```
npx create-gef doctor
    ↓
CLI détecte la commande "doctor"
    ↓
Appel generator/features/doctor.js
    ↓
Exécution des vérifications (checks)
    ↓
Génération du rapport
    ↓
Affichage console avec score
```

### 1.3. Réutilisation de Code Existant

- `scripts/verify-self.js` : Logique de détection des placeholders et synchronisation .cursorrules/.windsurfrules
- `generator/features/setup-*.js` : Connaissance des structures de fichiers générés

---

## 2. Tâches Détaillées

### Tâche 1 : Créer le module doctor.js

**Fichier :** `generator/features/doctor.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `checkAIRules()` :
  - Vérifier existence .cursorrules et .windsurfrules
  - Comparer les deux fichiers (diff)
  - Détecter les placeholders {{...}}
- [ ] Implémenter `checkMandatoryFiles()` :
  - Vérifier ENGINEERING_PLAYBOOK.md
  - Vérifier PROJECT_CONFIG.md
  - Vérifier CONTEXT.md
  - Vérifier docs/research/RESEARCH_LOG.md
- [ ] Implémenter `checkGitConfig()` :
  - Vérifier existence des hooks dans .git/hooks/
  - Détecter la stratégie Git (GitHub Flow vs Trunk-Based)
- [ ] Implémenter `checkCIConfig()` :
  - Vérifier existence .github/workflows/
  - Analyser les workflows pour détecter les étapes GEF
- [ ] Implémenter `checkLinterConfig()` :
  - Détecter le linter présent (ESLint, Biome, Ruff, etc.)
  - Vérifier la configuration
- [ ] Implémenter `displayReport()` :
  - Affichage structuré avec emojis
  - Calcul du score de conformité
  - Messages explicatifs

**Critère de succès :** Le module peut être appelé en isolation et affiche un rapport.

---

### Tâche 2 : Intégrer la commande dans le CLI

**Fichier :** `generator/cli/index.js`

**Sous-tâches :**
- [ ] Ajouter l'option "doctor" dans le menu principal
- [ ] Ajouter la logique de routage vers `doctor.js`
- [ ] Gérer le cas où l'utilisateur n'est pas dans un répertoire Git

**Critère de succès :** `npx create-gef doctor` exécute le doctor.

---

### Tâche 3 : Mettre à jour la documentation

**Fichiers :** `README.md`, `README.en.md`

**Sous-tâches :**
- [ ] Ajouter la commande doctor dans le tableau des commandes disponibles
- [ ] Ajouter une section dédiée "Le Doctor GEF"
- [ ] Documenter les codes de sortie (✅ / ❌ / ⚠️)

**Critère de succès :** La documentation mentionne la nouvelle commande.

---

### Tâche 4 : Tests manuels

**Sous-tâches :**
- [ ] Tester sur un projet configuré avec GEF (le dépôt GEF lui-même)
- [ ] Tester sur un projet non configuré (dossier vide)
- [ ] Tester sur un projet avec incohérences (modifier .windsurfrules manuellement)
- [ ] Vérifier que le score de conformité est correct

**Critère de succès :** Tous les scénarios fonctionnent comme attendu.

---

## 3. Ordre d'Exécution

1. **Tâche 1** : Créer doctor.js (fondation)
2. **Tâche 2** : Intégrer dans le CLI (raccordement)
3. **Tâche 3** : Mettre à jour la documentation (communication)
4. **Tâche 4** : Tests manuels (validation)

---

## 4. Critères de Validation

- [AC1] `npx create-gef doctor` fonctionne depuis n'importe quel répertoire
- [AC2] Rapport structuré avec emojis (✅ / ❌ / ⚠️)
- [AC3] Fonctionne sur projet configuré avec GEF
- [AC4] Détecte les incohérences (.cursorrules != .windsurfrules)
- [AC5] Fonctionne sur projet non configuré
- [AC6] Détecte les placeholders non résolus
- [AC7] Affiche un score de conformité

---

## 5. Estimation

- Tâche 1 : 1.5h
- Tâche 2 : 0.5h
- Tâche 3 : 0.5h
- Tâche 4 : 0.5h

**Total estimé :** 3 heures

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*
