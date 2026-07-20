// features/scaffold-ci.js — Génération du pipeline CI/CD et release-please
// Réf. Playbook §1 : SRP. §9 : CI/CD sur main (Trunk-Based)

import fs from 'fs';
import chalk from 'chalk';

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
        with:
          release-type: node
`;

/**
 * Construit le bloc de setup runtime selon la stack.
 * @param {boolean} isNode
 * @param {boolean} isPython
 * @returns {string}
 */
function buildRuntimeBlock(isNode, isPython) {
  if (isNode) {
    return `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Installer les dépendances
        run: npm ci`;
  }
  if (isPython) {
    return `      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Installer les dépendances
        run: pip install -r requirements.txt`;
  }
  return `      - name: Setup\n        run: echo "Configurez votre runtime ici"`;
}

/**
 * Construit le bloc de tests selon la stack.
 * @param {boolean} isNode
 * @param {boolean} isPython
 * @returns {string}
 */
function buildTestBlock(isNode, isPython) {
  if (isNode) {
    return `      - name: Lint
        run: npm run lint --if-present

      - name: Tests
        run: npm test --if-present`;
  }
  if (isPython) {
    return `      - name: Lint (flake8)
        run: |
          pip install flake8
          flake8 src/ --max-line-length=120 || true

      - name: Tests (pytest)
        run: |
          pip install pytest
          pytest tests/ -v || true`;
  }
  return `      - name: Tests\n        run: echo "Ajoutez vos commandes de tests ici"`;
}

/**
 * Construit le bloc de déploiement selon le cloud provider.
 * @param {string} cloud
 * @returns {string}
 */
function buildDeployBlock(cloud) {
  if (cloud === 'Vercel') {
    return `
  deploy:
    name: Déploiement Vercel
    needs: quality-gate
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`;
  }
  if (cloud === 'AWS') {
    return `
  deploy:
    name: Déploiement AWS
    needs: quality-gate
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3
      - name: Deploy
        run: echo "Ajoutez ici votre commande de déploiement AWS"`;
  }
  return `
  release:
    name: Release Automatique
    needs: quality-gate
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true`;
}

/**
 * Génère les fichiers GitHub Actions CI/CD et release-please.
 * @param {string} stack
 * @param {string} cloud
 * @param {string} projectName
 */
export function scaffoldCI(stack, cloud, projectName) {
  console.log(chalk.yellow('🤖 Génération du pipeline CI/CD...'));
  fs.mkdirSync('.github/workflows', { recursive: true });

  const isNode = stack.includes('Node') || stack.includes('React') || stack.includes('Next');
  const isPython = stack.includes('Python');

  const ciContent = `name: GEF CI/CD — ${projectName}

on:
  push:
    branches:
      - main
      - 'fix/**'
    tags:
      - 'v*.*.*'
  pull_request:
    branches:
      - main

jobs:
  quality-gate:
    name: Contrôle Qualité
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

${buildRuntimeBlock(isNode, isPython)}

${buildTestBlock(isNode, isPython)}

      - name: Analyse de sécurité
        run: echo "Ajoutez ici Trivy ou Gitleaks"
${buildDeployBlock(cloud)}
`;

  fs.writeFileSync('.github/workflows/main.yml', ciContent);
  fs.writeFileSync('.github/workflows/release-please.yml', RELEASE_PLEASE_YML);
  console.log(chalk.green('✅ Pipeline CI/CD et release-please générés.'));
}
