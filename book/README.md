# Engineering Governance for AI Teams : From Rules to Automation

**Titre de travail** - Partie 1 : L'Ingénierie Assistée par IA Aujourd'hui

## Table des matières

### Introduction
- Le contexte : l'explosion des assistants IA dans le développement
- Le problème : l'improvisation face à l'automatisation
- La thèse : les règles doivent être imposées mécaniquement, pas relues
- Structure du livre

### Chapitre 1 : Pourquoi les règles textuelles échouent
1.1. Le paradoxe de la documentation technique
1.2. L'échec des "best practices" non appliquées
1.3. Le problème amplifié par les assistants IA
1.4. L'improvisation comme ennemie de la qualité
1.5. La nécessité des verrous mécaniques

### Chapitre 2 : Le Guardian Engineering Framework
2.1. Architecture du GEF : les 6 briques
2.2. Brique A : Le générateur de projet
2.3. Brique B : Les hooks Git
2.4. Brique C : Le pipeline CI/CD
2.5. Brique D : Les prompts IA
2.6. Brique E : Le Tech Lead Virtuel
2.7. Brique F : La garantie anti-contournement
2.8. Ce qui est unique dans l'approche GEF

### Chapitre 3 : Clean Code Quantitatif
3.1. Pourquoi les chiffres comptent
3.2. Hard Limits : métriques et seuils
3.3. Complexité cyclomatique comme mesure de sécurité
3.4. Nesting et Guard Clauses
3.5. La règle de 3 et le refactoring
3.6. Conventions de nommage
3.7. Feature-Sliced Design en pratique

### Chapitre 4 : Sécurité OWASP par Design
4.1. "La complexité est l'ennemie de la sécurité"
4.2. Zero Trust et validation stricte
4.3. Hard Limits de sécurité (JWT, payload, uploads)
4.4. Rate limiting et anti-brute force
4.5. Fail-Safe Defaults
4.6. Protection SQLi et XSS
4.7. Gestion des secrets

### Chapitre 5 : Git Flow et Traçabilité
5.1. GitHub Flow vs Trunk-Based Development
5.2. Hooks Git bloquants (commit-msg, pre-commit, pre-push)
5.3. Conventional Commits et référence Kanban
5.4. Pull Requests obligatoires
5.5. CI/CD comme dernier rempart
5.6. Release Please et Semantic Versioning

### Chapitre 6 : L'IA comme Tech Lead Virtuel
6.1. Pilotage Kanban et création d'issues
6.2. Auto-documentation ADR
6.3. TDD piloté par l'IA
6.4. Prompts contextuels et spécialisés
6.5. Crash Clause Anti-Contournement
6.6. Limites de l'autonomie actuelle
6.7. L'humain reste responsable

### Chapitre 7 : Démonstration Pratique
7.1. Création d'un projet Next.js standard
7.2. Création d'un projet avec create-gef
7.3. Comparaison côte à côte
7.4. Ce qui change au quotidien
7.5. Interaction avec Cursor/Windsurf/Copilot

### Chapitre 8 : Études de Cas
8.1. Cas 1 : Implémentation complète d'un projet avec GEF
8.2. Cas 2 : Migration d'un projet legacy vers GEF
8.3. Cas 3 : Mesures d'impact (DORA metrics)
8.4. Leçons apprises et ajustements

### Chapitre 9 : Intégration dans l'Équipe
9.1. Adoption du GEF par une équipe existante
9.2. Formation et onboarding
9.3. Résistance au changement
9.4. Mesure de l'adoption
9.5. Maintenance et évolution

### Chapitre 10 : Limites et Perspectives
10.1. Ce que GEF ne résout pas
10.2. Limites de l'approche actuelle
10.3. Vers un système observateur (Niveau 2)
10.4. Ce qui nécessiterait une équipe de recherche
10.5. Feuille de route réaliste

### Conclusion
- Rappel de la thèse
- L'ingénierie assistée par IA aujourd'hui
- GEF comme amplificateur, pas remplaçant
- Appel à l'action

### Annexes
- Annexe A : Référence complète du Engineering Playbook
- Annexe B : Guide d'installation rapide
- Annexe C : Configuration avancée
- Annexe D : Bibliographie et références

## Statut de rédaction

- [x] Structure du livre
- [x] Introduction
- [x] Chapitre 1
- [x] Chapitre 2
- [x] Chapitre 3
- [x] Chapitre 4
- [x] Chapitre 5
- [x] Chapitre 6
- [x] Chapitre 7
- [x] Chapitre 8
- [x] Chapitre 9
- [x] Chapitre 10
- [x] Conclusion
- [x] Annexes

**Statut :** Première version complète terminée. Le livre est prêt pour relecture et révision.
