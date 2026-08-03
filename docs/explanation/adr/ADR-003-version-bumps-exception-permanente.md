# ADR-003 — Exception permanente pour les version bumps

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le Playbook §7 exige un ADR pour toute modification de package.json (décision architecturale). Cependant, les version bumps (incrémentations mineures de version selon Semantic Versioning) sont des opérations de routine mécaniques qui ne changent pas la structure ou les dépendances du projet.

Exiger un ADR pour chaque version bump créerait une surcharge administrative disproportionnée par rapport à l'impact réel de la décision.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Exiger un ADR pour chaque version bump | Traçabilité maximale | Surcharge administrative excessive |
| B. Créer un ADR unique permanent pour tous les version bumps | Équilibre optimal | Réduit légèrement la traçabilité individuelle |
| C. Ne jamais exiger d'ADR pour package.json | Simple | Perte de traçabilité sur les vrais changements |

## Décision

L'option B est retenue. Ce document ADR-003 sert d'autorisation permanente pour tous les version bumps futurs du projet.

**Distinction importante** :
- **Version bump** : Changement unique du champ "version" → Couvert par cet ADR, pas besoin d'ADR supplémentaire
- **Modification structurelle** : Changement des dépendances, scripts, etc. → Nécessite un nouvel ADR spécifique

## Conséquences

### Positives
- Les version bumps de routine sont fluides et ne nécessitent pas d'ADR individuel
- La traçabilité est maintenue pour les modifications significatives de package.json
- Réduction de la surcharge administrative tout en gardant la rigueur

### Négatives / Compromis
- Les version bumps individuels ne sont pas traçables via des ADR spécifiques
- Nécessite une discipline pour distinguer version bumps vs modifications structurelles

### Actions requises
- Ce document sert d'autorisation permanente pour tous les version bumps
- Le hook pre-commit doit être mis à jour pour reconnaître cette distinction
- Les développeurs doivent créer un ADR spécifique pour toute modification non-version de package.json