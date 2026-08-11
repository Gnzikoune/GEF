# Tutoriel : Démarrer avec le GEF (Pour Juniors et Nouveaux Arrivants)

Bienvenue dans un projet propulsé par le **Guardian Engineering Framework (GEF)** ! 
Ce framework est là pour vous aider à produire du code robuste et à collaborer de manière transparente avec des agents IA (comme Cursor ou Windsurf) et avec votre équipe.

Ce guide rapide vous explique comment travailler au quotidien sous la protection du GEF.

---

## 1. Comprendre la Philosophie

Le GEF impose le **Spec-Driven Development (SDD)**. Cela signifie que l'on réfléchit (Spec) avant d'écrire du code (Vibe Coding interdit !).
De plus, il y a des limites mécaniques (Hard Limits) :
- Les fichiers ne doivent pas dépasser 400 lignes.
- Les fonctions/composants doivent rester courts et focalisés.
- Tout passe par des Pull Requests (interdiction de pousser directement sur `main`).

Ne voyez pas ces règles comme des contraintes, mais comme des garde-fous automatiques (votre "Tech Lead Virtuel") qui vous garantissent que votre code est toujours propre.

## 2. Le Cycle de Vie d'une Tâche (Le Workflow)

Voici exactement comment traiter un ticket ou une nouvelle fonctionnalité :

### Étape A : Créer sa branche
Ne restez jamais sur `main`.
```bash
git checkout -b feat/ajout-login
# ou
git checkout -b fix/bouton-casser
```

### Étape B : Spécifier avec l'IA
Si vous utilisez un agent IA, ne lui dites pas "Code le login". Dites-lui :
> "Lis le ticket #42, rédige les spécifications dans `specs/spec.md` et un plan d'action dans `specs/plan.md`. Arrête-toi ensuite."

Vous lisez le plan généré. S'il est bon, vous l'approuvez. S'il est mauvais, vous corrigez. **C'est vous le pilote.**

### Étape C : Coder et Commiter Fréquemment
Le GEF impose les **Conventional Commits** et exige un **Ticket Kanban** à la fin du message, ainsi qu'une description détaillée.
```bash
git add .
git commit -m "feat: création du composant LoginButton (#42)" -m "Ce composant utilise le provider Auth0 pour gérer l'authentification OAuth. Ajout également de tests unitaires associés."
```
*Note: Le hook `pre-commit` s'exécutera automatiquement pour s'assurer que vous n'avez pas laissé de `debugger;`, de clés secrètes en clair, et que vos fichiers ne sont pas trop gros.*

### Étape D : Gérer la Dette Architecturale (ADR)
Si vous ajoutez une dépendance lourde (ex: `npm install redux`) ou changez la base de données, la CI va vous demander de créer un **ADR (Architecture Decision Record)**.
C'est un simple fichier Markdown dans `docs/explanation/adr/` qui explique le *Pourquoi* de ce choix.

### Étape E : La Pull Request
Une fois fini, poussez votre branche.
```bash
git push origin feat/ajout-login
```
Allez sur GitHub et ouvrez une Pull Request.
**Attention :** Le template de Pull Request contient une section "Intention". Vous DEVEZ la remplir (minimum 30 caractères) pour expliquer la valeur métier de votre code, sinon la CI bloquera le merge !

## 3. En Cas de Problème

- **Le linter hurle ?** Corrigez les erreurs, ne les ignorez pas (le GEF bloque les `eslint-disable`).
- **Un fichier est trop long ?** C'est le moment idéal pour extraire un composant, une fonction utilitaire, ou un Custom Hook.
- **Le commit est bloqué ?** Lisez attentivement le message rouge dans votre console. Le GEF est bavard et vous dira exactement ce qui ne va pas (ex: "Secret détecté", "Message de commit invalide").

Bon code ! Le GEF est votre filet de sécurité, appuyez-vous dessus pour exceller.
