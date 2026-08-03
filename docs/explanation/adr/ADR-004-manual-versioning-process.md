# ADR-004 — Processus de versioning manuel respectant Conventional Commits

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le Playbook §5 exige que tous les commits suivent le format Conventional Commits avec un ID de ticket Kanban. La commande `npm version` crée automatiquement des commits avec des messages comme "1.9.4" qui ne respectent pas ce format.

Utiliser `npm version` contrevient donc à l'une des règles fondamentales du GEF : la traçabilité via des commits conformes.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Utiliser npm version et accepter les commits non conformes | Simple, standard | Contrevient au Playbook §5 |
| B. Configurer npm pour utiliser des messages conformes | Respecte le format | Complexe, non supporté nativement |
| C. Processus de versioning manuel | Respecte strictement le GEF | Plus manuel, propice aux erreurs |
| D. Hook post-commit pour corriger les messages | Automatique | Complexe, contrevient à l'esprit de rigueur |

## Décision

L'option C est retenue. Le projet n'utilisera pas `npm version` directement. À la place, les développeurs suivront un processus manuel strict qui respecte le format Conventional Commits.

**Processus de versioning manuel** :
```bash
# 1. Mettre à jour la version sans créer de commit
npm version patch --no-git-tag-version

# 2. Commiter avec message conforme
git add package.json package-lock.json
git commit -m "chore: bump version to 1.9.5 (#52)"

# 3. Créer le tag manuellement
git tag v1.9.5

# 4. Pusher avec les tags
git push --follow-tags
```

## Conséquences

### Positives
- Respect strict du format Conventional Commits
- Tous les commits sont traçables avec des tickets Kanban
- Cohérence totale avec le Playbook §5
- Pas de commit "magique" non conforme

### Négatives / Compromis
- Processus plus manuel et propice aux erreurs
- Nécessite une discipline stricte de la part des développeurs
- Moins intégré avec les outils standard npm

### Actions requises
- Documenter ce processus dans le CONTRIBUTING.md ou README
- Créer un script npm helper pour réduire le risque d'erreur
- Former les développeurs sur ce processus manuel
- Mettre à jour le hook commit-msg pour rejeter explicitement les formats de version pure