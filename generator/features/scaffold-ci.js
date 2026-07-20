// features/scaffold-ci.js — Pipeline CI/CD complet et progressif selon la sévérité
// Réf. Playbook §1 : SRP. §4 : OWASP. §6 : CI/CD

import fs from 'fs';
import chalk from 'chalk';

// ─────────────────────────────────────────────
// BLOC : Trigger / On
// ─────────────────────────────────────────────
function buildTriggers(gitWorkflow) {
  const branchFilter = gitWorkflow?.includes('Trunk')
    ? `    branches:\n      - main`
    : `    branches:\n      - main\n      - 'feat/**'\n      - 'fix/**'`;

  return `on:
  push:
${branchFilter}
    tags:
      - 'v*.*.*'
  pull_request:
    branches:
      - main`;
}

// ─────────────────────────────────────────────
// BLOC : Services DB éphémères pour les tests
// ─────────────────────────────────────────────
function buildServiceBlock(database) {
  if (database === 'PostgreSQL') {
    return `    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5`;
  }
  if (database === 'MongoDB') {
    return `    services:
      mongo:
        image: mongo:7
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5`;
  }
  return '';
}

// ─────────────────────────────────────────────
// BLOC : Setup runtime
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// BLOC : Lint
// ─────────────────────────────────────────────
function buildLintBlock(isNode, isPython, linter) {
  if (isNode) {
    const cmd = linter?.includes('Biome') ? 'npx biome check .' : 'npm run lint --if-present';
    return `      - name: Lint\n        run: ${cmd}`;
  }
  if (isPython) {
    const cmd = linter?.includes('Ruff') ? 'ruff check .' : 'flake8 src/ --max-line-length=120 || true';
    return `      - name: Lint\n        run: |\n          pip install ${linter?.includes('Ruff') ? 'ruff' : 'flake8'}\n          ${cmd}`;
  }
  return '';
}

// ─────────────────────────────────────────────
// BLOC : Audit de dépendances
// ─────────────────────────────────────────────
function buildAuditBlock(isNode, isPython) {
  if (isNode) {
    return `      - name: Audit des dépendances
        run: npm audit --audit-level=high`;
  }
  if (isPython) {
    return `      - name: Audit des dépendances
        run: |
          pip install pip-audit
          pip-audit`;
  }
  return '';
}

// ─────────────────────────────────────────────
// BLOC : Tests + coverage
// ─────────────────────────────────────────────
function buildTestBlock(isNode, isPython, database) {
  const dbEnv = database === 'PostgreSQL'
    ? `\n        env:\n          DATABASE_URL: postgresql://test:test@localhost:5432/test_db`
    : database === 'MongoDB'
    ? `\n        env:\n          MONGODB_URI: mongodb://localhost:27017/test_db`
    : '';

  if (isNode) {
    return `      - name: Tests (avec couverture)
        run: npm test -- --coverage --if-present${dbEnv}

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          fail_ci_if_error: false`;
  }
  if (isPython) {
    return `      - name: Tests (pytest + coverage)
        run: |
          pip install pytest pytest-cov
          pytest tests/ -v --cov=src --cov-report=xml${dbEnv}

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          fail_ci_if_error: false`;
  }
  return `      - name: Tests\n        run: echo "Ajoutez vos commandes de tests ici"`;
}

// ─────────────────────────────────────────────
// BLOC : Scan de sécurité (Gitleaks + Trivy FS)
// ─────────────────────────────────────────────
function buildSecurityScanBlock() {
  return `      - name: Scan secrets (Gitleaks)
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Scan filesystem (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'`;
}

// ─────────────────────────────────────────────
// BLOC : Build & Push image Docker
// ─────────────────────────────────────────────
function buildDockerImageBlock(projectName, containerRegistry, cloud) {
  if (!containerRegistry || containerRegistry.includes('Aucun')) return '';

  let loginStep = '';
  let imageTag = '';

  if (containerRegistry.includes('Docker Hub')) {
    loginStep = `      - name: Login Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}`;
    imageTag = `\${{ secrets.DOCKERHUB_USERNAME }}/${projectName}:\${{ github.sha }}`;
  } else if (containerRegistry.includes('GHCR')) {
    loginStep = `      - name: Login GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}`;
    imageTag = `ghcr.io/\${{ github.repository_owner }}/${projectName}:\${{ github.sha }}`;
  } else if (containerRegistry.includes('ECR')) {
    loginStep = `      - name: Login AWS ECR
        uses: aws-actions/amazon-ecr-login@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3`;
    imageTag = `\${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.eu-west-3.amazonaws.com/${projectName}:\${{ github.sha }}`;
  }

  return `
  build-image:
    name: Build & Push Image Docker
    needs: quality-gate
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

${loginStep}

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build et Push l'image
        id: meta
        uses: docker/build-push-action@v5
        with:
          context: ./docker
          push: \${{ github.event_name != 'pull_request' }}
          tags: ${imageTag}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Scan image Docker (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${imageTag}
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL'`;
}

