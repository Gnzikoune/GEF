#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GEF_DIR = path.resolve(__dirname, '..');

console.log(chalk.cyan.bold('\n🚀 Bienvenue dans le générateur GEF (Gildas Engineering Framework)\n'));

async function run() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Quel est le nom de votre nouveau projet ?',
      validate: input => input ? true : 'Le nom du projet est requis.'
    },
    {
      type: 'list',
      name: 'stack',
      message: 'Quelle est la stack technologique principale ?',
      choices: ['Node.js', 'Python', 'Frontend Statique', 'Autre']
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Voulez-vous préparer une configuration Docker ?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeCI',
      message: 'Voulez-vous inclure le template de CI/CD GEF ?',
      default: true
    }
  ]);

  const { projectName, stack, includeDocker, includeCI } = answers;
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\nErreur: Le dossier "${projectName}" existe déjà.`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nCréation du projet dans : ${projectPath}`));
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  // 1. Arborescence
  console.log(chalk.yellow('📁 Création de l\'arborescence standard...'));
  const dirs = [
    'docs/adr', 'docs/research', 'src', 'tests', 'scripts',
    'assets', 'infra', 'database'
  ];
  if (includeDocker) dirs.push('docker');
  if (includeCI) dirs.push('.github/workflows');
  
  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

  // 2. README.md
  fs.writeFileSync('README.md', `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Installation\n<À COMPLÉTER>\n\n## Architecture\nStack: ${stack}\n`);

  // 3. PROJECT_CONFIG.md
  let configContent = `# PROJECT_CONFIG.md\n- Projet : ${projectName}\n- Langage : ${stack}\n- Docker : ${includeDocker ? 'Oui' : 'Non'}\n<À COMPLÉTER avec les spécificités du projet>\n`;
  const templatePath = path.join(GEF_DIR, 'PROJECT_CONFIG.template.md');
  if (fs.existsSync(templatePath)) {
    const tpl = fs.readFileSync(templatePath, 'utf-8');
    configContent = tpl.replace('<À COMPLÉTER>', `Stack: ${stack}`);
  }
  fs.writeFileSync('PROJECT_CONFIG.md', configContent);

  // 4. RESEARCH_LOG.md
  fs.writeFileSync('docs/research/RESEARCH_LOG.md', `# Research Log — Journal de bord scientifique\n> Documentez ici la résolution des bugs bloquants.\n\n## 1. <Titre>\n- **Contexte :** \n- **Cause :** \n- **Résolution :** \n`);

  // 5. .gitignore dynamique
  let gitignore = `# Standard\n.env\n.DS_Store\n\n`;
  if (stack === 'Node.js') gitignore += `node_modules/\nbuild/\ndist/\ncoverage/\n`;
  if (stack === 'Python') gitignore += `__pycache__/\nvenv/\n.venv/\n.pytest_cache/\n`;
  fs.writeFileSync('.gitignore', gitignore);

  // 6. Git et Hooks
  console.log(chalk.yellow('🔗 Initialisation Git et installation des hooks...'));
  try {
    execSync('git init', { stdio: 'ignore' });
    const hooksSrc = path.join(GEF_DIR, 'hooks');
    if (fs.existsSync(hooksSrc)) {
      const hooksDest = path.join(projectPath, '.git', 'hooks');
      fs.cpSync(hooksSrc, hooksDest, { recursive: true });
      // Rendre exécutable sous Unix (sans effet néfaste sous Windows)
      try {
        execSync(`chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push`, { stdio: 'ignore' });
      } catch (e) { /* ignore on windows */ }
    }
  } catch (err) {
    console.log(chalk.red('Erreur lors de l\'initialisation de Git.'));
  }

  // 7. CI/CD
  if (includeCI) {
    console.log(chalk.yellow('🤖 Copie du template CI/CD...'));
    const ciSrc = path.join(GEF_DIR, 'ci-templates', 'main.yml');
    if (fs.existsSync(ciSrc)) {
      fs.cpSync(ciSrc, path.join(projectPath, '.github', 'workflows', 'main.yml'));
    }
  }

  // Fichiers vides
  fs.writeFileSync('CHANGELOG.md', '');
  fs.writeFileSync('LICENSE', '');

  console.log(chalk.green.bold(`\n✅ Projet "${projectName}" initialisé avec succès !`));
  console.log(chalk.cyan(`\nPour commencer :`));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  Éditez PROJECT_CONFIG.md`));
  console.log(chalk.white(`  Faites votre premier commit (git add . && git commit -m "chore: initial commit")\n`));
}

run().catch(err => {
  console.error(chalk.red('Une erreur est survenue :'), err);
  process.exit(1);
});
