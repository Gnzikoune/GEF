// features/scaffold-ci.js — Pipeline CI/CD complet et progressif selon la sévérité
// Réf. Playbook §1 : SRP. §4 : OWASP. §6 : CI/CD

import fs from 'fs';
import chalk from 'chalk';
import {
  buildTriggers,
  buildServiceBlock,
  buildRuntimeBlock,
  buildLintBlock,
  buildAuditBlock,
  buildTestBlock,
  buildSecurityScanBlock,
  buildDockerImageBlock,
  buildStagingBlock,
  buildDeployBlock
} from './scaffold-ci-blocks.js';

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
