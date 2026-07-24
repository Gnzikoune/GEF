# Chapitre 1 : Pourquoi les règles textuelles échouent

## 1.1. Le paradoxe de la documentation technique

Chaque équipe de développement sérieuse dispose d'une documentation technique. README, guides de style, conventions de code, playbooks d'ingénierie — ces documents existent, sont souvent bien écrits, et... largement ignorés.

C'est le paradoxe fondamental de l'ingénierie logicielle : nous investissons du temps pour documenter des règles que nous n'appliquons pas ensuite.

Pourquoi ?

Parce que la documentation technique souffre d'un problème de conception structurelle. Elle est **déclarative**, pas **impérative**. Elle décrit ce qu'il *faudrait* faire, mais ne force pas à le faire.

Un README qui dit "Les fonctions ne doivent pas dépasser 30 lignes" est une recommandation. Un linter qui refuse de compiler une fonction de 31 lignes est une contrainte. La première est lue une fois, puis oubliée. La seconde est respectée à chaque commit.

## 1.2. L'échec des "best practices" non appliquées

L'industrie du logiciel regorge de "best practices" :

- Clean Code de Robert C. Martin
- The Pragmatic Programmer de Andy Hunt et Dave Thomas
- Software Engineering at Google de Titus Winters et al.
- Les 12-Factor App
- Les principes SOLID
- Les patterns de conception

Ces ouvrages sont excellents. Ils sont lus par des millions de développeurs. Pourtant, la dette technique continue d'accumuler. Les violations de sécurité persistent. Les architectures dérivent.

Le problème n'est pas le manque de connaissance. Le problème est le manque d'**application mécanique**.

Une "best practice" qui n'est pas automatisée est une opinion, pas une règle. Une opinion peut être débattue, contournée, ignorée. Une règle mécanique ne peut pas l'être.

## 1.3. Le problème amplifié par les assistants IA

L'arrivée des assistants IA (GitHub Copilot, Cursor, Claude Code, Windsurf) a amplifié ce problème de manière exponentielle.

Pourquoi ?

Parce que les assistants IA ne lisent pas votre README. Ils ne connaissent pas vos conventions internes. Ils ne savent pas que votre équipe a décidé d'utiliser des fonctions de 20 lignes maximum. Ils ne savent pas que vous avez interdit l'utilisation de telle bibliothèque.

Ils génèrent du code basé sur leurs propres modèles d'apprentissage, qui ont été entraînés sur des millions de dépôts publics avec des conventions contradictoires.

Le résultat ?

- Un développeur qui utilise Copilot peut produire du code qui viole toutes vos conventions en quelques minutes
- Une équipe qui adopte Cursor peut voir son architecture se fragmenter rapidement
- Un projet qui utilise Claude Code peut accumuler des violations de sécurité sans s'en rendre compte

Les assistants IA sont des moteurs d'improvisation. Ils sont excellents pour générer du code rapidement. Mais ils sont terribles pour respecter des règles spécifiques à un projet.

## 1.4. L'improvisation comme ennemie de la qualité

L'improvisation est l'ennemie de la qualité en ingénierie logicielle.

Quand un développeur improvise :
- Il choisit la première solution qui vient à l'esprit
- Il ne considère pas les alternatives
- Il ne documente sa décision
- Il ne teste les cas limites
- Il ne pense à la maintenabilité

Quand une IA improvise :
- Elle fait la même chose, mais à une vitesse 100x supérieure
- Elle peut générer des milliers de lignes de code en quelques minutes
- Elle peut créer des dépendances implicites
- Elle peut introduire des vulnérabilités de sécurité

L'improvisation n'est pas un problème quand elle est isolée. Mais quand elle devient la norme — quand chaque développeur, chaque assistant IA, chaque commit improvise — le projet devient ingérable.

La qualité en ingénierie logicielle ne vient pas de l'inspiration individuelle. Elle vient de la cohérence collective. Et la cohérence collective ne peut pas être improvisée.

## 1.5. La nécessité des verrous mécaniques

La solution est simple : les règles d'ingénierie ne doivent pas être relues — elles doivent être imposées mécaniquement.

Qu'est-ce qu'un verrou mécanique ?

C'est un système qui **empêche physiquement** une action indésirable. Pas qui la décourage. Pas qui la signale. Qui l'empêche.

Exemples de verrous mécaniques :

- Un hook Git qui refuse un commit dont le message ne respecte pas le format Conventional Commits
- Un linter qui refuse de compiler une fonction qui dépasse 30 lignes
- Un workflow CI qui bloque une Pull Request qui n'a pas d'intention métier déclarée
- Un template de PR qui exige de cocher physiquement des cases avant de pouvoir merger

Ces verrous mécaniques ont une propriété fondamentale : ils ne peuvent pas être contournés sans effort conscient.

Un développeur peut ignorer un README. Il ne peut pas ignorer un hook Git qui bloque son commit.

Une IA peut générer du code qui viole vos conventions. Elle ne peut pas générer du code qui passe pas votre linter configuré.

C'est la thèse centrale de ce livre : **l'ingénierie assistée par IA nécessite des verrous mécaniques pour garantir la qualité**.

## Résumé du chapitre

Les règles textuelles échouent parce qu'elles sont déclaratives, pas impératives. Les "best practices" non appliquées sont des opinions, pas des règles. Les assistants IA amplifient ce problème en générant du code à grande vitesse sans connaître vos conventions. L'improvisation devient l'ennemie de la qualité.

La solution est d'imposer mécaniquement les règles d'ingénierie via des verrous physiques qui ne peuvent pas être contournés sans effort conscient. C'est ce que fait le Guardian Engineering Framework.

Dans le chapitre suivant, nous explorerons l'architecture de GEF et comment il implémente ces verrous mécaniques.
