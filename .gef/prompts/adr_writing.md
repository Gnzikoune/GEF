# Prompt Rédaction ADR — GEF

> Ce prompt est à utiliser lorsqu'une décision architecturale majeure doit être prise (changement de base de données, framework, cloud, authentification, etc.).

Tu dois rédiger un document **Architecture Decision Record (ADR)** en respectant le `ENGINEERING_PLAYBOOK.md` (§6 — Diátaxis & Docs-as-Code).

## Processus de Rédaction d'un ADR

### Étape 1 — Création du Fichier
- Crée un nouveau fichier dans `docs/explanation/adr/` nommé `ADR-XXX-titre_descriptif.md` (ex: `ADR-001-choix_base_de_donnees.md`).
- Le numéro `XXX` est séquentiel (incrémente le dernier ADR existant).

### Étape 2 — Structure Stricte
Utilise **impérativement** le format suivant :

```markdown
# ADR-XXX — [Titre de la décision]

**Statut :** [Proposé | Accepté | Déprécié | Remplacé par ADR-YYY]
**Date :** YYYY-MM-DD

## Contexte
Quel est le problème, le besoin ou la situation qui nécessite une décision ?
Inclure le maximum de contexte : contraintes, enjeux métier, contraintes techniques.

## Options Considérées
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Option A | ... | ... |
| Option B | ... | ... |

## Décision
Quelle option est retenue et **pourquoi** ? Être précis et factuel.

## Conséquences
- **Positives :** Quels bénéfices concrets cette décision apporte-t-elle ?
- **Négatives / Compromis :** Quelles dettes techniques ou limitations sont acceptées ?
- **Actions requises :** Quelles tâches découlent de cette décision (mise à jour du CI/CD, formation, migration) ?

## Diagramme (optionnel — Modèle C4 / Mermaid)
Si la décision impacte l'architecture, illustre-la avec un diagramme Mermaid.
```

### Étape 3 — Commit Dédié
Une fois l'ADR rédigé, effectue un commit **dédié** :
```
docs(adr): création ADR-XXX — [titre descriptif] (#ticket)
```

> Ne consigne **jamais** les décisions architecturales dans le RESEARCH_LOG. Ce dernier est réservé aux bugs résolus. Les ADR ont leur propre espace dans `docs/explanation/adr/`.
