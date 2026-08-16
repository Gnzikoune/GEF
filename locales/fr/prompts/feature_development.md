# Prompt Développement de Fonctionnalité — GEF

> Ce prompt est à utiliser lors de la demande de développement d'une nouvelle fonctionnalité.

Tu dois implémenter la fonctionnalité demandée en respectant le `ENGINEERING_PLAYBOOK.md` :

1. **Branche et workflow (Réf. Playbook §5)**
   - Ne travaille jamais directement sur `main`. Nous devons être sur une branche `feat/<nom-fonctionnalite>`. 

2. **Traçabilité (Réf. Playbook §5)**
   - Implémente la fonctionnalité par petits incréments logiques.
   - Effectue des micro-commits fréquents avec des messages au format *Conventional Commits* (ex: `feat: ajout du bouton`, `test: tests unitaires bouton`).
   - Aucune modification massive non-commitée.

3. **Documentation continue (Réf. Playbook §6)**
   - Mets à jour le `README.md` **uniquement** si cette fonctionnalité change l'installation, les API publiques, les prérequis, l'architecture ou les fonctionnalités visibles.

4. **Pilotage Kanban et TDD (Réf. Playbook §7)**
   - Utilise `gh issue create` pour créer un ticket correspondant à la fonctionnalité.
   - Tous tes commits doivent inclure la référence du ticket (ex: `feat: ... (#12)`).
   - Avant d'écrire le code, écris le test E2E/Playwright décrivant le comportement (TDD).

5. **Auto-Documentation (Réf. Playbook §6)**
   - Si tu introduis une nouveauté architecturale, écris un ADR dans `docs/adr/`.

6. **Validation et Pull Request (Réf. Playbook §5)**
   - Une fois terminé et testé, n'essaie jamais de merger sur `main`.
   - Utilise `gh pr create` pour ouvrir la Pull Request (avec "Closes #XYZ").
   - Demande explicitement à l'utilisateur : "J'ai créé la PR, peux-tu la vérifier et la merger ?"

7. **Clean Code & Sécurité (Hard Limits) (Réf. Playbook §1 et §4)**
   - Respecte impérativement les **Hard Limits** :
     - **Fonctions :** {{MAX_LINES}} lignes max, {{MAX_PARAMS}} paramètres max.
     - **Complexité Cyclomatique :** <= {{MAX_COMPLEXITY}}.
     - **Nesting :** 3 niveaux max.
     - **Composants UI :** 200 lignes max (extraire la logique si > 50 lignes dans un Hook).
     - **Règle de 3 :** Si tu dupliques un morceau de code pour la 3ème fois, tu dois le refactoriser (abstraction).
     - **Sécurité :** Ne génère aucune faille. Valide toujours les inputs, limite les payloads JSON à {{MAX_PAYLOAD}}, et respecte l'expiration des tokens (JWT < 15 mins).

8. **Utilisation des Outils GEF (Réf. Playbook §8)**
   - Utilise `npx create-gef compliance generate` pour créer un fichier `compliance.yml` pour le projet
   - Utilise `npx create-gef compliance validate` pour vérifier les règles de conformité
   - Utilise `npx create-gef certify check` pour vérifier le niveau de certification possible
   - Utilise `npx create-gef extension install <nom>` pour installer des packs de règles spécifiques au domaine
   - Utilise `npx create-gef doctor` pour auditer la conformité du projet à tout moment
