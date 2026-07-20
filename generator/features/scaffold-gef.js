// features/scaffold-gef.js — Application de la surcouche GEF au projet (Moteur de Templates)
// Réf. Playbook §6 : Documentation Diátaxis. §1 : SRP

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

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

function createDirectories(includeCI) {
  const dirs = includeCI ? [...DIATAXIS_DIRS, '.github/workflows'] : DIATAXIS_DIRS;
  dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));
}

/**
 * Applique les règles de Hard Limits selon la sévérité choisie.
 */
function applyTemplating(content, strictness, language) {
  let maxLines = '30';
  let maxParams = '3';
  let maxComplexity = '10';
  let maxPayload = '1 Mo';
  let isEnglish = language === 'English';

  if (strictness.includes('Startup')) {
    maxLines = '50';
    maxParams = '4';
    maxComplexity = '15';
    maxPayload = '5 Mo';
  } else if (strictness.includes('Mission Critical')) {
    maxLines = '15';
    maxParams = '2';
    maxComplexity = '5';
    maxPayload = '100 Ko';
  }

  let result = content
    .replace(/{{MAX_LINES}}/g, maxLines)
    .replace(/{{MAX_PARAMS}}/g, maxParams)
    .replace(/{{MAX_COMPLEXITY}}/g, maxComplexity)
    .replace(/{{MAX_PAYLOAD}}/g, maxPayload);

  if (isEnglish) {
    result = result.replace(/Ce prompt est à fournir/g, 'This prompt is to be provided');
    result = result.replace(/Tu es une IA d'assistance/g, 'You are an AI coding assistant');
    // Simple traduction rudimentaire pour les instructions racines
    result = `[ENGLISH MODE ACTIVATED - ALL RESPONSES MUST BE IN ENGLISH]\n\n${result}`;
  }

  return result;
}

/**
 * Copie le Playbook et les prompts IA avec le templating dynamique.
 */
export function copyAndTemplateGefAssets(gefDir, strictness, language) {
  console.log(chalk.cyan('📚 Ajout du Playbook et des Prompts IA dynamiques...'));
  fs.mkdirSync('.gef/prompts', { recursive: true });

  const playbookSrc = path.join(gefDir, 'ENGINEERING_PLAYBOOK.md');
  if (fs.existsSync(playbookSrc)) {
    const raw = fs.readFileSync(playbookSrc, 'utf8');
    fs.writeFileSync('.gef/ENGINEERING_PLAYBOOK.md', applyTemplating(raw, strictness, language));
  }

  const promptsSrc = path.join(gefDir, 'prompts');
  if (fs.existsSync(promptsSrc)) {
    fs.readdirSync(promptsSrc).forEach((p) => {
      const raw = fs.readFileSync(path.join(promptsSrc, p), 'utf8');
      fs.writeFileSync(path.join('.gef/prompts', p), applyTemplating(raw, strictness, language));
    });
  }
}

function createAdrTemplate(gefDir) {
  const templateSrc = path.join(gefDir, 'generator', 'templates', 'adr-template.md');
  const dest = 'docs/explanation/adr/0000-template.md';
  if (fs.existsSync(templateSrc)) fs.copyFileSync(templateSrc, dest);
}

function createResearchLog(language) {
  const isEn = language === 'English';
  const dest = 'docs/research/RESEARCH_LOG.md';
  if (fs.existsSync(dest)) return;
  fs.writeFileSync(
    dest,
    isEn
      ? `# Research Log\n> Document bug fixes here.\n\n## 1. <Title>\n- **Context:** \n- **Root Cause:** \n- **Resolution:** \n- **Lesson Learned:** \n`
      : `# Research Log — Journal de bord scientifique\n> Documentez ici la résolution des bugs bloquants.\n\n## 1. <Titre>\n- **Contexte :** \n- **Cause Racine :** \n- **Résolution :** \n- **Leçon apprise :** \n`
  );
}

function createProjectConfig(answers, gefDir) {
  const templatePath = path.join(gefDir, 'PROJECT_CONFIG.template.md');
  if (!fs.existsSync(templatePath)) return;

  const dateStr = new Date().toLocaleString(answers.language === 'English' ? 'en-US' : 'fr-FR', { month: 'long', year: 'numeric' });
  const content = fs.readFileSync(templatePath, 'utf-8')
    .replace(/{{PROJECT_NAME}}/g, answers.projectName)
    .replace(/{{STACK}}/g, answers.stack)
    .replace(/{{PHASE}}/g, answers.phase)
    .replace(/{{DATABASE}}/g, answers.database)
    .replace(/{{CLOUD}}/g, answers.cloud)
    .replace(/{{GIT_WORKFLOW}}/g, answers.gitWorkflow)
    .replace(/{{LINTER}}/g, answers.linter)
    .replace(/{{STRICTNESS}}/g, answers.strictness)
    .replace(/{{LANGUAGE}}/g, answers.language)
    .replace(/{{DATE}}/g, dateStr);

  fs.writeFileSync('PROJECT_CONFIG.md', content);
}

function createReadme({ projectName, stack, cloud, database, gitWorkflow, strictness }) {
  const header = `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Architecture\n- Stack: ${stack}\n- Cloud: ${cloud}\n- DB: ${database}\n- Git: ${gitWorkflow}\n- Sévérité: ${strictness}\n`;
  if (fs.existsSync('README.md')) {
    const existing = fs.readFileSync('README.md', 'utf8');
    fs.writeFileSync('README.md', header + '\n---\n*Généré initialement par le framework GEF:*\n' + existing);
  } else {
    fs.writeFileSync('README.md', header);
  }
}

function createGitignore(stack) {
  let content = '\n# GEF Standard\n.env\n.DS_Store\n';
  if (stack.includes('Python')) content += '__pycache__/\nvenv/\n.venv/\n.pytest_cache/\n';

  if (fs.existsSync('.gitignore')) {
    fs.appendFileSync('.gitignore', content);
  } else {
    fs.writeFileSync('.gitignore', content);
  }
}

export function scaffoldGef(answers, gefDir) {
  console.log(chalk.yellow('\n📁 Application de la surcouche GEF...'));
  createDirectories(answers.includeCI);
  copyAndTemplateGefAssets(gefDir, answers.strictness, answers.language);
  createAdrTemplate(gefDir);
  createResearchLog(answers.language);
  createProjectConfig(answers, gefDir);
  createReadme(answers);
  createGitignore(answers.stack);

  if (!fs.existsSync('CHANGELOG.md')) fs.writeFileSync('CHANGELOG.md', '');
  if (!fs.existsSync('LICENSE')) fs.writeFileSync('LICENSE', '');
}
