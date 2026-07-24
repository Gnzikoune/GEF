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
 * La substitution opère sur le fichier source de la bonne locale — pas de traduction à la volée.
 */
function applyTemplating(content, strictness) {
  let maxLines = '30';
  let maxParams = '3';
  let maxComplexity = '10';
  let maxPayload = '1 Mo';

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

  return content
    .replace(/{{MAX_LINES}}/g, maxLines)
    .replace(/{{MAX_PARAMS}}/g, maxParams)
    .replace(/{{MAX_COMPLEXITY}}/g, maxComplexity)
    .replace(/{{MAX_PAYLOAD}}/g, maxPayload);
}

/**
 * Résout le dossier source des assets GEF selon la langue choisie.
 * Priorité : locales/<lang>/ → fallback sur locales/fr/ → fallback racine.
 */
function resolveLocaleDir(gefDir, language) {
  const lang = language === 'English' ? 'en' : 'fr';
  const localeDir = path.join(gefDir, 'locales', lang);
  if (fs.existsSync(localeDir)) return localeDir;
  const frFallback = path.join(gefDir, 'locales', 'fr');
  if (fs.existsSync(frFallback)) return frFallback;
  return gefDir; // fallback legacy
}

/**
 * Copie le Playbook et les prompts IA avec le templating dynamique.
 * Lit les fichiers depuis locales/<fr|en>/ pour un support bilingue propre.
 */
export function copyAndTemplateGefAssets(gefDir, strictness, language) {
  console.log(chalk.cyan('📚 Ajout du Playbook et des Prompts IA dynamiques...'));
  fs.mkdirSync('.gef/prompts', { recursive: true });

  const localeDir = resolveLocaleDir(gefDir, language);

  const playbookSrc = path.join(localeDir, 'ENGINEERING_PLAYBOOK.md');
  if (fs.existsSync(playbookSrc)) {
    const raw = fs.readFileSync(playbookSrc, 'utf8');
    fs.writeFileSync('.gef/ENGINEERING_PLAYBOOK.md', applyTemplating(raw, strictness));
  }

  const promptsSrc = path.join(localeDir, 'prompts');
  if (fs.existsSync(promptsSrc)) {
    fs.readdirSync(promptsSrc).forEach((p) => {
      const raw = fs.readFileSync(path.join(promptsSrc, p), 'utf8');
      fs.writeFileSync(path.join('.gef/prompts', p), applyTemplating(raw, strictness));
    });
  }
}

function createAdrTemplate(gefDir) {
  const templateSrc = path.join(gefDir, 'generator', 'templates', 'adr-template.md');
  const dest = 'docs/explanation/adr/0000-template.md';
  if (fs.existsSync(templateSrc)) fs.copyFileSync(templateSrc, dest);
}

function createPRTemplate(gefDir, language) {
  const localeDir = resolveLocaleDir(gefDir, language);
  // Priorité : locales/<lang>/PULL_REQUEST_TEMPLATE.md → fallback generator/templates
  const localeSrc = path.join(localeDir, 'PULL_REQUEST_TEMPLATE.md');
  const legacySrc = path.join(gefDir, 'generator', 'templates', 'PULL_REQUEST_TEMPLATE.md');
  const templateSrc = fs.existsSync(localeSrc) ? localeSrc : legacySrc;
  fs.mkdirSync('.github', { recursive: true });
  const dest = '.github/PULL_REQUEST_TEMPLATE.md';
  if (fs.existsSync(templateSrc)) fs.copyFileSync(templateSrc, dest);
}

function copyAdditionalWorkflows(gefDir) {
  const src = path.join(gefDir, 'ci-templates', 'pr-intention-check.yml');
  const destDir = '.github/workflows';
  fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(destDir, 'pr-intention-check.yml'));
}

function copyIssueTemplates(gefDir) {
  const srcDir = path.join(gefDir, '.github', 'ISSUE_TEMPLATE');
  if (!fs.existsSync(srcDir)) return;
  const destDir = '.github/ISSUE_TEMPLATE';
  fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  });
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
  const localeDir = resolveLocaleDir(gefDir, answers.language);
  const templatePath = fs.existsSync(path.join(localeDir, 'PROJECT_CONFIG.template.md'))
    ? path.join(localeDir, 'PROJECT_CONFIG.template.md')
    : path.join(gefDir, 'PROJECT_CONFIG.template.md');
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

function createReadme({ projectName, stack, cloud, database, gitWorkflow, strictness, language }) {
  const isEn = language === 'English';
  const header = isEn
    ? `# ${projectName}\n\n## Features\n<TO DO>\n\n## Architecture\n- Stack: ${stack}\n- Cloud: ${cloud}\n- DB: ${database}\n- Git: ${gitWorkflow}\n- Severity: ${strictness}\n`
    : `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Architecture\n- Stack: ${stack}\n- Cloud: ${cloud}\n- DB: ${database}\n- Git: ${gitWorkflow}\n- Sévérité: ${strictness}\n`;
  const footer = isEn ? '*Initially generated by GEF framework:*\n' : '*Généré initialement par le framework GEF:*\n';
  if (fs.existsSync('README.md')) {
    const existing = fs.readFileSync('README.md', 'utf8');
    fs.writeFileSync('README.md', header + '\n---\n' + footer + existing);
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
  createPRTemplate(gefDir, answers.language);
  copyIssueTemplates(gefDir);
  if (answers.includeCI) copyAdditionalWorkflows(gefDir);
  createResearchLog(answers.language);
  createProjectConfig(answers, gefDir);
  createReadme(answers);
  createGitignore(answers.stack);

  if (!fs.existsSync('CHANGELOG.md')) fs.writeFileSync('CHANGELOG.md', '');
  if (!fs.existsSync('LICENSE')) fs.writeFileSync('LICENSE', '');
}
