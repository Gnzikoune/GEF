# ADR-002 — Distinction entre code source et artefacts générés

**Statut :** Accepté
**Date :** 2026-08-03

## Contexte

Le Playbook §1 définit des Hard Limits absolues (400 lignes max par fichier). Cependant, certains fichiers générés automatiquement (package-lock.json, yarn.lock, etc.) dépassent cette limite car ils contiennent des métadonnées détaillées de dépendances.

Appliquer les mêmes règles aux artefacts générés qu'au code source contrevient à l'objectif du GEF : assurer la qualité du code écrit par les développeurs.

## Options Considérées

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A. Appliquer les mêmes règles à tous les fichiers | Cohérence totale | Bloque les outils standard, perte de productivité |
| B. Exclure les artefacts générés des vérifications | Respecte l'esprit du GEF (qualité du code source) | Crée une distinction explicite à maintenir |
| C. Augmenter la limite pour tous les fichiers | Simple | Contrevient à l'esprit des Hard Limits |

## Décision

L'option B est retenue. Le Playbook sera mis à jour pour distinguer :

- **Code source** : Fichiers écrits par les développeurs (JS, TS, Python, etc.) → Soumis aux Hard Limits
- **Artefacts générés** : Fichiers produits automatiquement par des outils (lock files, build outputs) → Exclus des vérifications de taille

Cette distinction respecte l'esprit du GEF : les Hard Limits visent à maintenir la qualité du code humain, pas à bloquer les outils standard de l'écosystème.

## Conséquences

### Positives
- Les outils standard (npm, yarn, etc.) fonctionnent sans obstacle
- La rigueur est maintenue sur le code source écrit par les développeurs
- La distinction est explicite et documentée

### Négatives / Compromis
- Nécessite de maintenir une liste des extensions d'artefacts
- Légère complexité additionnelle dans les hooks

### Actions requises
- Mettre à jour le Playbook §1 pour documenter cette distinction
- Mettre à jour le hook pre-commit pour exclure les artefacts générés
- Maintenir la liste des extensions d'artefacts (package-lock.json, yarn.lock, etc.)