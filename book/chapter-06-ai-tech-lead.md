# Chapitre 6 : L'IA comme Tech Lead Virtuel

## 6.1. Pilotage Kanban et création d'issues

Le Guardian Engineering Framework ne se contente pas de fournir des règles à l'IA. Il la transforme en véritable Tech Lead Virtuel capable de piloter le workflow de développement de manière autonome, sous le contrôle de l'intention humaine.

### Création automatique d'issues

L'IA peut utiliser GitHub CLI (`gh`) pour créer des issues de manière autonome. Cette capacité est particulièrement utile pour :

- **Découper un grand chantier** en sous-tâches gérables
- **Créer des tickets de suivi** pour les bugs découverts
- **Documenter les décisions** qui nécessitent une discussion
- **Planifier les dépendances** entre fonctionnalités

**Exemple de workflow :**

1. L'humain décrit un objectif métier : "Je veux que les utilisateurs puissent se connecter avec Google OAuth"
2. L'IA analyse les dépendances et crée les issues :
   - Issue #42 : "Configurer Google OAuth Console"
   - Issue #43 : "Implémenter le endpoint de callback OAuth"
   - Issue #44 : "Créer la page de connexion avec bouton Google"
   - Issue #45 : "Gérer les tokens OAuth dans la base de données"
   - Issue #46 : "Ajouter les tests E2E pour OAuth"
3. L'IA lie ces issues entre elles (dépendances)
4. L'humain valide le plan
5. L'IA commence le développement, en liant chaque commit à l'issue correspondante

### Commande GitHub CLI

L'IA utilise la commande `gh issue create` pour créer des issues :

```bash
gh issue create \
  --title "Configurer Google OAuth Console" \
  --body "Créer un projet dans Google Cloud Console, activer l'API Google+ OAuth, configurer les URIs de redirection" \
  --label "authentication,google" \
  --assignee @developer
```

Cette commande est intégrée dans les prompts IA de GEF, notamment dans `feature_development.md` et `new_project_kickoff.md`.

### Lien commits-issues

Chaque commit doit inclure une référence à l'issue correspondante via le format `#XYZ` :

```
feat(auth): configuration du client Google OAuth (#42)
```

Ce lien assure la traçabilité complète : chaque ligne de code peut être retracée jusqu'à l'issue métier qui l'a motivée.

### Création de Pull Requests

Une fois le développement terminé, l'IA peut créer automatiquement une Pull Request via `gh pr create` :

```bash
gh pr create \
  --title "feat(auth): implémentation de Google OAuth (#42-46)" \
  --body "Implémente l'authentification Google OAuth complète. Closes #42, #43, #44, #45, #46" \
  --base main
```

La PR inclut automatiquement :
- Le titre formaté selon Conventional Commits
- La description avec les issues liées
- Le template de PR avec checklist (généré par GEF)

### Validation humaine obligatoire

C'est ici que réside la clé du modèle : **l'IA ne merge jamais elle-même**.

L'IA prépare tout :
- Les issues sont créées
- Le code est développé
- Les tests sont écrits
- La PR est ouverte
- La checklist est remplie

Mais le bouton "Merge" doit être cliqué par un humain.

Pourquoi ?

- **Responsabilité** : L'humain reste responsable du code livré
- **Jugement** : L'humain valide que l'intention métier est correctement implémentée
- **Apprentissage** : L'humain apprend en revoyant le code de l'IA
- **Sécurité** : L'humain peut détecter des problèmes que l'IA a manqués

## 6.2. Auto-documentation ADR

Les Architecture Decision Records (ADR) sont des documents qui capturent les décisions architecturales importantes, leur contexte, leurs alternatives, et leurs conséquences.

GEF impose que toute décision architecturale majeure soit documentée dans un ADR avant d'être implémentée.

### Quand créer un ADR ?

