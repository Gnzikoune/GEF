// scripts/sync-locales.js — Synchronisation automatique des fichiers locales
// Objectif : Synchroniser locales/fr/ et locales/en/ avec leurs sources respectives

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const ROOT = path.join(process.cwd());
const SOURCE_PLAYBOOK_FR = path.join(ROOT, 'ENGINEERING_PLAYBOOK.md');
const SOURCE_PLAYBOOK_EN = path.join(ROOT, 'ENGINEERING_PLAYBOOK.en.md');
const LOCALES_DIR = path.join(ROOT, 'locales');

const LOCALE_FILES = [
  { source: SOURCE_PLAYBOOK_FR, target: path.join(LOCALES_DIR, 'fr', 'ENGINEERING_PLAYBOOK.md') },
  { source: SOURCE_PLAYBOOK_EN, target: path.join(LOCALES_DIR, 'en', 'ENGINEERING_PLAYBOOK.md') }
];

function success(message) {
  console.log(chalk.green(`✅ ${message}`));
}

function error(message) {
  console.log(chalk.red(`❌ ${message}`));
}

function info(message) {
  console.log(chalk.blue(`ℹ️  ${message}`));
}

/**
 * Synchronise un fichier source vers une cible
 */
function syncFile(source, target) {
  try {
    const content = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(target, content, 'utf8');
    return true;
  } catch (err) {
    error(`Erreur lors de la synchronisation de ${path.basename(target)} : ${err.message}`);
    return false;
  }
}

/**
 * Synchronise tous les fichiers locales
 */
function syncLocales() {
  console.log(chalk.bold.cyan('🔄 Synchronisation des fichiers locales avec ENGINEERING_PLAYBOOK.md\n'));
  
  let successCount = 0;
  
  for (const { source, target } of LOCALE_FILES) {
    info(`Synchronisation : ${path.basename(target)}`);
    if (syncFile(source, target)) {
      success(`${path.basename(target)} synchronisé`);
      successCount++;
    }
  }
  
  console.log(chalk.bold.cyan(`\n${successCount}/${LOCALE_FILES.length} fichiers synchronisés`));
  
  if (successCount === LOCALE_FILES.length) {
    success('Synchronisation terminée avec succès');
  } else {
    error('Certains fichiers n\'ont pas été synchronisés');
  }
}

// Exécuter la synchronisation
syncLocales();