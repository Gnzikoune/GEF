# GEF Extension Template

Ce template vous permet de créer facilement des extensions pour le Guardian Engineering Framework (GEF).

## Structure d'une Extension

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

## Étapes pour Créer une Extension

### 1. Renommer le Template

Copiez ce template et renommez le dossier selon votre extension :
```bash
cp -r extension-template gef-extension-votre-extension
cd gef-extension-votre-extension
```

### 2. Configurer package.json

Modifiez `package.json` avec les informations de votre extension :
- `name`: gef-extension-<votre-extension>
- `description`: Description de votre extension
- `category`: industry, framework, ou security
- `author`: Votre nom ou organisation

### 3. Configurer extension.json

Modifiez `extension.json` pour définir les règles GEF de votre extension :
- `hard_limits`: Limites de code spécifiques
- `security`: Règles de sécurité spécifiques
- `git`: Configuration Git spécifique
- `testing`: Configuration de tests spécifique

### 4. Ajouter des Règles Optionnelles (Optionnel)

Dans le dossier `rules/`, vous pouvez ajouter des fichiers YAML pour des règles complexes :
- `hard-limits.yml`: Limites de code détaillées
- `security.yml`: Règles de sécurité détaillées
- `dora.yml`: Configuration DORA détaillée

### 5. Ajouter des Templates (Optionnel)

Dans le dossier `templates/`, vous pouvez ajouter des fichiers à générer dans les projets :
- `.cursorrules`: Règles IA spécifiques
- `hooks/`: Hooks Git personnalisés

### 6. Documenter l'Extension

Modifiez ce README.md pour documenter votre extension :
- Description détaillée
- Règles appliquées
- Exemples d'utilisation
- Limitations

### 7. Publier l'Extension

Publiez votre extension sur npm :
```bash
npm publish
```

## Exemple d'Extension Simple

Voici un exemple minimal d'extension Healthcare :

**extension.json:**
```json
{
  "name": "gef-extension-healthcare",
  "version": "1.0.0",
  "description": "Extension Healthcare avec règles HIPAA",
  "category": "industry",
  "author": "GEF Community",
  "rules": {
    "hard_limits": {
      "max_function_lines": 25,
      "max_params": 3,
      "max_complexity": 8
    },
    "security": {
      "enforce_hipaa": true,
      "require_patient_data_encryption": true,
      "require_audit_log": true
    },
    "git": {
      "require_hipaa_compliance": true
    }
  }
}
```

## Installer une Extension

Une fois votre extension publiée sur npm, les utilisateurs peuvent l'installer :
```bash
npx create-gef extension install healthcare
```

## Contribution

Pour contribuer une extension officielle au marketplace GEF :
1. Créez votre extension en utilisant ce template
2. Soumettez une Pull Request au dépôt GEF
3. L'équipe GEF examinera et intégrera votre extension

## Support

Pour toute question sur la création d'extensions, consultez :
- [ADR-009 Extension System](../../docs/explanation/adr/ADR-009-extension-system.md)
- [Documentation GEF](../../README.md)
- [Issues GitHub](https://github.com/Gnzikoune/GEF/issues)

---

*Guardian Engineering Framework*