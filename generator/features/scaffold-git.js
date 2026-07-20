// features/scaffold-git.js — Initialisation Git et installation des hooks
// Réf. Playbook §5 : Trunk-Based Development — git init + branch main

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Initialise le dépôt Git sur la branche main (Trunk-Based Development).
 */
function initGitRepo() {
  if (fs.existsSync('.git')) return;
  execSync('git init && git branch -M main', { stdio: 'ignore' });
}

/**
 * Installe les hooks GEF dans .git/hooks/ et les rend exécutables.
 * @param {string} gefDir - Chemin absolu vers la racine du GEF
 */
function installHooks(gefDir) {
  const hooksSrc = path.join(gefDir, 'hooks');
  if (!fs.existsSync(hooksSrc)) return;

  const hooksDest = path.join(process.cwd(), '.git', 'hooks');
  fs.cpSync(hooksSrc, hooksDest, { recursive: true });

  try {
    execSync('chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push', {
      stdio: 'ignore',
    });
  } catch (_) { /* Ignoré sur Windows */ }
}

/**
 * Orchestre l'initialisation Git et l'installation des hooks.
 * @param {string} gefDir
 */
export function scaffoldGit(gefDir) {
  console.log(chalk.yellow('🔗 Initialisation Git et installation des hooks de sécurité...'));
  try {
    initGitRepo();
    installHooks(gefDir);
    console.log(chalk.green('✅ Git initialisé sur main (Trunk-Based Development).'));
  } catch (_) {
    console.log(chalk.red("Erreur lors de l'installation des hooks Git."));
  }
}
