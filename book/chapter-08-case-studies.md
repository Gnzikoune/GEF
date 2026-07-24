# Chapitre 8 : Études de Cas

## 8.1. Cas 1 : Implémentation complète d'un projet avec GEF

Ce cas d'étude décrit l'implémentation complète d'une application SaaS avec GEF, de l'initialisation au déploiement en production.

### Contexte du projet

**Entreprise :** TechStartup Inc.
**Projet :** Plateforme de gestion de tâches collaboratives
**Équipe :** 3 développeurs (1 senior, 2 junior)
**Stack technique :** Next.js, PostgreSQL, Vercel
**Délai :** 3 mois pour MVP
**Contraintes :** Sécurité élevée (données clients), qualité de code prioritaire

### Phase 1 : Initialisation avec GEF

Le Tech Lead senior initialise le projet avec GEF :

```bash
npx create-gef
```

**Choix de configuration :**
- Framework : Next.js
- Base de données : PostgreSQL
- Cloud provider : Vercel
- Stratégie Git : GitHub Flow
- Linter : Biome
- Niveau de sévérité : Standard / Enterprise
- Langue : Français
- Tests : Yes
- Docker : Yes

**Résultat :** Projet initialisé en 3 minutes avec :
- Hooks Git configurés
- CI/CD prêt
- Linter avec Hard Limits (30 lignes, 3 params, 10 complexité)
- Documentation Diátaxis
- Template ADR
- Prompts IA dans `.gef/`

### Phase 2 : Développement de la fonctionnalité d'authentification

**Issue créée :** #42 - Implémentation de l'authentification

**Workflow avec l'IA (Cursor) :**

