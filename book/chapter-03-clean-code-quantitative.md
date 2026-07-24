# Chapitre 3 : Clean Code Quantitatif

## 3.1. Pourquoi les chiffres comptent

La plupart des discussions sur Clean Code sont qualitatives. On parle de "lisibilité", de "maintenabilité", de "clarté". Ces concepts sont importants, mais ils souffrent d'un problème fondamental : ils sont subjectifs.

Ce qui est lisible pour un développeur peut être obscur pour un autre. Ce qui semble maintenable aujourd'hui peut devenir un cauchemar demain. Les jugements qualitatifs varient selon l'expérience, les préférences personnelles, et le contexte.

GEF adopte une approche différente : **le Clean Code quantitatif**.

Au lieu de dire "les fonctions doivent être courtes", GEF dit "les fonctions ne doivent pas dépasser 30 lignes".

Au lieu de dire "évitez la complexité", GEF dit "la complexité cyclomatique ne doit pas dépasser 10".

Au lieu de dire "n'utilisez pas trop de paramètres", GEF dit "maximum 3 paramètres par fonction".

Pourquoi cette approche quantitative ?

### 1. Elle est objective

Une fonction de 31 lignes viole la règle. Une fonction de 30 lignes la respecte. Il n'y a pas d'ambiguïté, pas de débat, pas d'interprétation.

### 2. Elle est automatisable

Un linter peut vérifier automatiquement ces limites. Un humain n'a pas à relire chaque fonction pour juger si elle est "trop longue".

### 3. Elle est cohérente

Tous les développeurs, toutes les IA, tous les commits sont jugés selon les mêmes critères chiffrés. Il n'y a pas de "tolérance" pour certains et de sévérité pour d'autres.

### 4. Elle est adaptable

Les limites peuvent être ajustées selon le contexte du projet. Une startup en R&D peut accepter des fonctions de 50 lignes. Un système mission-critical peut exiger 15 lignes. Mais une fois la limite fixée, elle est appliquée uniformément.

## 3.2. Hard Limits : métriques et seuils

GEF définit des "Hard Limits" — des seuils quantitatifs qui ne peuvent pas être dépassés. Ces limites sont injectées dans le Playbook, les prompts IA, et les configurations de linter.

Les limites varient selon trois niveaux de sévérité :

| Niveau | Fonctions max | Params max | Complexité max | Payload JSON max |
|---|---|---|---|---|
| **Startup / R&D** | 50 lignes | 4 | 15 | 5 Mo |
| **Standard / Enterprise** | 30 lignes | 3 | 10 | 1 Mo |
| **Mission Critical** | 15 lignes | 2 | 5 | 100 Ko |

Le niveau est choisi lors de la création du projet via le générateur. Une fois choisi, il est :
- Injecté dans le `.cursorrules` pour que les IA le connaissent
- Configuré dans le linter (Biome, ESLint, Ruff)
- Documenté dans le `PROJECT_CONFIG.md`

### Pourquoi ces niveaux ?

**Startup / R&D** : La vitesse prime sur la perfection. Les limites sont plus souples pour permettre l'expérimentation rapide.

**Standard / Enterprise** : L'équilibre entre vitesse et qualité. C'est le niveau recommandé pour la plupart des projets.

**Mission Critical** : La qualité et la sécurité prime sur tout. Les limites sont très strictes pour les systèmes où une erreur peut avoir des conséquences graves (santé, finance, transport).

## 3.3. Complexité cyclomatique comme mesure de sécurité

La complexité cyclomatique est une métrique logicielle qui mesure le nombre de chemins d'exécution indépendants dans un programme. Elle a été introduite par Thomas McCabe en 1976.

Une fonction avec une complexité cyclomatique de 1 n'a qu'un seul chemin d'exécution (pas de conditions, pas de boucles). Une fonction avec une complexité de 10 a 10 chemins possibles.

Pourquoi GEF s'intéresse-t-il à la complexité cyclomatique ?

Parce que **la complexité est l'ennemie de la sécurité**.

