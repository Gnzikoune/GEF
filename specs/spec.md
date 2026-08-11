# Spec — Commande gef doctor

**Issue:** #81
**Date:** 2026-08-11
**Auteur:** IA Devin

---

## 1. Intent (Intention Métier)

Permettre aux développeurs d'auditer un projet existant pour vérifier sa conformité au Guardian Engineering Framework (GEF). Cette commande diagnostique la cohérence de la gouvernance mise en place et identifie les incohérences potentielles.

## 2. Contexte

Le GEF est devenu une infrastructure de gouvernance agnostique qui s'installe sur des projets existants (n'importe quelle stack). Actuellement, aucun outil ne permet de vérifier si un projet respecte bien les règles du framework après son installation, ni de diagnostiquer des problèmes de configuration.

Cette commande est utile pour :
- Les développeurs qui veulent vérifier que leur projet est correctement configuré
- Les équipes qui onboarding de nouveaux membres sur un projet GEF
- Les migrations vers GEF (vérifier que tout est en place)

## 3. Requirements (Exigences Fonctionnelles)

### 3.1. Commande CLI

La commande `npx create-gef doctor` doit être disponible depuis n'importe quel répertoire de projet.

### 3.2. Vérifications Effectuées

Le doctor doit vérifier les éléments suivants et afficher un rapport structuré (✅ / ❌ / ⚠️) :

#### A. Fichiers de Règles IA
- [ ] `.cursorrules` existe
- [ ] `.windsurfrules` existe
- [ ] `.cursorrules` et `.windsurfrules` sont synchronisés (diff = 0)
- [ ] Aucun placeholder non résolu (`{{MAX_LINES}}`, `{{MAX_PARAMS}}`, etc.) dans ces fichiers

#### B. Fichiers Obligatoires
- [ ] `ENGINEERING_PLAYBOOK.md` ou `.gef/ENGINEERING_PLAYBOOK.md` existe
- [ ] `PROJECT_CONFIG.md` existe
- [ ] `CONTEXT.md` existe
- [ ] `docs/research/RESEARCH_LOG.md` existe

#### C. Configuration Git
- [ ] `.git/hooks/pre-commit` existe et est exécutable
- [ ] `.git/hooks/pre-push` existe et est exécutable
- [ ] `.git/hooks/commit-msg` existe et est exécutable
- [ ] Stratégie Git détectée (GitHub Flow / Trunk-Based / Autre)

#### D. Configuration CI/CD
- [ ] `.github/workflows/` existe
- [ ] Au moins un workflow GitHub Actions est présent
- [ ] Étapes de validation GEF présentes (lint, tests, security)

#### E. Configuration du Linter
- [ ] Linter détecté (ESLint, Biome, Ruff, Pylint, ou aucun)
- [ ] Configuration du linter présente (.eslintrc, biome.json, ruff.toml, etc.)
- [ ] Hard Limits appliquées dans la configuration (si applicable)

### 3.3. Comportement

- Si le projet n'est pas configuré avec GEF : afficher un message informatif "Ce projet n'est pas configuré avec GEF"
- Si des incohérences sont détectées : afficher un rapport avec les problèmes identifiés
- Si tout est OK : afficher un message de succès

### 3.4. Format de Sortie

Le rapport doit être structuré et lisible en console :

```
🩺 GEF Doctor — Audit de Conformité

📁 Fichiers de Règles IA
✅ .cursorrules existe
✅ .windsurfrules existe
❌ .cursorrules et .windsurfrules désynchronisés
⚠️ Placeholders non résolus détectés

📄 Fichiers Obligatoires
✅ ENGINEERING_PLAYBOOK.md existe
❌ PROJECT_CONFIG.md manquant
...

📊 Score de Conformité : 7/10 (70%)
```

## 4. Acceptance Criteria (Critères d'Acceptation)

- [AC1] La commande `npx create-gef doctor` s'exécute sans erreur depuis n'importe quel répertoire
- [AC2] Elle affiche un rapport structuré avec des emojis (✅ / ❌ / ⚠️) pour chaque vérification
- [AC3] Elle fonctionne correctement sur un projet configuré avec GEF (toutes les vérifications passent)
- [AC4] Elle détecte les incohérences (ex: .cursorrules != .windsurfrules)
- [AC5] Elle fonctionne sur un projet non configuré (message informatif)
- [AC6] Elle détecte les placeholders non résolus dans les fichiers de règles
- [AC7] Elle calcule et affiche un score de conformité (pourcentage)

## 5. Non-Requirements (Hors Périmètre)

- Modification automatique des fichiers (le doctor est read-only)
- Installation ou réparation automatique des composants GEF
- Vérification du contenu du code applicatif (la conformité du code métier est du ressort des hooks et CI)
- Support de systèmes de CI autres que GitHub Actions

## 6. Technical Notes

### 6.1. Implémentation

- Créer `generator/features/doctor.js` avec les fonctions de vérification
- Intégrer la commande dans `generator/cli/index.js` via Inquirer.js
- Réutiliser la logique de `scripts/verify-self.js` pour certaines vérifications (placeholders, synchronisation)

### 6.2. Dépendances

- `fs` (Node.js natif) pour la lecture de fichiers
- `chalk` pour la coloration console
- `diff` ou équivalent pour comparer .cursorrules et .windsurfrules

### 6.3. Structure

```javascript
// generator/features/doctor.js
module.exports = async function doctor() {
  const checks = {
    aiRules: checkAIRules(),
    mandatoryFiles: checkMandatoryFiles(),
    gitConfig: checkGitConfig(),
    ciConfig: checkCIConfig(),
    linterConfig: checkLinterConfig()
  };
  
  displayReport(checks);
};
```

## 7. Risques et Mitigations

| Risque | Mitigation |
|--------|------------|
| Faux positifs (détection de problèmes qui n'en sont pas) | Ajouter des messages explicatifs clairs pour chaque vérification |
| Performance sur très gros projets | Limiter les vérifications aux fichiers de configuration uniquement |
| Différentes structures de projets | Rendre les vérifications flexibles (chemins relatifs, patterns) |

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*