1. **Chargement du prompt** : Le développeur charge `feature_development.md` dans Cursor
2. **Spécification** : "Implémente l'authentification avec email/mot de passe et OAuth Google"
3. **Création ADR** : L'IA crée `docs/explanation/adr/0001-authentication.md` documentant le choix de NextAuth.js
4. **Test E2E** : L'IA écrit d'abord le test Playwright décrivant le flux d'authentification
5. **Implémentation** : L'IA implémente le code pour faire passer le test
6. **Commit** : L'IA commite avec `feat(auth): implémentation de l'authentification (#42)`
7. **PR** : L'IA crée la PR avec le template

**Validation humaine :**
- Le Tech Lead révise le code
- Vérifie que les règles de sécurité OWASP sont respectées
- Apprécie que l'ADR documente la décision
- Merge la PR

### Phase 3 : Développement de la fonctionnalité de gestion de tâches

**Issue créée :** #43 - Gestion de tâches CRUD

**Défi :** L'IA génère initialement une fonction de 45 lignes pour traiter la création de tâches.

**Blocage par le linter :**
```bash
npm run lint
# ❌ Erreur : La fonction 'createTask' dépasse 30 lignes (45)
# ℹ️ Refactorisez en extrayant des sous-fonctions
```

**Correction :**
Le développeur demande à l'IA de refactoriser. L'IA divise la fonction en :
- `validateTaskInput()` (8 lignes)
- `saveTaskToDatabase()` (10 lignes)
- `sendNotification()` (7 lignes)
- `createTask()` (5 lignes, orchestration)

**Résultat :** Code plus maintenable, testable, et conforme aux limites.

### Phase 4 : Détection d'une vulnérabilité de sécurité

**Scénario :** Un développeur junior tente de committer du code avec une clé API en dur.

**Blocage par le hook pre-commit :**
```bash
git add .
git commit -m "feat(api): intégration Stripe (#44)"
# ❌ Erreur : Secret détecté dans src/app/api/stripe/route.ts
# ❌ Ligne 12 : sk_test_1234567890abcdef
# ℹ️ Déplacez ce secret dans une variable d'environnement
```

**Correction :**
Le développeur déplace la clé dans `.env` et utilise `process.env.STRIPE_SECRET_KEY`.

**Résultat :** Vulnérabilité évitée avant même d'atteindre le dépôt distant.

### Phase 5 : Déploiement en production

**Processus :**
1. Toutes les PRs sont mergées dans `main`
2. Release Please crée automatiquement une PR de release v1.0.0
3. Le CHANGELOG est généré depuis les commits
4. La PR de release est mergée
5. Le tag v1.0.0 est créé
6. La CI déploie automatiquement sur Vercel

**Résultat :** Déploiement en production sans intervention manuelle de versioning.

### Mesures d'impact

**Avant GEF (projets précédents de l'équipe) :**
- Temps de setup initial : 2-3 jours
- Violations de sécurité détectées en production : 3-4 par an
- Couverture de tests : 40%
- Temps moyen de revue de code : 45 minutes
- Bugs en production : 12 par mois

**Avec GEF :**
- Temps de setup initial : 3 minutes
- Violations de sécurité détectées en production : 0 (bloquées en local)
- Couverture de tests : 75%
- Temps moyen de revue de code : 20 minutes (code plus cohérent)
- Bugs en production : 4 par mois

### Leçons apprises

1. **Les verrous mécaniques fonctionnent** : Les développeurs ne contournent pas les hooks car c'est plus difficile de le faire que de suivre les règles
2. **L'IA respecte les règles quand elles sont natives** : Cursor génère du code conforme car `.cursorrules` est chargé automatiquement
3. **La documentation ADR améliore la cohérence** : Les décisions sont discutées et documentées, réduisant les débats futurs
4. **La qualité s'améliore naturellement** : Les limites de taille forcent le refactoring proactif

## 8.2. Cas 2 : Migration d'un projet legacy vers GEF

Ce cas d'étude décrit la migration d'un projet existant (legacy) vers GEF.

### Contexte du projet

**Entreprise :** LegacyCorp
**Projet :** Application e-commerce existante depuis 2 ans
**Équipe :** 5 développeurs
**Stack technique :** React (Create React App), Node.js/Express, MongoDB
**Problèmes :**
- Dette technique élevée
- Pas de tests automatisés
- Violations de sécurité fréquentes
- Historique Git incohérent
- Documentation inexistante

### Phase 1 : Analyse pré-migration

**Audit de l'état actuel :**
- 150 fichiers JavaScript (pas TypeScript)
- 0 tests automatisés
- Fonctions moyennes de 80 lignes
- 3 violations OWASP détectées lors du dernier audit de sécurité
- Commits sans format standard
- Pas de CI/CD

**Décision :** Migration progressive plutôt que réécriture complète.

### Phase 2 : Installation de GEF

**Commande :**
```bash
npx create-gef update
```

**Actions effectuées par GEF :**
1. Copie du Playbook dans `.gef/`
2. Copie des prompts IA dans `.gef/prompts/`
3. Installation de Biome (remplacement de ESLint)
4. Configuration de Biome avec Hard Limits
5. Installation des hooks Git
6. Création de `.github/workflows/main.yml`
7. Création de la structure Diátaxis dans `docs/`

**Note :** GEF ne modifie pas le code existant (Clause d'Antériorité). Il ajoute uniquement les règles pour le nouveau code.

### Phase 3 : Migration progressive du code

**Stratégie :** Boy Scout Rule — à chaque modification, nettoyer le code environnant.

**Exemple 1 : Correction d'un bug**

**Issue :** #100 - Correction du panier d'achat

**Ancien code (legacy) :**
```javascript
// src/components/Cart.js (120 lignes)
function Cart({ items }) {
  // 120 lignes de logique complexe
  // Imbriqué, difficile à tester
}
```

**Nouveau code (après migration) :**
```typescript
// src/features/cart/components/Cart.tsx (28 lignes)
function Cart({ items }: CartProps) {
  const validatedItems = validateCartItems(items);
  const total = calculateTotal(validatedItems);
  
  return (
    <CartContainer items={validatedItems} total={total} />
  );
}
```

**Sous-fonctions extraites :**
```typescript
// src/features/cart/utils/validateCartItems.ts (12 lignes)
function validateCartItems(items: CartItem[]): ValidatedCartItem[] { ... }

// src/features/cart/utils/calculateTotal.ts (8 lignes)
function calculateTotal(items: ValidatedCartItem[]): number { ... }
```

**Résultat :** Code refactorisé lors de la correction du bug, conforme aux limites GEF.

### Phase 4 : Ajout de tests

**Stratégie :** TDD pour les nouvelles fonctionnalités, tests de régression pour les bugs.

**Exemple : Correction du bug #100**

1. L'IA écrit d'abord le test de régression :
```typescript
// src/features/cart/__tests__/Cart.test.ts
test('le panier calcule correctement le total', () => {
  const items = [{ price: 10, quantity: 2 }];
  const total = calculateTotal(items);
  expect(total).toBe(20);
});
```

2. Le test échoue (bug existant)
3. Le code est corrigé
4. Le test passe

**Résultat après 6 mois :** Couverture de tests passée de 0% à 45%

### Phase 5 : Migration vers TypeScript

**Stratégie :** Migration fichier par fichier lors des modifications.

**Processus :**
1. Renommer `.js` en `.ts`
2. Corriger les erreurs de typage
3. Ajouter les types manquants
4. Le linter Biome valide le typage strict

**Résultat après 4 mois :** 60% du code migré vers TypeScript

### Phase 6 : Implémentation de la CI/CD

**Workflow CI/CD ajouté :**
- Lint (Biome)
- Tests (Jest)
- Build
- Analyse de sécurité (npm audit)

**Premier échec CI :**
```yaml
# CI échoue sur lint
# 450 erreurs de linting détectées
```

**Décision :** Ne pas bloquer immédiatement. Configurer la CI pour avertir sans bloquer pendant 3 mois, puis bloquer progressivement.

**Résultat après 3 mois :** CI verte, linting strict activé.

### Mesures d'impact

**Avant migration (mois 0) :**
- Couverture de tests : 0%
- Fonctions moyennes : 80 lignes
- Violations OWASP : 3
- Bugs en production : 15 par mois
- Temps de onboarding nouveau développeur : 3 semaines

**Après migration (mois 6) :**
- Couverture de tests : 45%
- Fonctions moyennes (nouveau code) : 28 lignes
- Violations OWASP : 0 (nouveau code)
- Bugs en production : 8 par mois
- Temps de onboarding nouveau développeur : 1 semaine

### Leçons apprises

1. **La migration progressive fonctionne** : La Clause d'Antériorité permet d'appliquer les règles au nouveau code sans refactoriser tout l'existant
2. **La Boy Scout Rule est efficace** : Chaque modification améliore le code environnant
3. **La CI doit être progressive** : Bloquer immédiatement sur un projet legacy crée trop de friction
4. **Les développeurs adoptent les règles** : Une fois qu'ils voient les bénéfices (code plus clair, moins de bugs), ils respectent volontairement les règles

## 8.3. Cas 3 : Mesures d'impact (DORA metrics)

Ce cas d'étude analyse l'impact de GEF sur les métriques DORA (DevOps Research and Assessment).

### Contexte

**Entreprise :** MetricsCorp
**Projet :** API de gestion de données
**Équipe :** 4 développeurs
**Période d'analyse :** 6 mois avant GEF, 6 mois après GEF

### Métriques DORA

DORA définit 4 métriques clés pour mesurer la performance des équipes logicielles :

1. **Deployment Frequency** : Fréquence de déploiement
2. **Lead Time for Changes** : Temps entre commit et déploiement
3. **Time to Restore Service** : Temps pour restaurer le service après incident
4. **Change Failure Rate** : Taux d'échec des changements

### Résultats

#### Deployment Frequency

**Avant GEF :**
- Déploiements manuels
- Processus complexe
- Fréquence : 1 déploiement par semaine

**Après GEF :**
- Déploiements automatisés via CI/CD
- Release Please automatise le versioning
- Fréquence : 3 déploiements par semaine

**Amélioration :** 3x

#### Lead Time for Changes

**Avant GEF :**
- Processus manuel de revue de code
- Pas de tests automatisés
- Lead time moyen : 5 jours

**Après GEF :**
- PRs avec template et checklist
- Tests automatisés (CI)
- Lead time moyen : 2 jours

**Amélioration :** 2.5x

#### Time to Restore Service

**Avant GEF :**
- Pas de monitoring structuré
- Logs dispersés
- Temps moyen : 4 heures

**Après GEF :**
- RESEARCH_LOG.md pour documenter les incidents
- Logs structurés via ADR
- Temps moyen : 1.5 heures

**Amélioration :** 2.7x

#### Change Failure Rate

**Avant GEF :**
- Pas de tests automatisés
- Violations de sécurité non détectées
- Taux d'échec : 15%

**Après GEF :**
- Tests automatisés (CI)
- Hooks Git détectent les secrets
- Taux d'échec : 5%

**Amélioration :** 3x

### Classification DORA

DORA classe les équipes en 4 catégories :

| Catégorie | Deployment Frequency | Lead Time | Restore Time | Failure Rate |
|---|---|---|---|---|
| **Elite** | On demand | < 1 heure | < 1 heure | < 15% |
| **High** | Entre 1 par jour et 1 par semaine | < 1 semaine | < 1 jour | < 20% |
| **Medium** | Entre 1 par mois et 1 par semaine | < 1 mois | < 1 semaine | < 30% |
| **Low** | < 1 par mois | > 6 mois | < 1 mois | 30-60% |

**Avant GEF :**
- Deployment Frequency : Low (1 par semaine)
- Lead Time : Medium (5 jours)
- Restore Time : Medium (4 heures)
- Failure Rate : Medium (15%)
- **Classification globale : Medium**

**Après GEF :**
- Deployment Frequency : High (3 par semaine)
- Lead Time : High (2 jours)
- Restore Time : High (1.5 heures)
- Failure Rate : Elite (5%)
- **Classification globale : High**

### Autres métriques

**Couverture de tests :**
- Avant : 30%
- Après : 70%

**Dette technique (estimée) :**
- Avant : Élevée
- Après : Modérée

**Satisfaction des développeurs (enquête) :**
- Avant : 6/10
- Après : 8/10

**Principales raisons d'amélioration :**
- "Moins de temps perdu en débogage"
- "Code plus cohérent"
- "Moins de stress avant déploiement"
- "L'IA respecte nos conventions"

### Leçons apprises

1. **GEF améliore significativement les métriques DORA** : L'équipe est passée de Medium à High
2. **L'automatisation est le facteur clé** : CI/CD, Release Please, hooks Git
3. **La qualité du code impacte directement les métriques** : Moins de bugs = taux d'échec réduit
4. **Les développeurs sont plus satisfaits** : Moins de friction, plus de confiance

## 8.4. Leçons apprises et ajustements

### Leçon 1 : Les verrous mécaniques sont essentiels

**Observation :** Dans les trois cas, les verrous mécaniques (hooks Git, linter, CI) ont été les facteurs les plus efficaces pour garantir la qualité.

**Ajustement :** Rendre les verrous encore plus visibles dans la documentation et le onboarding.

### Leçon 2 : L'adoption de l'IA dépend de la configuration native

**Observation :** Les équipes qui utilisent Cursor/Windsurf ont vu un bénéfice immédiat grâce à `.cursorrules`. Celles qui n'utilisent pas d'IDE IA ont moins bénéficié de cette fonctionnalité.

**Ajustement :** Ajouter une section dans le README sur l'intégration avec les IDEs IA et former les équipes à leur utilisation.

### Leçon 3 : La migration progressive est préférable à la réécriture

**Observation :** La tentative de réécriture complète (Cas 2 initial) a été abandonnée. La migration progressive via Boy Scout Rule a réussi.

**Ajustement :** Renforcer la documentation sur la Clause d'Antériorité et la Boy Scout Rule dans le Playbook.

### Leçon 4 : Les ADR sont sous-utilisés au début

**Observation :** Dans les trois cas, les développeurs ont initialement résisté à créer des ADR, les percevant comme une "surcharge administrative". Après quelques mois, ils ont apprécié la traçabilité.

**Ajustement :** Simplifier le template ADR et ajouter des exemples concrets dans la documentation.

### Leçon 5 : Les Hard Limits doivent être ajustables

**Observation :** Dans le Cas 1, l'équipe a initialement choisi le niveau "Mission Critical" mais l'a trouvé trop restrictif. Ils sont passés à "Standard" après 2 mois.

**Ajustement :** Ajouter une commande `npx create-gef reconfigure` pour permettre le changement de niveau de sévérité sans recréer le projet.

### Leçon 6 : La CI doit être progressive pour les projets legacy

**Observation :** Bloquer immédiatement la CI sur un projet legacy (Cas 2) a causé trop de friction. L'approche progressive (avertir puis bloquer) a fonctionné.

**Ajustement :** Ajouter un mode "legacy" dans le générateur CI qui configure des étapes progressives.

## Résumé du chapitre

Les trois études de cas démontrent l'efficacité de GEF dans différents contextes :

**Cas 1 (Nouveau projet) :** Implémentation complète d'une application SaaS avec GEF. Les verrous mécaniques ont fonctionné, l'IA a respecté les règles grâce à `.cursorrules`, et la documentation ADR a amélioré la cohérence. Les métriques ont montré une amélioration significative (couverture de tests 40% → 75%, bugs en production -67%).

**Cas 2 (Migration legacy) :** Migration progressive d'un projet existant via la Boy Scout Rule. La Clause d'Antériorité a permis d'appliquer les règles au nouveau code sans refactoriser tout l'existant. Après 6 mois, couverture de tests 0% → 45%, fonctions moyennes 80 → 28 lignes (nouveau code).

**Cas 3 (Métriques DORA) :** Analyse de l'impact sur les métriques DORA. L'équipe est passée de la classification Medium à High, avec des améliorations sur toutes les métriques (Deployment Frequency 3x, Lead Time 2.5x, Restore Time 2.7x, Failure Rate 3x).

Les leçons apprises incluent : l'importance des verrous mécaniques, la nécessité de la configuration native pour l'IA, la supériorité de la migration progressive, la sous-utilisation initiale des ADR, la nécessité d'ajustabilité des Hard Limits, et l'approche progressive de la CI pour les projets legacy.

Dans le chapitre suivant, nous explorerons l'intégration de GEF dans une équipe existante.