Une fonction avec une complexité élevée :
- Est plus difficile à tester (il faut tester tous les chemins)
- Est plus difficile à comprendre (plus de cas à mentalement tracer)
- Est plus susceptible de contenir des bugs (plus de conditions, plus d'erreurs potentielles)
- Est plus difficile à maintenir (un changement peut affecter de nombreux chemins)

GEF impose des limites de complexité cyclomatique :
- 15 pour Startup / R&D
- 10 pour Standard / Enterprise
- 5 pour Mission Critical

Ces limites sont configurées dans le linter. Si une fonction dépasse la limite, le linter refuse de compiler.

### Exemple

```javascript
// Complexité cyclomatique : 1 (un seul chemin)
function calculateTotal(price, quantity) {
  return price * quantity;
}

// Complexité cyclomatique : 3 (trois chemins)
function calculateDiscount(price, quantity, isMember) {
  if (isMember) {
    if (quantity > 10) {
      return price * quantity * 0.9;
    }
    return price * quantity * 0.95;
  }
  return price * quantity;
}
```

La deuxième fonction a une complexité de 3 parce qu'elle contient deux conditions imbriquées, créant trois chemins d'exécution possibles.

## 3.4. Nesting et Guard Clauses

Le "nesting" est la profondeur d'imbrication des structures de contrôle (if, for, while). Un code profondément imbriqué est difficile à lire et à comprendre.

GEF impose une limite de nesting : **3 niveaux maximum**.

Au-delà de 3 niveaux, le code devient difficile à suivre mentalement. Le développeur doit "empiler" les conditions dans sa tête, ce qui augmente la charge cognitive.

### Guard Clauses (Early Return)

Pour respecter la limite de nesting, GEF recommande l'utilisation des Guard Clauses (aussi appelées Early Return).

Le principe est simple : traiter d'abord les cas exceptionnels ou les conditions de sortie, puis continuer avec le cas principal.

**Sans Guard Clause (nesting profond) :**
```javascript
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // Logique principale
        return process(user);
      }
    }
  }
  return null;
}
```

**Avec Guard Clauses (nesting réduit) :**
```javascript
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;
  
  // Logique principale
  return process(user);
}
```

La deuxième version a un nesting de 0 (toutes les conditions sont au même niveau). Elle est plus facile à lire et à comprendre.

GEF configure le linter pour détecter un nesting excessif et suggérer l'utilisation de Guard Clauses.

## 3.5. La règle de 3 et le refactoring

La "règle de 3" est un principe de refactoring popularisé par Don Roberts :

- La 1ère fois : Écrire pour résoudre
- La 2ème fois : Tolérer la duplication
- La 3ème fois : Refactoriser obligatoirement en abstraction réutilisable

Pourquoi cette règle ?

Parce que le refactoring prématuré est une perte de temps. Si vous ne voyez un pattern qu'une fois, vous ne savez pas s'il se répétera. Le refactorediser peut introduire de la complexité inutile.

Si vous voyez le pattern une deuxième fois, c'est peut-être une coïncidence. Tolérer la duplication est acceptable.

Mais si vous voyez le pattern une troisième fois, c'est un signal. Le pattern est réel et se répétera. Le refactoring devient nécessaire pour éviter la duplication future.

GEF intègre cette règle de deux manières :

### 1. Dans les prompts IA

L'IA est instruite de suivre la règle de 3. Elle ne refactorise pas automatiquement dès la première duplication. Elle attend la troisième occurrence.

### 2. Dans les outils d'analyse

Bien que GEF n'inclut pas encore d'outil automatique de détection de duplication, la règle est documentée dans le Playbook pour guider les décisions de refactoring manuel.

## 3.6. Conventions de nommage

Les conventions de nommage semblent triviales, mais elles ont un impact majeur sur la lisibilité et la maintenabilité du code. GEF impose des conventions strictes :

| Type | Convention | Exemple |
|---|---|---|
| Fichiers / Dossiers | kebab-case | `user-profile.tsx` |
| Classes / Composants | PascalCase | `UserProfile` |
| Variables / Fonctions | camelCase | `getUserData` |
| Constantes Globales | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

Ces conventions sont configurées dans le linter (Biome, ESLint, Ruff). Si un fichier ou une variable ne respecte pas la convention, le linter génère un avertissement.

### Pourquoi ces conventions ?

**kebab-case pour les fichiers** : Compatible avec tous les systèmes de fichiers (Windows, Linux, macOS). Évite les problèmes de casse.

**PascalCase pour les classes/composants** : Convention standard en JavaScript, TypeScript, Java, C#. Distingue clairement les classes des fonctions.

**camelCase pour les variables/fonctions** : Convention standard en JavaScript, Python, Go. Facile à lire et à taper.

**UPPER_SNAKE_CASE pour les constantes** : Signale visuellement qu'il s'agit d'une constante qui ne doit pas être modifiée.

### Rigueur du linter

GEF configure le linter pour être strict : zéro warning ignoré sans commentaire explicatif.

Si un développeur doit violer une convention (par exemple pour compatibilité avec une API externe), il doit ajouter un commentaire expliquant pourquoi. Le linter acceptera alors la violation, mais l'explication reste dans le code pour les futurs lecteurs.

## 3.7. Feature-Sliced Design en pratique

Feature-Sliced Design (FSD) est une approche d'architecture logicielle qui organise le code par fonctionnalité métier, plutôt que par couche technique.

### Architecture par couches (anti-pattern)

L'architecture traditionnelle organise le code par couche technique :

```
src/
├── controllers/
│   ├── auth-controller.js
│   ├── user-controller.js
│   └── product-controller.js
├── models/
│   ├── auth-model.js
│   ├── user-model.js
│   └── product-model.js
├── views/
│   ├── auth-view.js
│   ├── user-view.js
│   └── product-view.js
└── services/
    ├── auth-service.js
    ├── user-service.js
    └── product-service.js
```

Le problème : pour modifier une fonctionnalité (par exemple, l'authentification), il faut naviguer entre plusieurs dossiers (controllers, models, views, services). La cohésion est faible.

### Feature-Sliced Design (pattern recommandé)

FSD organise le code par fonctionnalité métier :

```
src/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth-api.ts
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   └── model/
│   │       └── auth-model.ts
│   ├── user/
│   │   ├── api/
│   │   │   └── user-api.ts
│   │   ├── components/
│   │   │   └── UserProfile.tsx
│   │   └── model/
│   │       └── user-model.ts
│   └── product/
│       ├── api/
│       │   └── product-api.ts
│       ├── components/
│       │   └── ProductList.tsx
│       └── model/
│           └── product-model.ts
├── shared/
│   ├── ui/
│   │   └── Button.tsx
│   └── api/
│       └── http-client.ts
└── app/
    └── App.tsx
```

Le bénéfice : pour modifier une fonctionnalité, tout le code pertinent est dans un seul dossier. La cohésion est forte.

### Structure FSD

GEF recommande la structure FSD suivante :

- **app/** : Code d'initialisation de l'application (routing, providers)
- **shared/** : Code partagé entre plusieurs features (UI components, utilities)
- **entities/** : Entités métier de haut niveau (User, Product)
- **features/** : Fonctionnalités métier spécifiques (Auth, Billing, Search)
- **pages/** : Pages de l'application (HomePage, DashboardPage)
- **widgets/** : Composants composés réutilisables (SearchBar, UserMenu)

Cette structure est documentée dans le Playbook et intégrée dans les prompts IA pour guider l'organisation du code généré.

## Résumé du chapitre

Le Clean Code quantitatif de GEF remplace les jugements subjectifs par des limites chiffrées objectives. Les Hard Limits (taille des fonctions, nombre de paramètres, complexité cyclomatique) sont configurées selon le niveau de sévérité du projet et imposées par les linters.

La complexité cyclomatique est utilisée comme mesure de sécurité : une fonction complexe est plus difficile à tester, comprendre et maintenir. GEF impose une limite de nesting de 3 niveaux et recommande les Guard Clauses pour réduire l'imbrication.

La règle de 3 guide le refactoring : tolérer la duplication jusqu'à la troisième occurrence, puis abstraire. Les conventions de nommage strictes (kebab-case, PascalCase, camelCase, UPPER_SNAKE_CASE) sont configurées dans les linters.

Enfin, Feature-Sliced Design organise le code par fonctionnalité métier plutôt que par couche technique, améliorant la cohésion et la maintenabilité.

Dans le chapitre suivant, nous explorerons comment GEF applique ces principes quantitatifs à la sécurité OWASP.
