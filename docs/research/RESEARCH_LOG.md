# Research Log & Debug History (GEF)

Ce document consigne tous les problèmes critiques rencontrés, leurs causes profondes et la manière dont ils ont été résolus. 
*Note : Conformément au Playbook, ce fichier est obligatoire pour chaque PR de type `fix/*`.*

---

## [Bug] Omission Systématique du RESEARCH_LOG par l'IA
**Date:** 2026-07-24
**Symptôme:** 
Le fichier `RESEARCH_LOG.md` n'a pas été créé ni mis à jour par l'agent IA, malgré la résolution de divers problèmes. L'utilisateur s'est aperçu que le fichier n'existait même pas dans le dépôt, ce qui constitue une violation grave du Framework Guardian (Amnésie de l'IA).

**Cause Racine:** 
Bien que mentionné dans le `ENGINEERING_PLAYBOOK.md` et les prompts, l'agent IA a priorisé la création de code (les verrous mécaniques et le Juge Sémantique) sans exécuter correctement la directive de tenue de log (qui requiert une action d'écriture explicite après chaque problème).

**Résolution:** 
- Création du dossier `docs/research/` et du fichier `RESEARCH_LOG.md`.
- Rétro-documentation immédiate des problèmes rencontrés.
- Renforcement du processus d'auto-vérification (`<gef_compliance_check>`) pour que l'agent audite explicitement la nécessité de mettre à jour ce fichier avant de clôturer une tâche.

**Leçon:** 
Les instructions passives dans un Playbook ne suffisent pas toujours face au biais de l'IA orienté "code first". Il faut que l'audit du RESEARCH_LOG soit un point de blocage mécanique (Git Hook) et mental (Chain of Thought).

---

## [Bug] Échec des commandes CLI liées à l'opérateur "&&"
**Date:** 2026-07-24
**Symptôme:** 
Les commandes comme `git commit -m "..." && git push` échouaient avec l'erreur `Le jeton « && » n'est pas un séparateur d'instruction valide`.

**Cause Racine:** 
L'environnement d'exécution par défaut de l'utilisateur est PowerShell sous Windows, qui n'accepte pas nativement l'opérateur bash `&&` pour chaîner des commandes (il faut utiliser `;`).

**Résolution:** 
Remplacement de l'utilisation de `&&` par des appels séquentiels, ou par le point-virgule `;` dans les scripts exécutés en ligne de commande PowerShell.

**Leçon:** 
L'agent doit toujours vérifier l'environnement (OS = Windows, Shell = PS) avant de proposer ou d'exécuter des commandes chaînées.

---

## [Bug] Fermeture d'Issue via PR "Déjà Mergée" impossible
**Date:** 2026-07-24
**Symptôme:** 
La commande `gh pr edit 30 --body "Closes #19"` n'a pas fermé l'Issue #19.

**Cause Racine:** 
La PR #30 avait déjà été fusionnée (`merged`) dans `main` par l'utilisateur. Éditer le corps d'une Pull Request post-merge ne déclenche plus l'automatisation GitHub de fermeture des Issues associées.

**Résolution:** 
Fermeture manuelle de l'issue via `gh issue close 19 -r completed`.

**Leçon:** 
Vérifier le statut d'une PR (Open/Merged/Closed) avant de tenter de lier des issues a posteriori. Si la PR est mergée, fermer manuellement l'issue.

---

## [Bug] Installation des Stacks React/Next bloquante (Scaffold AI)
**Date:** 2026-07-20
**Symptôme:** 
La commande CLI pour générer l'architecture d'un projet bloquait indéfiniment lors de l'installation de Next.js ou Vite.

**Cause Racine:** 
Les commandes d'initialisation de projets interactifs (`create-next-app`, `create-vite`) attendaient une entrée utilisateur (comme le nom du projet ou la confirmation d'installation) qui ne pouvait pas être fournie via le contexte CLI non interactif de GEF.

**Résolution:** 
Ajout du drapeau `--yes` (`-y`) et exécution en mode non-interactif forcé pour toutes les commandes de scaffolding dans les générateurs.

**Leçon:** 
Toute commande exécutée par le générateur d'un CLI automatisé DOIT être strictement non-interactive (utilisation des flags par défaut).

---

## [Bug] Faux Positifs et Contournements dans les Hooks GEF
**Date:** 2026-07-24
**Symptôme:** 
Le hook de `pr-intention-check` et les hooks de validation laissaient passer des intentions vides (`Intention: n/a`).

**Cause Racine:** 
Loi de Goodhart (si une mesure devient un objectif, elle cesse d'être une bonne mesure) : une vérification naïve via un simple Regex `grep` a permis de valider une intention factice sans en vérifier la sémantique.

**Résolution:** 
Mise en place d'un Juge Sémantique Hybride pour la CI qui vérifie le contenu de la PR via LLM (ou heuristique avancée en l'absence de clé API).

**Leçon:** 
Un contrôle basé sur un regex est vulnérable à des comportements de type "bypass paresseux". Il faut augmenter la rigueur du contrôle en remplaçant la validation syntaxique par une validation sémantique ou structurelle dure (Issue Forms yaml).
