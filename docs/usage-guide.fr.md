# Guide d'Utilisation - Commandes GEF

Ce document contient des exemples détaillés d'utilisation des commandes GEF.

## Compliance as Code

Le GEF Compliance as Code permet de définir les règles d'ingénierie de manière déclarative via un fichier `compliance.yml`. Ce fichier contient :

- **Hard Limits** : Limites de code (max_function_lines, max_params, max_complexity, etc.)
- **Security Rules** : Règles de sécurité OWASP (jwt_expiry, rate_limit, secret_detection)
- **Git Strategy** : Configuration du workflow Git (GitHub Flow, Trunk-Based)
- **DORA Targets** : Objectifs de métriques DORA (deployment_frequency, lead_time, etc.)
- **Extensions** : Extensions activées et règles personnalisées

```bash
# Générer le fichier compliance.yml
npx create-gef compliance generate

# Valider le fichier compliance.yml
npx create-gef compliance validate

# Appliquer les règles aux hooks Git
npx create-gef compliance apply-hooks

# Appliquer les règles à la CI/CD
npx create-gef compliance apply-ci
```

## Certification System

Le GEF Certification System permet d'obtenir un niveau de certification officiel basé sur la conformité GEF et les métriques DORA. Les niveaux disponibles sont :

- **Bronze** : GEF ≥ 60%, DORA ≥ 40%
- **Silver** : GEF ≥ 70%, DORA ≥ 60%
- **Gold** : GEF ≥ 85%, DORA ≥ 80%
- **Platinum** : GEF ≥ 95%, DORA ≥ 95%

```bash
# Vérifier le niveau de certification possible
npx create-gef certify check

# Générer badge et rapport de certification
npx create-gef certify generate
```

Le système génère :
- Badge SVG pour README.md
- Rapport public de certification (GEF_CERTIFICATION_REPORT.md)
- Audit trail avec date et scores

## Extension System

Le GEF Extension System permet d'installer des packs de règles spécifiques par industrie, framework ou standard de sécurité. Les extensions disponibles incluent :

- **Healthcare** : Règles HIPAA pour la protection des données de santé
- **Finance** : Règles PCI-DSS pour la conformité financière
- **Security** : OWASP étendu pour la sécurité renforcée

```bash
# Installer une extension
npx create-gef extension install healthcare

# Lister les extensions installées et disponibles
npx create-gef extension list

# Désinstaller une extension
npx create-gef extension remove healthcare
```

Les extensions mettent à jour automatiquement le fichier `compliance.yml` avec les règles spécifiques du domaine.

## DORA Metrics

Le GEF DORA Metrics permet d'analyser les métriques DevOps clés selon les standards du DevOps Research and Assessment. Les 4 métriques clés sont :

- **Deployment Frequency** : Fréquence des déploiements en production
- **Lead Time for Changes** : Temps entre commit et déploiement
- **Change Failure Rate (CFR)** : Pourcentage de déploiements causant des incidents
- **Mean Time to Restore (MTTR)** : Temps moyen pour restaurer le service

```bash
# Analyser les tendances DORA sur 30 jours
npx create-gef dora trends
```

La commande génère un rapport d'analyse avec :
- Groupement des données par semaine (4 périodes)
- Calcul des métriques hebdomadaires
- Graphiques Mermaid pour visualisation
- Rapport sous `docs/research/DORA_TRENDS.md`

Les benchmarks industriels DORA sont intégrés :
- **Elite** : On-demand, < 1h lead time, < 15% CFR, < 1h MTTR
- **High** : 1/semaine-1/mois, < 1 semaine, < 20% CFR, < 1 jour MTTR
- **Medium** : 1/mois-6/mois, < 6 mois, < 30% CFR, < 1 semaine MTTR
- **Low** : < 1/mois, > 6 mois, > 30% CFR, > 1 semaine MTTR

Ces métriques sont également intégrées dans le Certification System pour la corrélation GEF/DORA.

## Smart CLI

Le GEF Smart CLI est un assistant intelligent capable d'analyser le contexte du projet, de fournir des recommandations contextuelles et d'automatiser certaines tâches de gouvernance. Il fonctionne en mode offline (sans dépendance IA externe) avec des réponses basées sur ENGINEERING_PLAYBOOK.md.

### Commandes disponibles

```bash
# Analyser le contexte du projet et le score de conformité
npx create-gef smart analyze

# Mode assistant conversationnel (offline)
npx create-gef smart chat

# Expliquer une règle GEF spécifique
npx create-gef smart explain max-function-lines

# Suggérer des améliorations basées sur l'analyse
npx create-gef smart suggest

# Audit en profondeur avec corrélation GEF/DORA
npx create-gef smart audit
```

### Options globales

```bash
# Mode verbose pour afficher les détails de debugging
npx create-gef smart analyze --verbose

# Sortie au format JSON pour intégration
npx create-gef smart analyze --json
```

### Fonctionnalités détaillées

#### smart analyze
Analyse le contexte du projet et génère un rapport de conformité :
- Détection des fichiers GEF obligatoires
- Analyse de la configuration Git (hooks, stratégie)
- Analyse de la configuration CI/CD (workflows GitHub Actions)
- Calcul du score de conformité (0-100%)
- Catégorisation du statut (excellent/good/acceptable/poor)

#### smart chat
Mode conversationnel interactif :
- Posez des questions sur les règles GEF
- Demandez des explications sur les erreurs de conformité
- Obtenez des suggestions de configuration
- Fonctionne entièrement en mode offline

#### smart explain <rule>
Explication détaillée d'une règle GEF :
- Références aux sections spécifiques du ENGINEERING_PLAYBOOK.md
- Exemples de code conformes et non conformes
- Explication du "pourquoi" de chaque règle
- Correctifs suggérés si des violations sont détectées

#### smart suggest
Suggestions d'améliorations basées sur l'analyse du code :
- Détection des violations des Hard Limits
- Suggestions priorisées par impact (critical/high/medium/low)
- Correctifs automatiques quand possible
- Extraits de code avant/après

#### smart audit
Audit en profondeur du projet :
- Corrélation entre conformité GEF et métriques DORA
- Identification des patterns de violations récurrents
- Plan d'amélioration priorisé avec estimations d'effort
- Rapport détaillé avec recommandations

### Mode offline garanti

Le Smart CLI fonctionne entièrement en mode offline :
- Réponses basées sur ENGINEERING_PLAYBOOK.md
- Aucune dépendance IA externe requise
- Fallback gracieux si IA API optionnelle indisponible
- Performance optimale (< 2s pour analyze, < 10s pour audit)

## Créer une Extension

Le GEF fournit un template pour créer facilement des extensions. Consultez [`templates/extension-template/README.md`](../templates/extension-template/README.md) pour le guide complet.

Structure de base :
```bash
templates/extension-template/
├── package.json          # Métadonnées de l'extension
├── extension.json        # Configuration des règles GEF
├── rules/               # Règles spécifiques (optionnel)
├── templates/           # Templates de fichiers (optionnel)
└── README.md            # Documentation
```

## Développement Local du Framework

Si vous modifiez le framework GEF lui-même et souhaitez tester la CLI localement :

```bash
# 1. Cloner le dépôt
git clone https://github.com/Gnzikoune/GEF.git GEF
cd GEF

# 2. Installer les dépendances
npm install

# 3. Rendre la commande locale accessible globalement
npm link
```

---

*Pour plus d'informations, voir [README.md](../README.md)*