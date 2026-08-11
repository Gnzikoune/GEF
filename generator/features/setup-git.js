// features/setup-git.js — Initialisation Git et installation des hooks dynamiques
// Réf. Playbook : TBD ou GitHub Flow

import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Initialise le dépôt Git.
 */
function initGitRepo() {
  if (fs.existsSync('.git')) return;
  execSync('git init && git branch -M main', { stdio: 'ignore' });
}

/**
 * Génère le script pre-push de manière dynamique selon le choix du workflow Git.
 * Version améliorée avec vérification de la branche de destination.
 */
function generatePrePush(gitWorkflow) {
  const isGitHubFlow = gitWorkflow.includes('GitHub Flow');
  let script = '#!/bin/bash\n# Hook: pre-push\n# Réf: ENGINEERING_PLAYBOOK.md §5 - Protection stricte de la branche principale\n\n';

  script += `# Vérification de la branche de destination
while read local_ref local_sha remote_ref remote_sha
do
  # Extraire le nom de la branche distante (ex: refs/heads/main -> main)
  remote_branch=$(echo "$remote_ref" | sed 's|refs/heads/||')
  
  if [ "$remote_branch" = "main" ] || [ "$remote_branch" = "master" ]; then
    echo -e "\\033[31mErreur: Push direct sur '$remote_branch' strictement interdit (Playbook §5).\\033[0m"
    echo "L'IA ou le développeur humain doit créer une branche et passer par une Pull Request."
    echo "Commande suggérée : git checkout -b feat/nom-feature ou fix/nom-fix"
    exit 1
  fi
done

`;

  if (!isGitHubFlow) {
    script += `# Sécurité TBD : Pushes sur main autorisés.
echo -e "\\033[34mInfo: Mode TBD, push sur main autorisé.\\033[0m"\n\n`;
  }

  script += `if [ -f "package.json" ] && grep -q '"test"' package.json; then
  npm test || { echo -e "\\033[31mErreur: Tests en échec. Push annulé.\\033[0m"; exit 1; }
elif [ -f "Makefile" ] && grep -q "^test:" Makefile; then
  make test || { echo -e "\\033[31mErreur: Tests en échec. Push annulé.\\033[0m"; exit 1; }
fi\n\nexit 0\n`;
  return script;
}

/**
 * Génère le script pre-commit de manière dynamique.
 */
function generatePreCommit(strictness) {
  let fileLimit = 400;
  let payloadLimitKb = 1000; // 1 Mo par défaut
  if (strictness.includes('Startup')) {
    fileLimit = 500;
    payloadLimitKb = 5000; // 5 Mo
  }
  if (strictness.includes('Mission Critical')) {
    fileLimit = 200;
    payloadLimitKb = 100; // 100 Ko
  }

  return `#!/bin/bash
# Hook: pre-commit

SECRETS=$(git diff --cached -G"(api_key|secret|token|password)[ ]*=[ ]*['\\\"][a-zA-Z0-9_\\\\-]+['\\\"]" --name-only)
if [ -n "$SECRETS" ]; then
  echo "Erreur: Potentiel secret en clair."
  exit 1
fi

DEBUG_FILES=$(git diff --cached --name-only | grep -E "(^|/)(debug_|test_)" | grep -v "^tests/")
if [ -n "$DEBUG_FILES" ]; then
  echo "Erreur: Fichier de debug détecté hors de tests/."
  exit 1
fi

for file in $(git diff --cached --name-only); do
  if [ -f "$file" ]; then
    LINES=$(wc -l < "$file")
    if [ "$LINES" -gt ${fileLimit} ]; then
      echo "Avertissement: $file dépasse ${fileLimit} lignes."
    fi

    # Vérification du Payload (Taille Max)
    SIZE_KB=$(du -k "$file" | cut -f1)
    if [ "$SIZE_KB" -gt ${payloadLimitKb} ]; then
      echo "Erreur: $file ($SIZE_KB Ko) dépasse la limite de taille autorisée (${payloadLimitKb} Ko) pour ce niveau de sévérité."
      exit 1
    fi
  fi
done

exit 0
`;
}

/**
 * Génère et installe les hooks dynamiques dans le projet.
 */
function installDynamicHooks(gitWorkflow, strictness) {
  fs.mkdirSync('.git/hooks', { recursive: true });

  const commitMsgScript = `#!/bin/bash
# Hook: commit-msg (généré par create-gef)
# Réf: ENGINEERING_PLAYBOOK.md §5 — Conventional Commits + Body obligatoire
COMMIT_MSG=$(head -n 1 "$1")
PATTERN="^(feat|fix|docs|chore|refactor|style|perf|test|release)(\\([a-zA-Z0-9_.-]+\\))?: (.*) \\(#[0-9]+\\)$"
if [[ ! $COMMIT_MSG =~ $PATTERN ]]; then
  echo "Erreur: Le message doit suivre Conventional Commits et inclure (#Ticket)."
  echo "Exemple: feat: ajout du bouton login (#42)"
  exit 1
fi

# Body obligatoire — le Squash and Merge GitHub utilise le body comme description de PR
BODY=$(tail -n +3 "$1" | grep -v '^#' | sed '/^[[:space:]]*$/d')
if [ -z "$BODY" ]; then
  echo "Erreur: Le body du commit est vide (Playbook §5)."
  echo "Ajoutez une explication après la ligne de titre (une ligne vide, puis le contexte)."
  exit 1
fi
exit 0
`;

  fs.writeFileSync('.git/hooks/commit-msg', commitMsgScript);
  fs.writeFileSync('.git/hooks/pre-push', generatePrePush(gitWorkflow));
  fs.writeFileSync('.git/hooks/pre-commit', generatePreCommit(strictness));

  try {
    execSync('chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push', { stdio: 'ignore' });
  } catch (_) { /* Ignoré sur Windows */ }
}

/**
 * Orchestre l'initialisation Git et l'installation des hooks.
 */
export function setupGit(gefDir, gitWorkflow, strictness) {
  console.log(chalk.yellow('🔗 Initialisation Git et installation des hooks...'));
  try {
    initGitRepo();
    installDynamicHooks(gitWorkflow, strictness);
    console.log(chalk.green('✅ Git initialisé et Hooks dynamiques générés.'));
  } catch (_) {
    console.log(chalk.red("Erreur lors de l'installation des hooks Git."));
  }
}
