# ADR-005 : Compromis Startup et Flexibilité du Framework

**Date** : 11 Août 2026
**Statut** : Accepté

## Contexte
Le Guardian Engineering Framework (GEF) a été conçu à l'origine pour des projets de type **Mission Critical** ou **Standard**, nécessitant un niveau très élevé de sécurité, d'audit, et de traçabilité.
Cependant, l'utilisation de l'Agentic SDD (Spec-Driven Development avec l'IA) a attiré de nombreux projets en phase d'idéation ou de R&D (startups, prototypes). Appliquer les règles strictes du GEF (comme les audits de dépendances à chaque PR ou l'interdiction totale des payloads > 1Mo) sur ces projets générait une friction importante.

## Options Considérées
1. **Garder le GEF strict pour tous** : Refuser les projets immatures. (Problème : limite l'adoption).
2. **Créer un GEF-Lite** : Un fork séparé. (Problème : maintenance double).
3. **Introduire des Niveaux de Sévérité** : Ajuster mécaniquement les seuils de tolérance (Hard Limits) lors de l'initialisation du projet (`npx create-gef`).

## Décision
Nous avons opté pour l'**Option 3 (Niveaux de Sévérité)**. Le générateur interactif demande désormais le niveau de sévérité du projet :
- **Startup / R&D** : Limites de fichiers plus souples (500 lignes), payloads jusqu'à 5Mo, pas d'audit bloquant sur les dépendances.
- **Standard (Recommandé)** : Limites équilibrées (400 lignes / 1Mo).
- **Mission Critical** : Sécurité maximale, payloads réduits (100 Ko), audits constants.

Ces paramètres sont inscrits dans le fichier `PROJECT_CONFIG.md` et les scripts Git hooks (`pre-commit`) sont générés dynamiquement en fonction de ce choix.

## Conséquences
- **Avantages** : Le GEF peut accompagner un projet de sa phase de prototype jusqu'à sa mise en production critique, simplement en modifiant le fichier de configuration et en relançant `npx create-gef update`.
- **Inconvénients** : Les projets "Startup" peuvent accumuler une petite dette technique (fichiers plus longs). Le framework compte sur le développeur pour "upgrader" le niveau de sévérité une fois le produit validé par le marché (Product-Market Fit).
