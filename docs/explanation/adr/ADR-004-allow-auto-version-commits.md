# ADR-004 — Permettre les commits de version automatiques

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le hook commit-msg exigeait que tous les commits suivent le format Conventional Commits avec un numéro de ticket Kanban. Cependant, la commande `npm version` crée automatiquement des commits avec des messages comme "1.9.3" (version uniquement).

Ces commits de version sont générés automatiquement par npm et ne peuvent pas être personnalisés facilement. Ils sont nécessaires pour implémenter correctement le Semantic Versioning avec les tags Git.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Exiger le format Conventional Commits pour tous les commits | Cohérence totale | Bloque les commandes npm version standard |
| B. Permettre les commits de version automatiques | Fluidité des releases standard | Légère incohérence dans les messages de commit |
| C. Configurer npm pour utiliser des messages custom | Messages conformes | Complexité accrue, moins standard |

## Décision

L'option B est retenue. Le hook commit-msg va détecter les messages de version automatiques (format X.Y.Z) et les accepter sans exiger le format Conventional Commits avec ticket.

Cela permet d'utiliser les commandes npm standard tout en maintenant la rigueur sur les commits de développement manuels.

## Conséquences

### Positives
- Les commandes `npm version` fonctionnent sans blocage
- Les tags Git sont créés correctement pour les releases
- La rigueur est maintenue sur les commits de développement

### Négatives / Compromis
- Légère incohérence : certains commits (versions) n'ont pas de format Conventional Commits
- Les commits de version ne sont pas traçables via des tickets Kanban

### Actions requises
- Mettre à jour le hook commit-msg avec l'exception pour les versions
- Documenter cette exception dans le Playbook si nécessaire
- Créer un ADR pour justifier ce changement (ce document)