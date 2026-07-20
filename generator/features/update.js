// features/update.js — Mise à jour d'un projet GEF existant
// Réf. Playbook §1 : SRP — cette fonction ne fait qu'une chose : mettre à jour.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Met à jour le Playbook, les prompts IA et les hooks Git
 * d'un projet GEF existant vers la dernière version du framework.
 * @param {string} gefDir - Chemin absolu vers la racine du GEF
 */
export function runUpdate(gefDir) {
  if (!fs.existsSync('.git')) {
    console.log(chalk.red('Erreur: Ce dossier ne semble pas être un dépôt Git valide.'));
    process.exit(1);
  }

  updatePlaybook(gefDir);
  updatePrompts(gefDir);
  updateHooks(gefDir);

  console.log(chalk.green.bold('\n🎉 Projet mis à jour avec succès !'));
}

/** @param {string} gefDir */
function updatePlaybook(gefDir) {
  const src = path.join(gefDir, 'ENGINEERING_PLAYBOOK.md');
  if (!fs.existsSync(src)) return;
  fs.mkdirSync('.gef', { recursive: true });
  fs.copyFileSync(src, '.gef/ENGINEERING_PLAYBOOK.md');
  console.log(chalk.green('✅ ENGINEERING_PLAYBOOK.md mis à jour.'));
}

/** @param {string} gefDir */
function updatePrompts(gefDir) {
  const src = path.join(gefDir, 'prompts');
  if (!fs.existsSync(src)) return;
  fs.mkdirSync('.gef/prompts', { recursive: true });
  fs.readdirSync(src).forEach((p) => {
    fs.copyFileSync(path.join(src, p), path.join('.gef/prompts', p));
  });
  console.log(chalk.green('✅ Prompts IA mis à jour.'));
}

/** @param {string} gefDir */
function updateHooks(gefDir) {
  const hooksSrc = path.join(gefDir, 'hooks');
  if (!fs.existsSync(hooksSrc)) return;
  const hooksDest = path.join(process.cwd(), '.git', 'hooks');
  fs.cpSync(hooksSrc, hooksDest, { recursive: true });
  try {
    execSync('chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push', {
      stdio: 'ignore',
    });
  } catch (_) { /* Ignoré sur Windows */ }
  console.log(chalk.green('✅ Hooks Git mis à jour.'));
}
