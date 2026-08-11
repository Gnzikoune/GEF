# Plan d'Implémentation — Résolution de l'Audit GEF (19 Issues)

Ce document est le plan vivant de la résolution des 19 issues identifiées lors de l'audit GEF. Il ne doit jamais être écrasé — chaque phase s'y ajoute.

---

## Phase 1 — Bugs Bloquants du Générateur ✅ TERMINÉE

**Branche :** fix/audit-phase-1 | **PR :** #72

- [x] Bug #1 : Injection de applyTemplating() dans setup-ai-rules.js pour résoudre les placeholders {{MAX_LINES}} etc.
- [x] Bug #2 : Traduction intégrale en anglais de locales/en/.cursorrules (section Agentic SDD corrompue).
- [x] Bug #5 : Suppression de la copie obsolète des prompts/*.md dans setup-gef.js.
- [x] Bug #6 : Correction du commentaire d'en-tête dans setup-ci.js (scaffold-ci.js → setup-ci.js).
- [x] RESEARCH_LOG mis à jour.

---

## Phase 2 — Audit Continu & Métriques DORA Elite ✅ TERMINÉE

**Branche :** feat/verify-self-dora | **PR :** #73

> **NOTE** : Le DORA "Elite" n'est pas une mention textuelle — c'est un niveau mesuré sur 4 métriques concrètes. Deux d'entre elles sont encore non couvertes mécaniquement dans GEF.

| Métrique DORA | Niveau Elite | Status GEF |
|---------------|--------------|------------|
| Deployment Frequency | Plusieurs fois/jour | ✅ CI/CD sur chaque PR |
| Lead Time for Changes | < 1 heure | ✅ Branches courtes + PR |
| Change Failure Rate | < 5% | ❌ SAST partiel (SQLi/XSS non couverts) |
| Time to Restore | < 1 heure | ❌ Synchronisation cursorrules déléguée à l'IA |

### Lot A — Script verify-self (priorité haute — demande explicite)

