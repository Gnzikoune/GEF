// features/setup-ci.js — Pipeline CI/CD Agentique
// Réf. Playbook §6 : CI/CD

import fs from 'fs';
import chalk from 'chalk';

export function setupCI(projectName, options = {}) {
  console.log(chalk.yellow('🤖 Génération de la CI/CD Agentique...'));
  fs.mkdirSync('.github/workflows', { recursive: true });

  const { gitWorkflow = 'GitHub Flow', linter = '' } = options;

  const branchFilter = gitWorkflow.includes('Trunk')
    ? `    branches:\n      - main`
    : `    branches:\n      - main\n      - 'feat/**'\n      - 'fix/**'`;

  const linterWarning = !linter || linter === 'Aucun'
    ? `      - name: "⚠️ Avertissement — Aucun linter configuré"\n        run: |\n          echo "::warning::Aucun linter n'est configuré dans ce projet. Les Hard Limits du Playbook §2 ne sont pas vérifiées mécaniquement. Configurez ESLint, Biome ou Ruff."`
    : '';

  const ciContent = `name: GEF Validation — \${projectName}

on:
  push:
\${branchFilter}
  pull_request:
    branches:
      - main

jobs:
  gef-compliance:
    name: GEF Compliance Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Vérification des règles GEF (Anti-Contournement)
        run: |
          echo "🔍 Vérification de l'intégrité du Guardian Engineering Framework..."
          # Les hooks Git (pre-commit, commit-msg, pre-push) ont déjà fait le travail en local.
          # Cette étape s'assure qu'aucun push forcé n'a bypassé les règles.
          
          echo "Vérification des limites de taille (Hard Limits)..."
          for file in $(git ls-files); do
            if [[ "$file" =~ (package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml|composer\\.lock|Cargo\\.lock)$ ]]; then
              continue
            fi
            LINES=$(wc -l < "$file")
            if [ "$LINES" -gt 400 ]; then
              echo "::error file=$file::Le fichier $file dépasse 400 lignes. Refactoring nécessaire."
              exit 1
            fi
          done
          
          echo "✅ Code conforme aux Hard Limits GEF."

      - name: SAST — Semgrep OWASP Top 10
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten
        continue-on-error: false

      - name: Vérification synchronisation cursorrules/windsurfrules
        run: |
          if [ -f ".cursorrules" ] && [ -f ".windsurfrules" ]; then
            if ! diff -q .cursorrules .windsurfrules > /dev/null 2>&1; then
              echo "::error::.cursorrules et .windsurfrules sont désynchronisés."
              echo "Correction : cp .cursorrules .windsurfrules"
              exit 1
            fi
            echo "✅ cursorrules et windsurfrules synchronisés."
          fi

\${linterWarning}
`;

  const RELEASE_PLEASE_YML = `on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

name: release-please

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          release-type: node

      - uses: actions/checkout@v4
        if: \$\{{ steps.release.outputs.release_created }}
        
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
        if: \$\{{ steps.release.outputs.release_created }}
        
      - run: npm ci
        if: \$\{{ steps.release.outputs.release_created && hashFiles('package-lock.json') != '' }}
        
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \$\{{ secrets.NPM_TOKEN }}
        if: \$\{{ steps.release.outputs.release_created && hashFiles('package.json') != '' }}
`;

  fs.writeFileSync('.github/workflows/main.yml', ciContent);
  fs.writeFileSync('.github/workflows/release-please.yml', RELEASE_PLEASE_YML);
  console.log(chalk.green('✅ Workflows CI/CD Agentiques générés.'));
}
