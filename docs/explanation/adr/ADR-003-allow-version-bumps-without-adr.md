# ADR-003 — Permettre les version bumps sans ADR

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le hook pre-commit exigeait un ADR pour toute modification de package.json. Cependant, les commandes `npm version` modifient automatiquement uniquement le champ "version" du package.json pour implémenter le Semantic Versioning.

Exiger un ADR pour chaque version bump créait une surcharge administrative inutile pour des opérations de routine qui sont mécaniques et ne changent pas la structure ou les dépendances du projet.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Exiger un ADR pour toute modification de package.json | Traçabilité maximale | Surcharge administrative pour version bumps |
| B. Permettre les version bumps sans ADR | Fluidité des releases standard | Réduit légèrement la traçabilité |
| C. Désactiver complètement la vérification ADR sur package.json | Simple | Perte de traçabilité sur les vrais changements |

## Décision

L'option B est retenue. Le hook va détecter si la modification de package.json est :

1. **Un simple version bump** : Seul le champ "version" change → Pas d'ADR requis
2. **Une modification structurelle** : Champs comme dependencies, scripts, etc. changent → ADR requis

Cela maintient la traçabilité sur les décisions importantes tout en fluidifiant le processus de release standard.

## Conséquences

### Positives
- Les commandes `npm version` fonctionnent sans blocage
- La traçabilité est maintenue pour les modifications significatives de package.json
- Réduction de la surcharge administrative pour les opérations routine

### Négatives / Compromis
- Le hook devient plus complexe (détection des types de modifications)
- Légère réduction de la traçabilité pour les version bumps

### Actions requises
- Mettre à jour le hook pre-commit avec la logique de détection
- Documenter cette exception dans le Playbook si nécessaire
- Créer un ADR pour justifier ce changement (ce document)