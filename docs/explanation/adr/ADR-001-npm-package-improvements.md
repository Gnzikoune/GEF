# ADR-001 — Amélioration des métadonnées et scripts du package npm

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le package npm `create-gef` était en version 1.9.0 mais manquait de métadonnées complètes pour une meilleure découvrabilité et d'outils de développement efficaces. Le package avait :

- Une description minimaliste en français seulement
- Aucun mot-clé pour la recherche npm
- Pas de scripts de développement (test, publish)
- Pas de lien vers le repository GitHub
- Pas de spécification de version Node.js minimale
- Pas de liste des fichiers à inclure dans le package publié

Ces limitations rendaient le package difficile à découvrir via npm search et manquaient de professionnalisme pour un framework d'ingénierie.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Maintenir le package minimaliste | Simple, pas de changement | Découvrabilité faible, manque de professionnalisme |
| B. Ajouter métadonnées complètes et scripts | Meilleure découvrabilité, plus professionnel, meilleure DX | Plus de maintenance, fichier plus volumineux |
| C. Créer un package séparé pour la CLI | Séparation des responsabilités | Duplication de code, complexité accrue |

## Décision

L'option B est retenue. L'amélioration des métadonnées du package npm est essentielle pour :

1. **Découvrabilité** : Les mots-clés permettent aux développeurs de trouver le package via `npm search` pour des termes comme "generator", "clean-code", "security", "ci-cd", etc.
2. **Professionnalisme** : Un framework d'ingénierie doit avoir des métadonnées complètes (repository, homepage, bugs, engines)
3. **Developer Experience** : Les scripts npm facilitent le développement local et la publication
4. **Standardisation** : Respecter les meilleures pratiques npm pour les packages CLI

## Conséquences

### Positives
- Meilleure découvrabilité sur npm via les 40+ mots-clés ajoutés
- Liens directs vers GitHub (repository, homepage, issues)
- Scripts npm pour tester avant publication (`prepublishOnly`)
- Spécification claire de Node.js >=18.0.0
- Liste explicite des fichiers à inclure dans le package publié
- Description bilingue (anglais) pour audience internationale

### Négatives / Compromis
- Fichier package.json plus volumineux (97 lignes vs 18)
- Maintenance supplémentaire pour garder les mots-clés à jour

### Actions requises
- Mettre à jour le README.md pour refléter les nouvelles commandes npm
- Tester le package localement avec `npm link`
- Publier la nouvelle version sur npm
- Surveiller les statistiques de téléchargement pour évaluer l'impact sur la découvrabilité