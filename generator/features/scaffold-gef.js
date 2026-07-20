// features/scaffold-gef.js — Application de la surcouche GEF au projet
// Réf. Playbook §6 : Documentation Diátaxis. §1 : SRP, une responsabilité par fonction.

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Structure Diátaxis complète — Réf. Playbook §6
const DIATAXIS_DIRS = [
  'docs/tutorials',
  'docs/how-to',
  'docs/reference',
  'docs/explanation/adr',
  'docs/research',
  'src',
  'tests',
  'scripts',
  'assets',
  'infra',
  'database',
];

/**
 * Crée la structure de dossiers du projet (Diátaxis + structure métier).
 * @param {boolean} includeCI
 */
function createDirectories(includeCI) {
  const dirs = includeCI ? [...DIATAXIS_DIRS, '.github/workflows'] : DIATAXIS_DIRS;
  dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));
}

/**
 * Copie le Playbook et les prompts IA dans le dossier .gef/ du projet.
 * @param {string} gefDir
 */
function copyGefAssets(gefDir) {
  console.log(chalk.cyan('📚 Ajout du Playbook et des Prompts IA locaux...'));
  fs.mkdirSync('.gef/prompts', { recursive: true });

  const playbookSrc = path.join(gefDir, 'ENGINEERING_PLAYBOOK.md');
  if (fs.existsSync(playbookSrc)) {
    fs.copyFileSync(playbookSrc, '.gef/ENGINEERING_PLAYBOOK.md');
  }

  const promptsSrc = path.join(gefDir, 'prompts');
  if (!fs.existsSync(promptsSrc)) return;
  fs.readdirSync(promptsSrc).forEach((p) => {
    fs.copyFileSync(path.join(promptsSrc, p), path.join('.gef/prompts', p));
  });
}

/**
 * Génère le template ADR depuis le fichier templates/ du GEF.
 * @param {string} gefDir
 */
function createAdrTemplate(gefDir) {
  const templateSrc = path.join(gefDir, 'generator', 'templates', 'adr-template.md');
  const dest = 'docs/explanation/adr/0000-template.md';
  if (fs.existsSync(templateSrc)) {
    fs.copyFileSync(templateSrc, dest);
  }
}

/**
 * Génère le RESEARCH_LOG.md initial.
 */
function createResearchLog() {
  const dest = 'docs/research/RESEARCH_LOG.md';
  if (fs.existsSync(dest)) return;
  fs.writeFileSync(dest, `# Research Log — Journal de bord scientifique
> Documentez ici la résolution des bugs bloquants (Réf. Playbook §6).

## Template d'entrée
- **Symptôme :** Ce qui était observé.
- **Cause Racine :** L'explication technique précise.
- **Résolution :** Ce qui a été modifié.
- **Leçon apprise :** Ce qui aurait pu prévenir ce bug.
`);
}

/**
 * Génère PROJECT_CONFIG.md depuis le template GEF.
 * @param {object} answers
 * @param {string} gefDir
 */
function createProjectConfig({ projectName, stack, phase, database, cloud }, gefDir) {
  const templatePath = path.join(gefDir, 'PROJECT_CONFIG.template.md');
  if (!fs.existsSync(templatePath)) return;

  const dateStr = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const content = fs.readFileSync(templatePath, 'utf-8')
    .replace(/{{PROJECT_NAME}}/g, projectName)
    .replace(/{{STACK}}/g, stack)
    .replace(/{{PHASE}}/g, phase)
    .replace(/{{DATABASE}}/g, database)
    .replace(/{{CLOUD}}/g, cloud)
    .replace(/{{DATE}}/g, dateStr);

  fs.writeFileSync('PROJECT_CONFIG.md', content);
}

/**
 * Génère ou enrichit le README.md initial.
 * @param {object} answers
 */
function createReadme({ projectName, stack, cloud, database }) {
  const header = `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Installation\n<À COMPLÉTER>\n\n## Architecture\nStack: ${stack}\nCloud: ${cloud}\nDB: ${database}\n`;
  if (fs.existsSync('README.md')) {
    const existing = fs.readFileSync('README.md', 'utf8');
    fs.writeFileSync('README.md', header + '\n---\n*Généré initialement par le framework GEF:*\n' + existing);
  } else {
    fs.writeFileSync('README.md', header);
  }
}

/**
 * Génère le .gitignore adapté à la stack.
 * @param {string} stack
 */
function createGitignore(stack) {
  let content = '\n# GEF Standard\n.env\n.DS_Store\n';
  if (stack.includes('Python')) content += '__pycache__/\nvenv/\n.venv/\n.pytest_cache/\n';

  if (fs.existsSync('.gitignore')) {
    fs.appendFileSync('.gitignore', content);
  } else {
    fs.writeFileSync('.gitignore', content);
  }
}

/**
 * Orchestre toute la surcouche GEF sur le projet généré.
 * @param {object} answers - Réponses de l'utilisateur (inquirer)
 * @param {string} gefDir - Chemin absolu vers la racine du GEF
 */
export function scaffoldGef(answers, gefDir) {
  console.log(chalk.yellow('\n📁 Application de la surcouche GEF...'));
  createDirectories(answers.includeCI);
  copyGefAssets(gefDir);
  createAdrTemplate(gefDir);
  createResearchLog();
  createProjectConfig(answers, gefDir);
  createReadme(answers);
  createGitignore(answers.stack);

  if (!fs.existsSync('CHANGELOG.md')) fs.writeFileSync('CHANGELOG.md', '');
  if (!fs.existsSync('LICENSE')) fs.writeFileSync('LICENSE', '');
}