- [x] [NEW] scripts/verify-self.js — Script Node.js autonome qui vérifie la cohérence interne du GEF :
  - [x] Détection de placeholders non résolus ({{MAX_LINES}} etc.) dans les fichiers des locales et des hooks.
  - [x] Cohérence de version : package.json#version == badge README.md.
  - [x] Synchronisation .cursorrules == .windsurfrules (déterministe, remplace la délégation à l'IA).
  - [x] Présence des fichiers obligatoires : ENGINEERING_PLAYBOOK.md, CONTEXT.md, docs/research/RESEARCH_LOG.md.
- [x] [MODIFY] package.json — Ajouter "verify-self": "node scripts/verify-self.js" dans scripts et l'inclure dans "test".
- [x] [MODIFY] .github/workflows/gef-ci.yml — Ajouter l'étape npm run verify-self dans le pipeline CI du GEF.

### Lot B — SAST Semgrep (Change Failure Rate)

- [x] [MODIFY] generator/features/setup-ci.js — Ajouter Semgrep (p/owasp-top-ten) dans buildSecurityScanBlock() pour couvrir SQLi/XSS mécaniquement.

### Lot C — Synchronisation .cursorrules/.windsurfrules mécanique

- [x] [MODIFY] generator/features/setup-git.js — Ajouter dans le hook pre-commit généré :
  ```bash
  if ! diff -q .cursorrules .windsurfrules > /dev/null 2>&1; then
    echo "Erreur: .cursorrules et .windsurfrules désynchronisés."
    exit 1
  fi
  ```
- [x] [MODIFY] hooks/pre-commit (GEF lui-même) — Idem, pour que GEF s'applique ses propres règles.

### Lot D — Description obligatoire dans commit-msg (demande audio)

- [x] [MODIFY] hooks/commit-msg et [MODIFY] generator/features/setup-git.js — Bloquer si le body du commit (lignes après la ligne 1, hors commentaires #) est vide.

### Lot E — Avertissement CI si linter = 'Aucun'

- [x] [MODIFY] generator/features/setup-ci.js — Ajouter un step CI visible (non bloquant) quand aucun linter n'est configuré.

---

## Phase 3 — Cohérence Documentaire ✅ TERMINÉE

**Branche :** docs/audit-coherence | **PR :** #75

- [x] Bug #3 : Mettre à jour l'arborescence dans README.md et README.en.md.
- [x] Bug #7 : Harmoniser les Hard Limits entre ESLint, Biome et Ruff (ou documenter l'asymétrie).
- [x] Bug #8 : Nettoyer .agents/AGENTS.md — retirer mentions non instrumentées.
- [x] Bug #9 : Vérifier que CHANGELOG.md est à jour après chaque PR de correctif.
- [x] Bug #10 : Aligner PROJECT_CONFIG.template.md avec les nouvelles réponses du générateur interactif.

---

## Phase 4 — CI/CD Avancé & Tests ✅ TERMINÉE

**Branche :** feat/phase4-advanced-ci | **PR :** #77

Cette phase finalise l'implémentation de la "Gouvernance Mécanique" en durcissant le CI/CD et en testant le générateur.

### Lot A — Validation Intention & Kanban

- [x] [MODIFY] generator/features/setup-ci.js
  - [x] Bug #11 (pr-intention-check) : Ajouter un check dans la CI générée (GEF Compliance) qui vérifie si le corps de la PR (github event) contient une section ## Intention remplie, et échoue sinon.
  - [x] Bug #16 (ADR-check CI) : Ajouter dans la CI générée un bloc : si package.json est modifié (nouvelle dépendance), vérifier qu'il y a des fichiers récents dans docs/explanation/adr/ (ou ne faire qu'un avertissement).

- [x] [MODIFY] hooks/commit-msg & generator/features/setup-git.js
  - [x] Bug #13 (Kanban check) : Actuellement la regex vérifie (#\d+). On pourrait ajouter un check via gh issue view $TICKET (si gh est dispo) pour vérifier que le ticket existe bien, sinon un avertissement. (Le faire de façon non-bloquante pour ne pas bloquer les commits offline).

### Lot B — Détection Améliorée (Debug & Secrets)

- [x] [MODIFY] hooks/pre-commit & generator/features/setup-git.js
  - [x] Bug #14 (Debug files) : Ajouter un grep pour bloquer les commits contenant console.log(, debugger;, TODO: non résolus, ou des fichiers temporaires .tmp.
  - [x] Bug #17 (Secrets local) : Ajouter une regex robuste pour détecter les secrets probables (ex: sk-[a-zA-Z0-9]{48}, mots de passe, tokens API hardcodés) avant le commit.

### Lot C — Documentation Stratégique

- [x] Bug #12 (ci-templates) : Introuvable dans le dépôt actuel (le générateur écrit le fichier inline). On ignore/valide ce point.
- [x] Bug #15 (ADR Startup vs R&D) : Créer un ADR officiel docs/explanation/adr/ADR-005-compromis-startup.md expliquant comment adapter le GEF pour des projets très "R&D" (assouplissement de certaines limites).
- [x] Bug #18 (Tutorial Junior) : Créer docs/tutorials/getting-started.md pour expliquer pas-à-pas à un développeur junior comment coder sous l'égide du GEF (le cycle : Issue -> PR -> Agent -> Validation).

### Lot D — Tests du Framework GEF

- [x] Bug #19 (Unit tests) : Créer un dossier tests/ avec quelques tests natifs Node.js (node:test) pour valider les fonctions pures du GEF (comme applyTemplating ou le check de version de verify-self.js).
- [x] Mettre à jour package.json pour lancer ces tests avec npm test.

---

## Statut Global

| Phase | Issues | Statut |
|-------|--------|--------|
| Phase 1 | #1, #2, #5, #6 | ✅ PR #72 |
| Phase 2 | #4, #17 (DORA) | ✅ PR #73 |
| Phase 3 | #3, #7, #8, #9, #10 | ✅ PR #75 |
| Phase 4 | #11, #13–#16, #18, #19 | ✅ PR #77 |

---

**Conclusion :** Toutes les phases de l'audit sont terminées. Le GEF est maintenant aligné avec ses propres règles et les métriques DORA Elite sont partiellement atteintes (il reste les tests E2E pour la couverture complète).
