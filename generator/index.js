#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECT_QUESTIONS } from './cli/questions.js';
import { printHelp, printVersion } from './cli/help.js';
import { runUpdate } from './features/update.js';
import { scaffoldStack } from './features/scaffold-stack.js';
import { scaffoldDocker } from './features/scaffold-docker.js';
import { scaffoldCI } from './features/scaffold-ci.js';
import { scaffoldGit } from './features/scaffold-git.js';
import { scaffoldGef } from './features/scaffold-gef.js';
import { scaffoldLinter } from './features/scaffold-linter.js';

const __filename = fileURLToPath(import.meta.url);
const GEF_DIR = path.resolve(path.dirname(__filename), '..');

const arg = process.argv[2];

async function run() {
  // Gestion des commandes et flags
  if (arg === '--help' || arg === '-h') return printHelp();
  if (arg === '--version' || arg === '-v') return printVersion();
  if (arg === 'update') return runUpdate(GEF_DIR);

  // Mode interactif par défaut
  console.log(chalk.cyan.bold('\n🚀 Bienvenue dans le générateur GEF Intelligent\n'));
  console.log(chalk.dim('  Tapez `npx create-gef --help` pour voir toutes les commandes.\n'));

  const answers = await inquirer.prompt(PROJECT_QUESTIONS);
  const projectPath = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\nErreur: Le dossier "${answers.projectName}" existe déjà.`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nCréation du dossier projet : ${projectPath}`));
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  scaffoldStack(answers.stack, answers.projectName, projectPath);
  scaffoldLinter(answers.linter, answers.stack);
  scaffoldGef(answers, GEF_DIR);
  if (answers.includeDocker) scaffoldDocker(answers.stack, answers.database, answers.projectName);
  if (answers.includeCI) scaffoldCI(answers.stack, answers.cloud, answers.projectName);
  scaffoldGit(GEF_DIR, answers.gitWorkflow, answers.linter, answers.strictness);

  console.log(chalk.green.bold(`\n✅ Projet "${answers.projectName}" scaffoldé avec succès !`));
  console.log(chalk.dim(`\n  cd ${answers.projectName} && git status\n`));
}

if (!process.env._GEF_RUNNING) {
  process.env._GEF_RUNNING = '1';
  run().catch((err) => {
    console.error(chalk.red('Une erreur est survenue :'), err);
    process.exit(1);
  });
}
