// features/scaffold-git.js — Initialisation Git et installation des hooks dynamiques
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
 */
function generatePrePush(gitWorkflow) {
  const isGitHubFlow = gitWorkflow.includes('GitHub Flow');
  let script = '#!/bin/bash\n# Hook: pre-push\n\nCURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)\n\n';

  if (isGitHubFlow) {
    script += `# Sécurité GitHub Flow : Interdire les pushes directs sur main
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo -e "\\033[31mErreur: Push direct sur '$CURRENT_BRANCH' interdit.\\033[0m"
  echo "Le projet utilise GitHub Flow. Utilisez des branches et des Pull Requests."
  exit 1
fi
\n`;
  } else {
    script += `# Sécurité TBD : Pushes sur main autorisés.
echo -e "\\033[34mInfo: Mode TBD, push sur $CURRENT_BRANCH autorisé.\\033[0m"\n\n`;
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
function generatePreCommit(linter, strictness) {
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

  let linterCmd = '';
  if (linter.includes('ESLint')) linterCmd = 'npm run lint || { echo "Erreur Lint"; exit 1; }';
  else if (linter.includes('Biome')) linterCmd = 'npx biome check . || { echo "Erreur Lint"; exit 1; }';
  else if (linter.includes('Ruff')) linterCmd = 'ruff check . || { echo "Erreur Lint"; exit 1; }';

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

${linterCmd ? `echo "Exécution du linter..."\n${linterCmd}` : ''}

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
function installDynamicHooks(gitWorkflow, linter, strictness) {
  fs.mkdirSync('.git/hooks', { recursive: true });

  const commitMsgScript = `#!/bin/bash
COMMIT_MSG=$(cat $1)
PATTERN="^(feat|fix|docs|chore|refactor|style|perf|test|release)(\\([a-zA-Z0-9_.-]+\\))?: (.*) \\(#[0-9]+\\)$"
if [[ ! $COMMIT_MSG =~ $PATTERN ]]; then
  echo "Erreur: Le message doit suivre Conventional Commits et inclure (#Ticket)."
  exit 1
fi
exit 0
`;

  fs.writeFileSync('.git/hooks/commit-msg', commitMsgScript);
  fs.writeFileSync('.git/hooks/pre-push', generatePrePush(gitWorkflow));
  fs.writeFileSync('.git/hooks/pre-commit', generatePreCommit(linter, strictness));

  try {
    execSync('chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push', { stdio: 'ignore' });
  } catch (_) { /* Ignoré sur Windows */ }
}

/**
 * Orchestre l'initialisation Git et l'installation des hooks.
 */
export function scaffoldGit(gefDir, gitWorkflow, linter, strictness) {
  console.log(chalk.yellow('🔗 Initialisation Git et installation des hooks...'));
  try {
    initGitRepo();
    installDynamicHooks(gitWorkflow, linter, strictness);
    console.log(chalk.green('✅ Git initialisé et Hooks dynamiques générés.'));
  } catch (_) {
    console.log(chalk.red("Erreur lors de l'installation des hooks Git."));
  }
}
