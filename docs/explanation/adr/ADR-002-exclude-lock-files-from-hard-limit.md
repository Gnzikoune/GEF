# ADR-002 — Exclure les fichiers de lock de la vérification Hard Limit

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le hook pre-commit vérifiait que tous les fichiers ne dépassaient pas 400 lignes (Hard Limit du Playbook §1). Cependant, les fichiers de lock générés automatiquement (package-lock.json, yarn.lock, pnpm-lock.yaml, composer.lock, Cargo.lock) dépassent souvent cette limite car ils contiennent des dépendances détaillées.

Cela bloquait les commandes `npm version` qui modifient automatiquement ces fichiers, créant une frustration inutile pour les développeurs.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Garder la vérification stricte sur tous les fichiers | Cohérence totale | Bloque les opérations npm standard, frustration développeur |
| B. Exclure les fichiers de lock de la vérification | Permet les opérations npm standard | Réduit légèrement la rigueur de la vérification |
| C. Augmenter la limite pour tous les fichiers | Simple | Contourne l'esprit du Hard Limit |

## Décision

L'option B est retenue. Les fichiers de lock sont des artefacts générés automatiquement qui ne contiennent pas de logique métier. Les exclure de la vérification Hard Limit est justifié car :

1. **Nature générée** : Ces fichiers sont produits automatiquement par les gestionnaires de packages
2. **Pas de logique métier** : Ils ne contiennent que des métadonnées de dépendances
3. **Opérations standard** : npm version, npm install, npm update doivent fonctionner sans obstacle
4. **Sécurité maintenue** : La vérification s'applique toujours à tout le code source

## Conséquences

### Positives
- Les commandes `npm version` fonctionnent sans blocage
- Les développeurs ne sont pas bloqués par des fichiers générés automatiquement
- La vérification Hard Limit reste active sur tout le code source

### Négatives / Compromis
- Légère réduction de la couverture de la vérification (fichiers de lock exclus)
- Nécessite de maintenir la liste des extensions de fichiers de lock

### Actions requises
- Mettre à jour le hook pre-commit avec l'exclusion
- Documenter cette exception dans le Playbook si nécessaire
- Surveiller si d'autres fichiers générés nécessitent la même exclusion