L'IA doit créer un ADR pour :
- Choix d'une nouvelle dépendance majeure (ex: passer de Redux à Zustand)
- Changement d'architecture (ex: passer de monolithe à microservices)
- Choix de base de données (ex: passer de PostgreSQL à MongoDB)
- Choix de cloud provider (ex: passer de Vercel à AWS)
- Changement de protocole (ex: passer de REST à GraphQL)
- Décisions de sécurité (ex: implémenter un nouveau schéma d'authentification)

### Template ADR généré par GEF

GEF génère un template `docs/explanation/adr/0000-template.md` :

```markdown
# ADR-XXXX : [Titre de la décision]

## Statut
Proposé | Accepté | Rejeté | Déprécié | Supersédé par [ADR-YYYY]

## Contexte
Quel est le problème que nous essayons de résoudre ?
Quelles sont les contraintes ?

## Décision
Quelle est la décision que nous avons prise ?

## Conséquences
Quels sont les impacts de cette décision ?
- Positifs : ...
- Négatifs : ...

## Alternatives
Quelles alternatives avons-nous considérées ?
- Alternative 1 : ...
- Alternative 2 : ...

## Références
Liens vers la documentation, les discussions, etc.
```

### Workflow ADR avec l'IA

1. **Détection** : L'IA détecte qu'une décision architecturale est nécessaire
2. **Rédaction** : L'IA rédige un ADR en utilisant le template
3. **Discussion** : L'IA soumet l'ADR pour revue humaine
4. **Validation** : L'humain approuve ou rejette la décision
5. **Implémentation** : Si approuvée, l'IA implémente la décision
6. **Référence** : L'IA lie le code à l'ADR dans les commentaires

### Exemple concret

**Scénario :** L'équipe doit choisir entre Redux et Zustand pour la gestion d'état.

**Action de l'IA :**
1. L'IA crée `docs/explanation/adr/0001-state-management.md`
2. L'IA remplit le template avec :
   - Contexte : "Actuellement, nous n'avons pas de gestion d'état globale. Les props drilling deviennent complexes."
   - Décision proposée : "Utiliser Zustand pour la gestion d'état"
   - Conséquences : "Plus léger que Redux, API plus simple, moins de boilerplate"
   - Alternatives : "Redux (plus mature, mais plus verbeux), Context API (natif, mais pas optimisé pour les updates fréquents)"
3. L'IA soumet l'ADR pour revue
4. L'humain approuve
5. L'IA implémente Zustand
6. L'IA ajoute des commentaires dans le code : `// Voir ADR-0001`

### Pourquoi cette règle ?

- **Traçabilité** : Pourquoi avons-nous choisi cette solution ? L'ADR le documente
- **Discussion** : La décision est discutée avant d'être implémentée
- **Apprentissage** : Les nouveaux membres de l'équipe comprennent les décisions passées
- **Réversibilité** : Si la décision s'avère mauvaise, l'ADR documente les alternatives

## 6.3. TDD piloté par l'IA

Le Test-Driven Development (TDD) est une pratique où les tests sont écrits avant le code applicatif. GEF étend ce principe à l'IA : l'IA doit d'abord écrire le test E2E qui décrit le comportement attendu, puis écrire le code pour faire passer ce test au vert.

### Workflow TDD avec l'IA

1. **Spécification** : L'humain décrit le comportement attendu
2. **Test E2E** : L'IA écrit un test E2E (Playwright) qui décrit ce comportement
3. **Exécution** : Le test échoue (le code n'existe pas encore)
4. **Implémentation** : L'IA écrit le code applicatif
5. **Validation** : Le test passe
6. **Refactoring** : L'IA refactorise si nécessaire

### Exemple : Authentification OAuth

**Spécification humaine :**
"Quand un utilisateur clique sur 'Se connecter avec Google', il doit être redirigé vers Google, s'authentifier, puis être redirigé vers notre application avec un token valide."

**Test E2E écrit par l'IA (Playwright) :**
```typescript
test('Google OAuth authentication flow', async ({ page }) => {
  await page.goto('/login');
  
  // Cliquer sur le bouton Google
  await page.click('button[data-testid="google-login"]');
  
  // Vérifier la redirection vers Google
  expect(page.url()).toContain('accounts.google.com');
  
  // Simuler l'authentification réussie (via mock)
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  
  // Vérifier la redirection vers notre application
  await page.waitForURL('/dashboard');
  
  // Vérifier que l'utilisateur est authentifié
  const userMenu = page.locator('[data-testid="user-menu"]');
  await expect(userMenu).toBeVisible();
});
```

**Implémentation par l'IA :**
L'IA écrit ensuite le code nécessaire pour faire passer ce test :
- Configuration OAuth dans le backend
- Endpoint de callback
- Stockage du token
- Redirections

### Avantages du TDD piloté par l'IA

1. **Spécification exécutable** : Le test est la spécification. Il ne peut pas être ambigu.
2. **Regression testing** : Si une modification casse le comportement, le test échoue.
3. **Documentation vivante** : Le test documente le comportement attendu.
4. **Focus sur le comportement** : L'IA se concentre sur "quoi faire" avant "comment faire".

### Intégration avec les prompts GEF

Le prompt `feature_development.md` instruit l'IA de suivre ce workflow TDD :

> "Avant d'écrire le code applicatif, rédigez d'abord un test E2E (Playwright) qui décrit le comportement attendu. Implémenteze ensuite le code pour faire passer ce test au vert."

## 6.4. Prompts contextuels et spécialisés

GEF fournit six prompts IA spécialisés, chacun adapté à un contexte spécifique. Ces prompts contiennent les règles du Playbook injectées avec les Hard Limits adaptés au niveau de sévérité du projet.

### system_prompt.md

**Quand l'utiliser :** Toujours — à charger en début de chaque session de travail.

**Contenu :**
- Règles de Clean Code (limites de taille, complexité, paramètres)
- Règles d'architecture (Feature-Sliced Design)
- Règles de sécurité (OWASP, validation, secrets)
- Règles Git (Conventional Commits, référence Kanban)
- Crash Clause (arrêter en cas d'obstacle)

**Exemple d'instruction :**
> "Les fonctions ne doivent pas dépasser 30 lignes. Si une fonction dépasse cette limite, arrêtez et demandez à l'utilisateur comment la refactoriser."

### feature_development.md

**Quand l'utiliser :** Lors du développement d'une nouvelle fonctionnalité.

**Contenu :**
- Workflow TDD (écrire le test d'abord)
- Création d'issues si nécessaire
- Rédaction d'ADR pour les décisions architecturales
- Conventions de nommage
- Structure de dossiers (Feature-Sliced Design)

**Exemple d'instruction :**
> "Avant d'implémenter cette fonctionnalité, créez une issue GitHub pour la tracker. Si la fonctionnalité nécessite une décision architecturale majeure, rédigez un ADR d'abord."

### code_review.md

**Quand l'utiliser :** Lors d'une revue de code.

**Contenu :**
- Critères de revue (Clean Code, sécurité, architecture)
- Checklist de validation
- Format des commentaires constructifs
- Focus sur l'intention métier

**Exemple d'instruction :**
> "Lors de la revue, vérifiez que le code respecte les Hard Limits du projet. Si une fonction dépasse 30 lignes, signalez-le. Vérifiez également que tous les commits incluent une référence Kanban."

### bugfix.md

**Quand l'utiliser :** Lors de la correction d'un bug.

**Contenu :**
- Méthodologie de debugging (isoler, reproduire, corriger)
- Écriture de tests de régression
- Documentation dans RESEARCH_LOG.md
- Commit format (`fix:`)

**Exemple d'instruction :**
> "Avant de corriger le bug, écrivez un test qui reproduit le problème. Une fois le bug corrigé, ce test doit passer. Documentez la cause racine dans RESEARCH_LOG.md."

### adr_writing.md

**Quand l'utiliser :** Lors d'une décision architecturale importante.

**Contenu :**
- Structure du template ADR
- Types de décisions nécessitant un ADR
- Processus de validation
- Liens avec le code

**Exemple d'instruction :**
> "Utilisez le template ADR situé dans docs/explanation/adr/0000-template.md. Assurez-vous de documenter le contexte, la décision, les conséquences et les alternatives considérées."

### new_project_kickoff.md

**Quand l'utiliser :** Au tout démarrage d'un nouveau projet.

**Contenu :**
- Analyse des besoins
- Choix de stack
- Planification initiale
- Configuration de GEF
- Définition des Hard Limits

**Exemple d'instruction :**
> "Analysez les besoins du projet et proposez une stack adaptée. Utilisez `npx create-gef` pour initialiser le projet avec les configurations appropriées."

## 6.5. Crash Clause Anti-Contournement

La Crash Clause est la règle la plus importante du Playbook GEF. Elle stipule que l'IA doit s'arrêter immédiatement et signaler tout obstacle, plutôt que d'improviser une solution silencieuse.

### Énoncé de la Crash Clause

> "Face à une erreur, un obstacle ou une ambiguïté : ARRÊTER IMMÉDIATEMENT et signaler le problème à l'utilisateur avec précision. Ne JAMAIS improviser une solution de contournement (workaround) silencieuse pour atteindre l'objectif coûte que coûte."

### Quand s'applique la Crash Clause

L'IA doit invoquer la Crash Clause dans les situations suivantes :

1. **Erreur technique** : Une commande échoue, une dépendance ne s'installe pas
2. **Consigne ambiguë** : La demande de l'utilisateur n'est pas claire
3. **Outil manquant** : Un outil nécessaire n'est pas disponible
4. **Conflit de règles** : Deux règles du Playbook semblent contradictoires
5. **Limite dépassée** : Le code généré dépasse les Hard Limits
6. **Sécurité compromise** : Une pratique de sécurité est violée

### Exemples d'application

**Scénario 1 : Erreur technique**
```
IA : "Je tente d'installer la dépendance 'xyz' mais npm retourne une erreur 404.
     Cette dépendance n'existe peut-être plus ou le nom est incorrect.
     Veuillez vérifier le nom de la dépendance ou me fournir une alternative."
```

**Scénario 2 : Consigne ambiguë**
```
IA : "Vous avez demandé d'améliorer les performances, mais vous n'avez pas précisé
     quelles parties de l'application optimiser. Voulez-vous que j'optimise :
     - Le temps de chargement initial ?
     - Le temps de réponse des API ?
     - Le rendu des composants ?
     Veuillez préciser votre demande."
```

**Scénario 3 : Limite dépassée**
```
IA : "La fonction 'processUserData' que je dois écrire nécessite 5 paramètres
     selon votre spécification, mais le projet a une limite de 3 paramètres maximum.
     Voulez-vous que je :
     - Crée un objet de configuration pour regrouper ces paramètres ?
     - Réduire le nombre de paramètres en simplifiant la fonction ?
     - Augmenter la limite du projet (non recommandé) ?"
```

### Pourquoi la Crash Clause est essentielle

1. **Évite les workarounds toxiques** : Sans la Crash Clause, l'IA pourrait "bricoler" une solution qui fonctionne mais fragile
2. **Maintient la qualité** : L'IA ne sacrifie pas la qualité pour atteindre l'objectif
3. **Transparence** : L'utilisateur sait exactement ce qui bloque
4. **Apprentissage** : L'utilisateur apprend en résolvant les obstacles avec l'IA

### Intégration dans les prompts

La Crash Clause est inscrite en gras et en rouge (visuellement) dans tous les prompts GEF, notamment dans `system_prompt.md` :

> **CRASH CLAUSE — ZÉRO CONTOURNEMENT SILENCIEUX**
> 
> Face à une erreur, un obstacle ou une ambiguïté : ARRÊTER IMMÉDIATEMENT et signaler le problème à l'utilisateur avec précision. Ne JAMAIS improviser une solution de contournement (workaround) silencieuse pour atteindre l'objectif coûte que coûte.

## 6.6. Limites de l'autonomie actuelle

Il est important de comprendre les limites de l'autonomie de l'IA dans le cadre de GEF. L'IA n'est pas un développeur autonome qui peut travailler sans supervision. Elle est un **Tech Lead Virtuel sous contrôle humain**.

### Ce que l'IA peut faire

- **Générer du code** selon les spécifications
- **Créer des issues** et des Pull Requests
- **Rédiger des ADR** pour les décisions architecturales
- **Écrire des tests** avant le code (TDD)
- **Détecter les violations** des règles du Playbook
- **Proposer des refactorings** basés sur la règle de 3

### Ce que l'IA ne peut pas faire

- **Merger des Pull Requests** : Toujours nécessite une validation humaine
- **Prendre des décisions métier** : L'IA ne connaît pas les enjeux business
- **Modifier les règles du projet** : Les Hard Limits sont fixés par l'humain
- **Contourner les verrous mécaniques** : L'IA ne peut pas désactiver les hooks Git ou le linter
- **Ignorer la Crash Clause** : L'IA doit s'arrêter en cas d'obstacle
- **Refactoriser proactivement** : L'IA ne refactorise pas l'ancien code sans demande explicite

### Pourquoi ces limites ?

1. **Responsabilité** : L'humain reste responsable du code livré
2. **Jugement** : L'IA n'a pas le jugement contextuel nécessaire pour les décisions métier
3. **Sécurité** : Les limites empêchent l'IA de causer des dommages
4. **Alignement** : L'IA doit rester alignée sur l'intention humaine

### Niveaux d'autonomie

On peut conceptualiser l'autonomie de l'IA dans GEF comme suit :

| Niveau | Autonomie | Contrôle humain |
|---|---|---|
| **Niveau 1 (Actuel)** | Exécution de tâches spécifiques | Validation à chaque étape critique |
| **Niveau 2 (Futur possible)** | Exécution de workflows complets | Validation à la fin du workflow |
| **Niveau 3 (Spéculatif)** | Autonomie dans un domaine défini | Validation périodique |

GEF est actuellement au Niveau 1. L'IA peut exécuter des tâches spécifiques (créer une issue, écrire une fonction, rédiger un ADR), mais chaque étape critique (merge, décision métier, modification de règles) nécessite une validation humaine.

## 6.7. L'humain reste responsable

Malgré l'autonomie croissante de l'IA, l'humain reste et restera responsable. C'est un principe fondamental de GEF.

### Responsabilité technique

L'humain est responsable de :
- La qualité du code livré
- La sécurité de l'application
- La performance du système
- La maintenabilité du codebase

L'IA peut générer du code, mais l'humain valide que ce code est de qualité, sécurisé, performant et maintenable.

### Responsabilité métier

L'humain est responsable de :
- La définition des objectifs
- La priorisation des fonctionnalités
- L'arbitrage entre compromis
- L'alignement avec la stratégie business

L'IA ne connaît pas les enjeux métier de l'entreprise. Elle ne peut pas décider si une fonctionnalité est prioritaire ou non.

### Responsabilité juridique

L'humain est responsable de :
- La conformité aux régulations (GDPR, etc.)
- La gestion des données sensibles
- Les licences logicielles
- Les contrats avec les clients

Une IA ne peut pas être tenue juridiquement responsable. Si une violation de GDPR survient, c'est l'entreprise (et donc les humains) qui en subit les conséquences.

### Responsabilité éthique

L'humain est responsable de :
- Les décisions éthiques (biais algorithmiques, etc.)
- L'impact social du logiciel
- La transparence envers les utilisateurs
- La confidentialité des données

L'IA n'a pas de sens moral. Elle ne peut pas juger si une décision est éthique ou non.

### Le modèle amplificateur

GEF positionne l'IA non pas comme un remplaçant, mais comme un **amplificateur** des capacités humaines :

- L'IA amplifie la vitesse de développement
- L'IA amplifie la détection d'erreurs
- L'IA amplifie la cohérence du code
- L'IA amplifie la documentation

Mais l'humain fournit :
- La vision
- Le jugement
- La responsabilité
- La créativité

C'est cette collaboration qui fait la force du modèle GEF.

## Résumé du chapitre

L'IA comme Tech Lead Virtuel dans GEF peut piloter le workflow Kanban en créant des issues via GitHub CLI, lier chaque commit à une issue, et créer des Pull Requests. Cependant, l'IA ne merge jamais elle-même — la validation humaine reste obligatoire.

L'auto-documentation ADR impose que toute décision architecturale majeure soit documentée avant implémentation, assurant la traçabilité et la discussion. Le TDD piloté par l'IA exige que l'IA écrive d'abord un test E2E décrivant le comportement attendu, puis implémente le code pour faire passer ce test.

GEF fournit six prompts contextuels et spécialisés (system, feature_development, code_review, bugfix, adr_writing, new_project_kickoff) contenant les règles du Playbook injectées avec les Hard Limits adaptés. La Crash Clause Anti-Contournement oblige l'IA à s'arrêter et signaler tout obstacle plutôt que d'improviser une solution silencieuse.

L'autonomie de l'IA est limitée : elle ne peut pas merger des PR, prendre des décisions métier, modifier les règles du projet, ou contourner les verrous mécaniques. L'humain reste responsable techniquement, métier, juridiquement et éthiquement. GEF positionne l'IA comme amplificateur des capacités humaines, pas comme remplaçant.

Dans le chapitre suivant, nous verrons une démonstration pratique de GEF en action.
