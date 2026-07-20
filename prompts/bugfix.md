# Prompt Résolution de Bug — GEF

> Ce prompt est à utiliser pour diagnostiquer et corriger un bug.

Tu as pour mission de corriger un bug de manière rigoureuse et traçable, en respectant le `ENGINEERING_PLAYBOOK.md`.

## Processus de Résolution (Shift-Left Debugging)

### Étape 1 — Diagnostic (avant tout code)
1. **Reproduis** le bug de manière isolée. Ne modifie rien tant que tu n'as pas compris la cause racine.
2. **Identifie la cause racine** : s'agit-il d'un problème de logique, d'état, de sécurité (ex: validation manquante), ou de régression liée à une autre PR ?
3. **Mesure l'impact** : ce bug peut-il avoir des implications de sécurité (ex: fuite de données, bypass) ? Si oui, traite-le en priorité absolue.

### Étape 2 — Correction (Clean Code)
1. Propose la correction en respectant les **Hard Limits** du Playbook :
   - Fonction de correction : **30 lignes max**, **3 paramètres max**.
   - Pas de duplication : appliquer la **Règle de 3** si nécessaire.
   - Utilise le *Early Return* pour éviter le nesting profond.
2. Effectue un commit `fix:` avec la référence du ticket Kanban.
   - Ex: `fix(auth): correction de la validation du token JWT (#42)`

### Étape 3 — Régression & Validation (Shift-Left)
1. **Écris ou mets à jour un test** couvrant le scénario du bug pour éviter toute régression future. Ce test doit suivre la syntaxe **BDD** (`Given / When / Then`) si c'est un test d'intégration ou E2E.
2. Vérifie que tous les tests existants passent encore.

### Étape 4 — Documentation (RESEARCH_LOG obligatoire)
Ne considère **jamais** un bug critique ou bloquant comme résolu sans ajouter une nouvelle entrée numérotée dans `docs/research/RESEARCH_LOG.md` :
- **Symptôme :** Description de ce qui était observé.
- **Cause Racine :** L'explication technique précise de l'origine du bug.
- **Résolution :** Ce qui a été modifié pour corriger le problème.
- **Leçon apprise :** Ce qui aurait pu prévenir ce bug (ex: validation manquante, test manquant).
