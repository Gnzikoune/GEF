#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECT_QUESTIONS } from './cli/questions.js';
import { runUpdate } from './features/update.js';
import { scaffoldStack } from './features/scaffold-stack.js';
import { scaffoldDocker } from './features/scaffold-docker.js';
import { scaffoldCI } from './features/scaffold-ci.js';
import { scaffoldGit } from './features/scaffold-git.js';
import { scaffoldGef } from './features/scaffold-gef.js';

const __filename = fileURLToPath(import.meta.url);
const GEF_DIR = path.resolve(path.dirname(__filename), '..');

async function run() {
  console.log(chalk.cyan.bold('\n🚀 Bienvenue dans le générateur GEF Intelligent\n'));

  if (process.argv[2] === 'update') return runUpdate(GEF_DIR);

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
  scaffoldGef(answers, GEF_DIR);
  if (answers.includeDocker) scaffoldDocker(answers.stack, answers.database, answers.projectName);
  if (answers.includeCI) scaffoldCI(answers.stack, answers.cloud, answers.projectName);
  scaffoldGit(GEF_DIR);

  console.log(chalk.green.bold(`\n✅ Projet "${answers.projectName}" scaffoldé avec succès !`));
}

if (!process.env._GEF_RUNNING) {
  process.env._GEF_RUNNING = '1';
  run().catch((err) => {
    console.error(chalk.red('Une erreur est survenue :'), err);
    process.exit(1);
  });
}
