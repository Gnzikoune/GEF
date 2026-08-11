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
  const srcDir = path.join(gefDir, 'ci-templates');
  const destDir = '.github/workflows';
  fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(srcDir)) {
    fs.readdirSync(srcDir).forEach(file => {
      const srcPath = path.join(srcDir, file);
      const stat = fs.statSync(srcPath);
      if (stat.isFile()) {
        fs.copyFileSync(srcPath, path.join(destDir, file));
      } else if (stat.isDirectory()) {
        const nestedDestDir = path.join(destDir, file);
        fs.mkdirSync(nestedDestDir, { recursive: true });
        fs.readdirSync(srcPath).forEach(nestedFile => {
          const nestedSrcPath = path.join(srcPath, nestedFile);
          if (fs.statSync(nestedSrcPath).isFile()) {
            fs.copyFileSync(nestedSrcPath, path.join(nestedDestDir, nestedFile));
          }
        });
      }
    });
  }
}

function copyIssueTemplates(gefDir, language) {
  const localeDir = resolveLocaleDir(gefDir, language);
  const localeSrcDir = path.join(localeDir, 'ISSUE_TEMPLATE');
  const fallbackSrcDir = path.join(gefDir, '.github', 'ISSUE_TEMPLATE');
  const srcDir = fs.existsSync(localeSrcDir) ? localeSrcDir : fallbackSrcDir;

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

function createContextFile(projectName, language) {
  const isEn = language === 'English';
  const dest = 'CONTEXT.md';
  if (fs.existsSync(dest)) return;
  
  const content = isEn
    ? `# GEF Context Memory
# External memory file for the AI
# Read systematically at each interaction to avoid contextual amnesia

---

## Current Project State

**Project:** ${projectName}
**Phase:** Development
**Main branch:** main

---

## Critical Rules (Anti-Bypass)

### 1. Git Workflow - STRICTLY FORBIDDEN
- ❌ NEVER do \`git push origin main\` or \`git push origin master\`
- ❌ NEVER commit directly on main/master
- ✅ ALWAYS create a branch: \`git checkout -b feat/xxx\` or \`fix/xxx\`
- ✅ ALWAYS go through a Pull Request
- ✅ ALWAYS wait for human validation before merge

### 2. Critical Actions Requiring Checkpoint
Before executing these commands, the AI MUST display \`<gef_compliance_check>\`:
- \`git push\` (any branch)
- \`git merge\`
- \`gh pr merge\`
- \`gh api\` (especially for admin operations)
- Configuration file modifications (.github/, hooks/, .cursorrules)

### 3. Mandatory Documentation
- For \`fix/*\` branches: RESEARCH_LOG.md is MANDATORY
- For package.json modifications: ADR in docs/explanation/adr/ is MANDATORY
- For major architectural decisions: ADR is MANDATORY

---

## Checklist Before Any Action

\`\`\`
<gef_compliance_check>
1. I am on a feature/fix branch, NOT on main/master
2. I have read ENGINEERING_PLAYBOOK.md recently
3. I have verified that this action does not violate Hard Limits
4. If it's a fix, I have updated RESEARCH_LOG.md
5. If it's a git push, I have verified the destination branch
</gef_compliance_check>
\`\`\`

---

## Recent Modifications

- Initial project setup via GEF framework
- Anti-amnesia mechanisms enabled
- Context memory system active
`
    : `# Mémoire Contextuelle GEF
# Fichier de mémoire externe pour l'IA
# Relu systématiquement à chaque interaction pour éviter l'amnésie contextuelle

---

## État Actuel du Projet

**Projet :** ${projectName}
**Phase :** Développement
**Branche principale :** main

---

## Règles Critiques (Anti-Contournement)

### 1. Git Workflow - STRICTEMENT INTERDIT
- ❌ JAMAIS de \`git push origin main\` ou \`git push origin master\`
- ❌ JAMAIS de commits directs sur main/master
- ✅ TOUJOURS créer une branche : \`git checkout -b feat/xxx\` ou \`fix/xxx\`
- ✅ TOUJOURS passer par une Pull Request
- ✅ TOUJOURS attendre validation humaine avant merge

### 2. Actions Critiques Requérant Checkpoint
Avant d'exécuter ces commandes, l'IA DOIT afficher \`<gef_compliance_check>\` :
- \`git push\` (quelle que soit la branche)
- \`git merge\`
- \`gh pr merge\`
- \`gh api\` (surtout pour les opérations d'administration)
- Modifications de fichiers de configuration (.github/, hooks/, .cursorrules)

### 3. Documentation Obligatoire
- Pour les branches \`fix/*\` : RESEARCH_LOG.md est OBLIGATOIRE
- Pour les modifications de package.json : ADR dans docs/explanation/adr/ est OBLIGATOIRE
- Pour les décisions architecturales majeures : ADR est OBLIGATOIRE

---

## Checklist Avant Toute Action

\`\`\`
<gef_compliance_check>
1. Je suis sur une branche feature/fix, PAS sur main/master
2. J'ai lu ENGINEERING_PLAYBOOK.md récemment
3. J'ai vérifié que cette action ne viole pas les Hard Limits
4. Si c'est un fix, j'ai mis à jour RESEARCH_LOG.md
5. Si c'est un git push, j'ai vérifié la branche de destination
</gef_compliance_check>
\`\`\`

---

## Dernières Modifications

- Configuration initiale du projet via GEF
- Mécanismes anti-amnésie activés
- Système de mémoire contextuelle actif
`;
  
  fs.writeFileSync(dest, content);
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
    .replace(/{{PHASE}}/g, answers.phase || 'Développement')
    .replace(/{{GIT_WORKFLOW}}/g, answers.gitWorkflow)
    .replace(/{{STRICTNESS}}/g, answers.strictness)
    .replace(/{{LANGUAGE}}/g, answers.language)
    .replace(/{{DATE}}/g, dateStr);

  fs.writeFileSync('PROJECT_CONFIG.md', content);
}

function createReadme({ projectName, gitWorkflow, strictness, language }) {
  const isEn = language === 'English';
  const header = isEn
    ? `# ${projectName}\n\n## Features\n<TO DO>\n\n## GEF Configuration\n- Git: ${gitWorkflow}\n- Severity: ${strictness}\n`
    : `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Configuration GEF\n- Git: ${gitWorkflow}\n- Sévérité: ${strictness}\n`;
  const footer = isEn ? '*Initially generated by GEF framework:*\n' : '*Généré initialement par le framework GEF:*\n';
  if (fs.existsSync('README.md')) {
    const existing = fs.readFileSync('README.md', 'utf8');
    fs.writeFileSync('README.md', header + '\n---\n' + footer + existing);
  } else {
    fs.writeFileSync('README.md', header);
  }
}

function createGitignore() {
  const content = '\n# GEF Standard\n.env\n.DS_Store\n';
  if (fs.existsSync('.gitignore')) {
    fs.appendFileSync('.gitignore', content);
  } else {
    fs.writeFileSync('.gitignore', content);
  }
}

export function setupGef(answers, gefDir) {
  console.log(chalk.yellow('\n📁 Application de la surcouche GEF...'));
  createDirectories(answers.includeCI);
  copyAndTemplateGefAssets(gefDir, answers.strictness, answers.language);
  createAdrTemplate(gefDir);
  createPRTemplate(gefDir, answers.language);
  copyIssueTemplates(gefDir, answers.language);
  if (answers.includeCI) copyAdditionalWorkflows(gefDir);
  createResearchLog(answers.language);
  createContextFile(answers.projectName, answers.language);
  createProjectConfig(answers, gefDir);
  createReadme(answers);
  createGitignore();

  if (!fs.existsSync('CHANGELOG.md')) fs.writeFileSync('CHANGELOG.md', '');
  if (!fs.existsSync('LICENSE')) fs.writeFileSync('LICENSE', '');
}
