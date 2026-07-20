// features/update.js — Mise à jour d'un projet GEF existant
// Réf. Playbook §1 : SRP — cette fonction met à jour les règles et hooks dynamiques.

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { copyAndTemplateGefAssets } from './scaffold-gef.js';
import { scaffoldGit } from './scaffold-git.js';

/**
 * Lit le fichier de configuration pour en extraire une valeur avec Regex.
 */
function extractFromConfig(content, regex, fallback) {
  const match = content.match(regex);
  return match ? match[1].trim() : fallback;
}

/**
 * Met à jour le Playbook, les prompts IA et les hooks Git
 * d'un projet GEF existant vers la dernière version du framework,
 * tout en respectant ses paramètres (Sévérité, Git Flow, etc.)
 * @param {string} gefDir - Chemin absolu vers la racine du GEF
 */
export function runUpdate(gefDir) {
  if (!fs.existsSync('.git')) {
    console.log(chalk.red('Erreur: Ce dossier ne semble pas être un dépôt Git valide.'));
    process.exit(1);
  }

  // 1. Trouver le fichier de configuration
  const configPath = fs.existsSync('PROJECT_CONFIG.md') 
    ? 'PROJECT_CONFIG.md' 
    : 'PROJECT_CONFIG.template.md';

  if (!fs.existsSync(configPath)) {
    console.log(chalk.red('\nErreur: Impossible de trouver PROJECT_CONFIG.md ou PROJECT_CONFIG.template.md.'));
    console.log(chalk.yellow('Astuce: Le GEF a besoin de ce fichier pour connaître le niveau de sévérité et la stratégie Git de ce projet afin de le mettre à jour sans tout casser.'));
    process.exit(1);
  }

  // 2. Extraire l'environnement du projet
  const content = fs.readFileSync(configPath, 'utf8');
  const gitWorkflow = extractFromConfig(content, /- \*\*Workflow Git \*\*: (.*)/, 'GitHub Flow');
  const strictness = extractFromConfig(content, /- \*\*Sévérité \(Hard Limits\) \*\*: (.*)/, 'Standard / Enterprise');
  const linter = extractFromConfig(content, /- \*\*Linter \/ Formatter \*\*: (.*)/, 'Aucun');
  const language = extractFromConfig(content, /- \*\*Langue par défaut \*\*: (.*)/, 'Français');

  console.log(chalk.blue(`\nLecture de la configuration actuelle du projet :`));
  console.log(`  - Sévérité : ${chalk.yellow(strictness)}`);
  console.log(`  - Git Flow : ${chalk.yellow(gitWorkflow)}`);
  console.log(`  - Linter   : ${chalk.yellow(linter)}`);
  console.log(`  - Langue   : ${chalk.yellow(language)}\n`);

  // 3. Regénérer les assets dynamiquement
  console.log(chalk.yellow('🔄 Mise à jour dynamique des ressources GEF...'));
  
  copyAndTemplateGefAssets(gefDir, strictness, language);
  scaffoldGit(gefDir, gitWorkflow, linter, strictness);

  console.log(chalk.green.bold('\n🎉 Projet GEF mis à jour avec succès !'));
}
