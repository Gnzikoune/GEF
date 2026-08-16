#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECT_QUESTIONS } from './cli/questions.js';
import { printHelp, printVersion } from './cli/help.js';
import { runUpdate } from './features/update.js';
import { setupCI } from './features/setup-ci.js';
import { setupGit } from './features/setup-git.js';
import { setupGef } from './features/setup-gef.js';
import { setupAiRules } from './features/setup-ai-rules.js';
import { doctor } from './features/doctor.js';
import { compliance } from './features/compliance.js';
import { certify } from './features/certification.js';
import { extension } from './features/extension.js';
import { generateTrends } from './features/dora-trends.js';

const __filename = fileURLToPath(import.meta.url);
const GEF_DIR = path.resolve(path.dirname(__filename), '..');

const arg = process.argv[2];

/**
 * Gère les commandes DORA
 */
async function handleDoraCommand(subCommand) {
  if (subCommand === 'trends') {
    return generateTrends();
  }
  
  console.log(chalk.red(`❌ Commande DORA inconnue: ${subCommand}`));
  console.log(chalk.dim('Commandes disponibles: trends'));
}

async function run() {
  // Gestion des commandes et flags
  if (arg === '--help' || arg === '-h') return printHelp();
  if (arg === '--version' || arg === '-v') return printVersion();
  if (arg === 'update') return runUpdate(GEF_DIR);
  if (arg === 'doctor') return doctor();
  if (arg === 'compliance') return compliance(process.argv[3], { strictness: process.argv[4] });
  if (arg === 'certify') return certify(process.argv[3]);
  if (arg === 'extension') return extension(process.argv[3], process.argv[4]);
  if (arg === 'dora') return handleDoraCommand(process.argv[3]);

  // Mode interactif par défaut
  console.log(chalk.cyan.bold('\n🚀 Bienvenue dans le GEF (Guardian Engineering Framework)\n'));
  console.log(chalk.dim('  Installation de la couche Agentique (Règles, Hooks, Docs, CI)...\n'));

  const answers = await inquirer.prompt(PROJECT_QUESTIONS);
  
  const isCurrentDir = answers.projectName === '.' || answers.projectName === './';
  const projectPath = isCurrentDir ? process.cwd() : path.resolve(process.cwd(), answers.projectName);

  if (!isCurrentDir) {
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`\nErreur: Le dossier "${answers.projectName}" existe déjà.`));
      process.exit(1);
    }
    console.log(chalk.blue(`\nCréation du dossier projet : ${projectPath}`));
    fs.mkdirSync(projectPath, { recursive: true });
    process.chdir(projectPath);
  } else {
    console.log(chalk.blue(`\nInitialisation de GEF dans le dossier courant : ${projectPath}`));
  }

  setupGef(answers, GEF_DIR);
  setupAiRules(GEF_DIR, projectPath, answers.strictness);
  
  if (answers.includeCI) {
    setupCI(answers.projectName, {
      strictness: answers.strictness,
      gitWorkflow: answers.gitWorkflow,
    });
  }
  
  setupGit(GEF_DIR, answers.gitWorkflow, answers.strictness);

  console.log(chalk.green.bold(`\n✅ Framework GEF installé avec succès !`));
  if (!isCurrentDir) {
    console.log(chalk.dim(`\n  cd ${answers.projectName} && git status\n`));
  } else {
    console.log(chalk.dim(`\n  Vérifiez les fichiers créés avec "git status"\n`));
  }
}

if (!process.env._GEF_RUNNING) {
  process.env._GEF_RUNNING = '1';
  run().catch((err) => {
    console.error(chalk.red('Une erreur est survenue :'), err);
    process.exit(1);
  });
}
