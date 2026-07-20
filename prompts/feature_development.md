# Prompt Développement de Fonctionnalité — GEF

> Ce prompt est à utiliser lors de la demande de développement d'une nouvelle fonctionnalité.

Tu dois implémenter la fonctionnalité demandée en respectant le `ENGINEERING_PLAYBOOK.md` :

1. **Branche et workflow (Réf. Playbook §13)**
   - Ne travaille jamais directement sur `main`. Nous devons être sur une branche `feat/<nom-fonctionnalite>`. 

2. **Traçabilité (Réf. Playbook §1)**
   - Implémente la fonctionnalité par petits incréments logiques.
   - Effectue des micro-commits fréquents avec des messages au format *Conventional Commits* (ex: `feat: ajout du bouton`, `test: tests unitaires bouton`).
   - Aucune modification massive non-commitée.

3. **Documentation continue (Réf. Playbook §2)**
   - Mets à jour le `README.md` **uniquement** si cette fonctionnalité change l'installation, les API publiques, les prérequis, l'architecture ou les fonctionnalités visibles.

4. **Revue (Réf. Playbook §7)**
   - Avant de considérer la fonctionnalité terminée, simule un passage par la séquence de revue (Lint, Tests, Sécurité) localement.
