# Plan — Extension System

**Date:** 2026-08-16
**Auteur:** Devin (AI Assistant)
**Status:** Draft
**Issue:** À créer

---

## 1. Architecture

### 1.1. Structure d'une Extension

Une extension GEF est un package npm avec la structure suivante :

```
gef-extension-<name>/
├── package.json          # Métadonnées de l'extension
├── extension.json        # Configuration des règles GEF
├── rules/               # Règles spécifiques (optionnel)
│   ├── hard-limits.yml
│   ├── security.yml
│   └── dora.yml
├── templates/           # Templates de fichiers (optionnel)
│   ├── .cursorrules
│   └── hooks/
└── README.md            # Documentation de l'extension
```

### 1.2. Schema extension.json

```json
{
  "name": "gef-extension-healthcare",
  "version": "1.0.0",
  "description": "Extension Healthcare avec règles HIPAA",
  "category": "industry",
  "author": "GEF Community",
  "dependencies": {
    "create-gef": ">=1.17.0"
  },
  "rules": {
    "hard_limits": {
      "max_function_lines": 25,
      "max_params": 3
    },
    "security": {
      "enforce_hipaa": true,
      "require_patient_data_encryption": true
    },
    "git": {
      "require_hipaa_compliance": true
    }
  }
}
```

### 1.3. Flux de Données

```
npx create-gef extension install healthcare
    ↓
Vérification extension marketplace (GitHub registry)
    ↓
Téléchargement extension (npm install gef-extension-healthcare)
    ↓
Lecture extension.json
    ↓
Merge avec compliance.yml existant
    ↓
Application templates (si présents)
    ↓
Validation compliance.yml
    ↓
Message de succès
```

---

## 2. Tâches Détaillées

### Tâche 1 : Module Extension Core

**Fichier :** `generator/features/extension.js`

**Sous-tâches :**
- [ ] Créer la structure de base du module
- [ ] Implémenter `installExtension(name)` :
  - Vérifier si extension existe dans marketplace
  - Télécharger extension via npm
  - Lire extension.json
  - Merge avec compliance.yml
  - Appliquer templates si présents
- [ ] Implémenter `listExtensions()` :
  - Lister extensions installées (lecture compliance.yml)
  - Lister extensions disponibles marketplace (GitHub registry)
- [ ] Implémenter `removeExtension(name)` :
  - Nettoyer compliance.yml
  - Désinstaller extension npm
  - Supprimer templates si présents
- [ ] Implémenter `validateExtension(extensionPath)` :
  - Valider structure extension.json
  - Valider compatibilité version GEF

**Critère de succès :** Module extension.js fonctionne avec install/list/remove.

### Tâche 2 : Template d'Extension

**Fichier :** `templates/extension-template/`

**Sous-tâches :**
- [ ] Créer structure de base template
- [ ] Créer package.json template
- [ ] Créer extension.json template
- [ ] Créer README.md template
- [ ] Créer documentation comment créer une extension

**Critère de succès :** Template utilisable pour créer de nouvelles extensions.

### Tâche 3 : Extensions par Défaut

**Dossier :** `extensions/`

**Sous-tâches :**
- [ ] Créer extension Healthcare :
  - Règles HIPAA
  - Hard limits plus strictes
  - Security rules spécifiques
- [ ] Créer extension Finance :
  - Règles PCI-DSS
  - Audit trail renforcé
  - Encryption obligatoire
- [ ] Créer extension Security :
  - OWASP étendu
  - Semgrep rules custom
  - SAST renforcé

**Critère de succès :** 3 extensions fonctionnelles et documentées.

### Tâche 4 : CLI Integration

**Fichier :** `generator/index.js`

**Sous-tâches :**
- [ ] Ajouter routing pour `extension` command
- [ ] Ajouter routing pour `extension install <name>`
- [ ] Ajouter routing pour `extension list`
- [ ] Ajouter routing pour `extension remove <name>`
- [ ] Mettre à jour help.js

**Critère de succès :** CLI extension fonctionne correctement.

### Tâche 5 : Tests

**Fichier :** `tests/extension.test.js`

**Sous-tâches :**
- [ ] Tests pour installExtension()
- [ ] Tests pour listExtensions()
- [ ] Tests pour removeExtension()
- [ ] Tests pour validateExtension()
- [ ] Tests pour merge compliance.yml

**Critère de succès :** Tous les tests passent.

### Tâche 6 : Documentation

**Fichiers :** README.md, docs/how-to/create-extension.md

**Sous-tâches :**
- [ ] Mettre à jour README.md avec extension system
- [ ] Créer guide comment créer une extension
- [ ] Créer guide comment utiliser les extensions
- [ ] Créer ADR pour Extension System

**Critère de succès :** Documentation complète et claire.

---

## 3. Priorité et Estimation

| Tâche | Priorité | Estimation |
|-------|----------|------------|
| Module Extension Core | P0 | 4h |
| Template d'Extension | P1 | 2h |
| Extensions par Défaut | P0 | 3h |
| CLI Integration | P0 | 1h |
| Tests | P0 | 2h |
| Documentation | P1 | 2h |

**Total estimé :** ~14h (2 jours)

---

## 4. Risques et Dépendances

### Risques
- **R1** : Conflicts entre extensions lors du merge compliance.yml
  - **Mitigation** : Validation stricte et messages d'erreur clairs
- **R2** : Extensions mal formées dans marketplace
  - **Mitigation** : validateExtension() strict
- **R3** : Compatibilité version GEF
  - **Mitigation** : Versioning explicite dans extension.json

### Dépendances
- Compliance as Code (déjà implémenté) ✅
- Certification System (déjà implémenté) ✅
- npm (pour installation extensions)

---

## 5. Checklist de Validation

- [ ] Spec validée par le lead
- [ ] Plan validé par le lead
- [ ] Module extension.js implémenté
- [ ] 3 extensions par défaut créées
- [ ] CLI extension intégré
- [ ] Tests passent
- [ ] Documentation complète
- [ ] ADR créé
- [ ] PR créée et mergée

---

*Conforme au ENGINEERING_PLAYBOOK.md (§10 Mode Feature)*