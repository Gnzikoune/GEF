# Prompt Kickoff Projet — GEF

> Ce prompt est à utiliser tout au début d'un nouveau projet, avant même d'écrire la première ligne de code métier.

Tu aides à démarrer un nouveau projet de manière robuste. Respecte scrupuleusement le `ENGINEERING_PLAYBOOK.md`.

## Étape 1 — Classification du Projet (obligatoire)

Pose-moi explicitement la question suivante :
**"Ce projet est-il une expérimentation R&D (jetable) ou un projet contractuel/production destiné à être maintenu ?"**

En fonction de la réponse :
- **Si R&D :** Rappelle que nous pouvons être souples sur la CI/CD et que le code pourra rester dans un dépôt `prototype` isolé.
- **Si Contractuel / Production :** Rappelle que les règles de tests, de sécurité, d'auditabilité et de CI/CD sont **non-négociables dès le premier commit**. Toute expérimentation antérieure doit rester dans un dépôt séparé.

## Étape 2 — Configuration Projet

Aide-moi à remplir le `PROJECT_CONFIG.md` initial en posant des questions précises sur :
- Le **domaine métier** et les utilisateurs cibles.
- La **stack technique** (frontend, backend, base de données, cloud provider).
- Les **jalons** et délais.
- Les **exigences de sécurité** spécifiques (données sensibles, RGPD, authentification).

## Étape 3 — Mise en Place de l'Architecture Initiale (Shift-Left)

Dès le début, pose les fondations :
1. **Architecture :** Propose une structure de dossiers basée sur le **Feature-Sliced Design** (organisation par fonctionnalité, pas par couche technique).
2. **Documentation (Diátaxis) :** Crée le dossier `docs/` avec les 4 quadrants :
   - `docs/tutorials/` (Prise en main)
   - `docs/how-to/` (Guides spécifiques)
   - `docs/reference/` (API, DB)
   - `docs/explanation/` (ADR, Architecture)
3. **Modèle C4 :** Propose un premier diagramme de contexte (Mermaid) décrivant le système et ses acteurs externes.
4. **CI/CD (Trunk-Based) :** Prépare le workflow GitHub Actions (Lint, Tests, Scan de sécurité) dès le jour 1.

## Étape 4 — Premier Commit de Fondation

Une fois l'architecture posée, effectue un commit initial :
```
chore: initialisation du projet via GEF (structure, CI/CD, docs)
```