// ─────────────────────────────────────────────
// BLOC : Deploy Staging + Health Check (Mission Critical)
// ─────────────────────────────────────────────
function buildStagingBlock(isMissionCritical, hasDockerImage) {
  if (!isMissionCritical) return '';
  const needs = hasDockerImage ? 'build-image' : 'quality-gate';

  return `
  deploy-staging:
    name: Déploiement Staging
    needs: ${needs}
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          echo "Ajoutez ici votre commande de déploiement vers l'environnement staging"
          # Exemple : kubectl set image deployment/app app=IMAGE_TAG

      - name: Health Check Staging
        run: |
          echo "Attente du démarrage de l'application..."
          sleep 15
          for i in {1..5}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://staging.votre-domaine.com/health || true)
            if [ "$STATUS" = "200" ]; then
              echo "✅ Health check OK (tentative $i)"
              exit 0
            fi
            echo "⏳ Tentative $i/5 échouée (status: $STATUS), nouvel essai dans 10s..."
            sleep 10
          done
          echo "❌ Health check staging échoué après 5 tentatives"
          exit 1

  rollback-staging:
    name: Rollback si Staging échoue
    needs: deploy-staging
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - name: Rollback
        run: |
          echo "⚠️  Déploiement staging en échec. Rollback vers la version précédente."
          echo "Ajoutez ici votre commande de rollback (ex: kubectl rollout undo deployment/app)"`;
}

// ─────────────────────────────────────────────
// BLOC : Deploy Production
// ─────────────────────────────────────────────
function buildDeployBlock(cloud, isMissionCritical, hasDockerImage) {
  const needs = isMissionCritical ? 'deploy-staging' : (hasDockerImage ? 'build-image' : 'quality-gate');
  const condition = isMissionCritical
    ? `github.ref == 'refs/heads/main' && needs.deploy-staging.result == 'success'`
    : `github.ref == 'refs/heads/main'`;

  if (cloud === 'Vercel') {
    return `
  deploy-production:
    name: Déploiement Production (Vercel)
    needs: ${needs}
    if: ${condition}
    runs-on: ubuntu-latest
    environment: production
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
  deploy-production:
    name: Déploiement Production (AWS)
    needs: ${needs}
    if: ${condition}
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3
      - name: Deploy to AWS
        run: echo "Ajoutez ici votre commande de déploiement AWS (ECS, EKS, Elastic Beanstalk...)"`;
  }

  return `
  release:
    name: Release Automatique
    needs: ${needs}
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true`;
}

// ─────────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────────
export function scaffoldCI(stack, cloud, projectName, options = {}) {
  console.log(chalk.yellow('🤖 Génération du pipeline CI/CD complet...'));
  fs.mkdirSync('.github/workflows', { recursive: true });

  const { database = 'Aucune', strictness = 'Standard', linter = 'Aucun',
    gitWorkflow = 'GitHub Flow', containerRegistry = 'Aucun', includeDocker = false } = options;

  const isNode = stack.includes('Node') || stack.includes('React') || stack.includes('Next');
  const isPython = stack.includes('Python');
  const isMissionCritical = strictness.includes('Mission Critical');
  const isStandard = strictness.includes('Standard') || isMissionCritical;
  const hasDockerImage = includeDocker && !containerRegistry?.includes('Aucun') && cloud !== 'Vercel';

  const serviceBlock = buildServiceBlock(database);
  const serviceSection = serviceBlock ? `\n${serviceBlock}\n` : '';

  const securityBlock = isStandard ? `\n${buildSecurityScanBlock()}` : '';
  const auditBlock = isStandard ? `\n${buildAuditBlock(isNode, isPython)}` : '';

  const ciContent = `name: GEF CI/CD — ${projectName}

${buildTriggers(gitWorkflow)}

jobs:
  quality-gate:
    name: Contrôle Qualité
    runs-on: ubuntu-latest
${serviceSection}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

${buildRuntimeBlock(isNode, isPython)}

${buildLintBlock(isNode, isPython, linter)}
${auditBlock}

${buildTestBlock(isNode, isPython, database)}
${securityBlock}
${hasDockerImage ? buildDockerImageBlock(projectName, containerRegistry, cloud) : ''}
${isMissionCritical ? buildStagingBlock(true, hasDockerImage) : ''}
${buildDeployBlock(cloud, isMissionCritical, hasDockerImage)}
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
        if: \${{ steps.release.outputs.release_created }}
        
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
        if: \${{ steps.release.outputs.release_created }}
        
      - run: npm ci
        if: \${{ steps.release.outputs.release_created }}
        
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
        if: \${{ steps.release.outputs.release_created }}
`;

  fs.writeFileSync('.github/workflows/main.yml', ciContent);
  fs.writeFileSync('.github/workflows/release-please.yml', RELEASE_PLEASE_YML);
  console.log(chalk.green('✅ Pipeline CI/CD complet généré.'));
}
