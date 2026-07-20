# Gildas Engineering Framework (GEF)

GEF est un framework d'ingénierie logiciel garantissant le respect automatique des règles de développement (traçabilité, sécurité, qualité). Il transforme les principes du `ENGINEERING_PLAYBOOK.md` en un ensemble d'outils automatisés.

## Fonctionnalités

1. **Générateur de Projet** (`gef-new`) : Initialise instantanément un projet vierge avec l'arborescence, les fichiers de configuration, et les dossiers requis.
2. **Hooks Git** : Empêchent mécaniquement les violations des règles (commits non formatés, push sur la branche main, secrets en clair, fichiers de debug laissés par erreur).
3. **CI/CD** : Un template GitHub Actions prêt à l'emploi qui valide le lint, les tests, la sécurité et gère les releases automatiques.
4. **Prompts IA** : Des directives à fournir à votre assistant IA pour qu'il respecte le playbook de lui-même.

## Installation et Utilisation

Pour démarrer un nouveau projet en respectant les standards GEF :

1. Ouvrez un terminal (Bash sous Mac/Linux, PowerShell sous Windows).
2. Clonez ce dépôt ou rendez-vous dans le dossier de GEF.
3. Exécutez le générateur :

**Sous Mac / Linux / Git Bash :**
```bash
./generator/gef-new.sh nom-de-mon-projet --lang python
```

**Sous Windows (PowerShell) :**
```powershell
.\generator\gef-new.ps1 nom-de-mon-projet -Lang node
```

Le script va créer le dossier, mettre en place l'arborescence, configurer le `.gitignore`, installer les Hooks Git, et copier le template de CI/CD.

## Architecture de GEF

- `ENGINEERING_PLAYBOOK.md` : La source de vérité absolue des règles.
- `PROJECT_CONFIG.template.md` : Le fichier qui recevra les spécificités d'un projet cible.
- `generator/` : Les scripts d'initialisation de projets.
- `hooks/` : Les scripts de sécurité locaux exécutés par Git.
- `ci-templates/` : Les workflows GitHub Actions de contrôle qualité.
- `prompts/` : Les instructions optimisées pour l'IA.

> **Note :** Rien dans ce dépôt ne contient d'informations spécifiques à un projet (identifiants, clouds, clients). Il est universel et agnostique.
