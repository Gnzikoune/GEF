# Contribuer au Guardian Engineering Framework (GEF)

Tout d'abord, **merci** de l'intérêt que vous portez au GEF ! 🎉 

Ce projet est conçu pour éradiquer l'improvisation dans le développement logiciel en imposant des règles d'ingénierie strictes et automatisées. En contribuant à ce dépôt, vous aidez à élever les standards de toute la communauté.

---

## 🧭 Notre Philosophie (À lire impérativement)

Avant toute ligne de code, veuillez lire le document fondateur du projet :
👉 **[L'Engineering Playbook](./ENGINEERING_PLAYBOOK.md)**.

**La règle d'or de GEF :** "Les règles textuelles sont inutiles si elles peuvent être contournées." Toute contribution à ce framework (nouvelle feature, nouveau générateur, règles linter) doit se traduire par une **mécanique physique bloquante** pour les développeurs ou les IA, et non par un simple "conseil" textuel.

---

## 🛠 Environnement de Développement Local

Le GEF est un outil CLI (Command Line Interface). Pour développer et tester vos modifications localement :

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Gnzikoune/GEF.git
   cd GEF
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lier la CLI globalement**
   ```bash
   # Rend la commande 'create-gef' disponible globalement sur votre machine
   npm link
   ```

4. **Tester vos changements**
   Créez un dossier de test *en dehors* du dépôt GEF, puis exécutez la commande locale :
   ```bash
   cd ../mon-dossier-de-test
   create-gef
   ```

---

## 🚦 Processus de Contribution (Git Flow)

Nous appliquons la discipline que nous prêchons (§14 du Playbook).

### 1. Ouvrir une Issue (Obligatoire)
Ne commencez **jamais** à coder une nouvelle fonctionnalité majeure sans avoir ouvert une [Issue GitHub](https://github.com/Gnzikoune/GEF/issues) au préalable. Cela permet à l'équipe centrale de valider l'approche architecturale et d'éviter que vous ne perdiez votre temps.

### 2. Créer une branche
Utilisez la convention de nommage standard :
- `feat/nom-de-la-feature`
- `fix/nom-du-bug`
- `docs/mise-a-jour-doc`

```bash
git checkout -b feat/ajout-nouveau-framework
```

### 3. Conventional Commits (Obligatoire)
Vos commits doivent respecter la spécification [Conventional Commits](https://www.conventionalcommits.org/). De plus, **tout commit doit faire référence à l'Issue associée**.

Exemples valides :
- `feat(generator): ajout du support pour Vue.js (#42)`
- `fix(cli): correction du chemin absolu sur Windows (#43)`
- `docs: mise à jour du README (#44)`

> **Note :** Le dépôt contient un hook Git `commit-msg` qui bloquera physiquement tout commit ne respectant pas ce format.

---

## ✅ Exigences pour les Pull Requests

Une fois votre développement terminé :

1. Assurez-vous que votre code respecte le lint (vous pouvez vérifier en local si nécessaire).
2. Ouvrez une Pull Request ciblant la branche `main`.
3. **Le Template de Pull Request** apparaîtra automatiquement : vous devez le remplir et cocher toutes les cases applicables.
4. **La Validation CI (Garantie Anti-Contournement)** s'exécutera sur GitHub :
   - Votre PR passera obligatoirement par notre Workflow "PR Intention Check" (qui s'assure de la pertinence métier de votre PR).
   - Le linting et les éventuels tests seront exécutés.

### Code de Conduite
Ce projet suit les standards professionnels de l'industrie. Les revues de code doivent être constructives, bienveillantes, et axées sur la qualité technique et le respect absolu de l'architecture.

Merci encore pour votre contribution à l'ingénierie logicielle ! 🚀
