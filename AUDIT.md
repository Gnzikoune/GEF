# Audit du Guardian Engineering Framework (GEF)

**Date :** Juillet 2026  
**Portée :** Audit technique complet du framework GEF — conformité, sécurité, utilisabilité, vision stratégique.

---

## Synthèse Exécutive

Le GEF part d'un diagnostic solide : l'IA non gouvernée dégrade la dette technique (DORA 2025). L'architecture retenue (Playbook + PROJECT_CONFIG + templates) est saine.

**Problème structurel identifié :** le GEF mélange sous une bannière "Garantie Anti-Contournement" deux types de garanties de nature très différente :

| Type | Exemples | Fiabilité |
|------|----------|-----------|
| **Mécanique** | ESLint hard limits, hooks pre-commit, Gitleaks, Trivy | Fiable, indépendante de l'IA |
| **Comportementale** | `.cursorrules`, ADR, Feature-Sliced Design, Crash Clause | Dépend du LLM — maillon le moins fiable |

Tous les écarts découlent de ce mélange non déclaré.

---

## Constats Techniques par Sévérité

### 🔴 Critique

**Bug scaffold-stack.js (ligne 48)**
```javascript
const handler = handlers[stack];  // ❌ 'stack' non défini
```
**Impact :** Scaffolding systématiquement cassé.  
**Action :** Remplacer par `handlers[answers.stack]`.

**Écart promesse/réalité CI**
Le fichier `ci-templates/main.yml` contient des étapes factices (`echo "Couverture validée."`, "Trivy simulé"). Le générateur `scaffold-ci.js` produit un pipeline robuste, mais ce template statique crée de la confusion.  
**Action :** Supprimer ou renommer en `main.yml.example`.

**pr-intention-check.yml contournable**
```bash
if echo "$BODY" | grep -iqE "(intention|pourquoi)";
```
`Intention: n/a` passe le check. Cas d'école de la loi de Goodhart.  
**Action :** Exiger une longueur minimale ou validation LLM-judge.

### 🟠 Élevé

**Aucun SAST**
Gitleaks (secrets) et Trivy (CVE) ne détectent pas SQLi/XSS. Le §4 du Playbook reste non vérifié mécaniquement.  
**Action :** Ajouter Semgrep (`p/owasp-top-ten`) dans `buildSecurityScanBlock()`.

**Hard Limits inégales**

| Limite | ESLint | Biome | Ruff |
|--------|--------|-------|------|
| Lignes/fonction | ✅ | ❌ | ❌ |
| Paramètres max | ✅ | ❌ | ❌ |
| Complexité | ✅ (cyclomatique) | ✅ (cognitive) | ✅ (cyclomatique) |

Seul ESLint applique les 3 limites présentées comme universelles.  
**Action :** Uniformiser ou documenter l'asymétrie.

**Détection secrets locale naïve**
Hook `pre-commit` : regex simple rate JSON, clés multi-lignes, ne scanne pas l'historique.  
**Action :** Améliorer le regex ou déléguer à Gitleaks en local.

**Aucun gate déterministe pour ADR/architecture**
Rien en CI ne vérifie la présence d'un ADR quand une PR touche une dépendance majeure.  
**Action :** Ajouter un check CI sur les chemins sensibles.

**Synchronisation .cursorrules/.windsurfrules déléguée à l'IA**
Le `.cursorrules` instruit l'IA de copier vers `.windsurfrules` — dépend du bon vouloir du LLM.  
**Action :** Hook `diff .cursorrules .windsurfrules || exit 1`.

### 🟡 Moyen

**Échappatoires silencieuses**
`linter = 'Aucun'` fait disparaître les Hard Limits sans avertissement.  
**Action :** Avertissement explicite en CI.

**Sécurité/audit dépendances absents en tier Startup/R&D**
Choix défendable (progressivité), mais non documenté.  
**Action :** Documenter le compromis.

**Vérification ticket Kanban non authentifiée**
Hook `commit-msg` exige `#XYZ` sans vérifier via `gh issue view`.  
**Action :** Ajouter vérification GitHub CLI.

**Détection fichiers de debug fragile**
Convention `debug_`/`test_` ne détecte pas `console.log()`, `debugger;`, `.tmp`.  
**Action :** Étendre la détection.

### 🟢 Points Solides

- Hooks pre-commit/pre-push : blocage branche et Conventional Commits déterministes
- Propagation centralisée variables template ({{MAX_LINES}} etc.)
- Palier Mission Critical avec health-check et rollback automatique
- Crash Clause : bon principe comportemental (arrêt vs improvisation)

---

## Utilisabilité par Niveau

| Niveau | Verdict | Raison |
|--------|---------|--------|
| **Senior** | Utilisable | Maîtrise vocabulaire (SRP, DIP, Result Pattern) |
| **Intermédiaire** | Utilisable avec rodage | Mécanique Git/PR/CI OK ; ADR/Feature-Sliced nécessitent exemple |
| **Junior** | Non utilisable en autonomie | (1) Aucune pédagogie — `docs/tutorials/` vide ; (2) Tier Mission Critical trop strict pour débuter ; (3) Classification R&D vs Contractuel exige jugement senior |

---

## Recommandations de Refonte

**Verdict : ne pas repartir de zéro.** L'architecture est saine. Refonte ciblée sur la Brique F (Garantie Anti-Contournement).

1. **Scinder mécanique/comportemental** dans documentation et nommage — distinguer règles *garanties* (linter, CI) de règles *demandées* (ADR, architecture).
2. **Assurer l'hétérogénéité entre stacks** : publier matrice de support réelle, privilégier profondeur sur TypeScript/Node plutôt que largeur.
3. **Ajouter vérification du GEF par lui-même** : cohérence `.cursorrules`/`.windsurfrules`, présence ADR, avertissement `linter = 'Aucun'`. Synergie avec [[aiverify]].
4. **Séparer le produit par audience** : GEF v1 = outil seniors. Version "junior" dérivée assumée.

---

## Vision Stratégique : 3 Horizons

Repositionnement proposé : de scaffold à couche de gouvernance centrée sur le dépôt (indépendante des IDE/assistants IA).

**Point de vigilance :** L'ambition "Policy as Code" (Engineering Contracts, Evidence, Dashboard) représente plusieurs mois de développement vs quelques jours pour les correctifs immédiats. Ne pas présenter comme suite continue.

**Séquencement :**

1. **Maintenant (jours)** : 7 correctifs concrets (plan d'action ci-dessous)
2. **Ensuite (semaines)** : `gef doctor` — audit de l'existant (hooks, synchronisation, linter, secrets)
3. **Plus tard (mois, conditionné à traction)** : `policy.yaml`, Evidence, Agent Contracts, Dashboard

**Positionnement :** Réduire mention assistants IA au profit de "gouvernance d'ingénierie" est cohérent à 2 ans, mais risqué à court terme pour un package npm naissant. Glissement progressif, pas rebranding immédiat.

---

## Plan d'Action Immédiat

1. **Corriger bug scaffold-stack.js** : `handlers[answers.stack]`
2. **Ajouter Semgrep** (`p/owasp-top-ten`) dans `buildSecurityScanBlock()`
3. **Uniformiser Hard Limits** pour Biome/Ruff ou documenter asymétrie
4. **Avertissement explicite CI** quand `linter === 'Aucun'`
5. **Retirer `|| true`** du fallback flake8 ou documenter comme dégradation
6. **Check synchronisation** `.cursorrules`/`.windsurfrules` en pre-commit/CI
7. **Supprimer/renommer** `ci-templates/main.yml` pour éviter confusion
8. **Améliorer pr-intention-check.yml** : longueur minimale ou LLM-judge

---

## Conformité aux Propres Règles GEF

### ✅ Respectées
- Clean Code (SRP, fonctions découpées)
- Conventions nommage
- Git Flow (branches, Conventional Commits)
- Documentation Diátaxis
- Sécurité OWASP
- Feature-Sliced Design (structure générée)

### ❌ Non respectées
- **Tests** : Le framework n'a pas de tests lui-même
- **CI/CD complet** : Pas de workflow qualité pour le framework GEF

---

*Document généré selon Diátaxis (Explication) et conforme au ENGINEERING_PLAYBOOK.md*
