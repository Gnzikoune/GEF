// cli/help.js — Affichage de l'aide et de la version du CLI GEF
// Réf. Playbook §1 : SRP

import chalk from 'chalk';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

/**
 * Affiche la version du package.
 */
export function printVersion() {
  console.log(`create-gef v${pkg.version}`);
}

/**
 * Affiche le panneau d'aide complet et coloré.
 */
export function printHelp() {
  console.log(`
${chalk.bold.white('create-gef')} ${chalk.dim(`v${pkg.version}`)}
${chalk.dim('Installe le Guardian Engineering Framework (Couche Agentique PURE).')}

${chalk.bold.cyan('USAGE')}

  ${chalk.green('npx create-gef .')}                Installe GEF dans le dossier courant
  ${chalk.green('npx create-gef <nom>')}            Crée un dossier et installe GEF
  ${chalk.green('npx create-gef update')}           Met à jour le Playbook, les Prompts et les Hooks d'un projet existant
  ${chalk.green('npx create-gef doctor')}           Audit la conformité d'un projet existant au GEF
  ${chalk.green('npx create-gef compliance')}       Compliance as Code (generate, validate, apply-hooks, apply-ci)
  ${chalk.green('npx create-gef --help')}           Affiche ce message d'aide
  ${chalk.green('npx create-gef --version')}        Affiche la version du framework

${chalk.bold.cyan('COMPLIANCE AS CODE')}

  ${chalk.green('npx create-gef compliance generate')}      Génère compliance.yml avec les règles GEF
  ${chalk.green('npx create-gef compliance validate')}      Valide le fichier compliance.yml
  ${chalk.green('npx create-gef compliance apply-hooks')}    Applique les règles aux hooks Git
  ${chalk.green('npx create-gef compliance apply-ci')}       Applique les règles à la CI/CD

${chalk.bold.cyan('CERTIFICATION SYSTEM')}

  ${chalk.green('npx create-gef certify check')}            Vérifie le niveau de certification possible
  ${chalk.green('npx create-gef certify generate')}         Génère badge et rapport de certification

${chalk.bold.cyan('EXTENSION SYSTEM')}

  ${chalk.green('npx create-gef extension install <name>')}  Installe une extension (healthcare, finance, security)
  ${chalk.green('npx create-gef extension list')}            Liste les extensions installées et disponibles
  ${chalk.green('npx create-gef extension remove <name>')}   Désinstalle une extension

${chalk.bold.cyan('DORA METRICS ENHANCEMENT')}

  ${chalk.green('npx create-gef dora trends')}            Génère les graphiques de tendance DORA sur 30 jours

${chalk.bold.cyan('OPTIONS DU GÉNÉRATEUR INTERACTIF')}

  ${chalk.magenta('Workflow Git')}    GitHub Flow ${chalk.dim('(PRs, main verrouillé — Recommandé)')} | Trunk-Based Development
  ${chalk.magenta('Sévérité')}        Startup ${chalk.dim('(souple)')} | Standard ${chalk.dim('(recommandé)')} | Mission Critical ${chalk.dim('(strict)')}
  ${chalk.magenta('Langue')}          Français | English
  ${chalk.magenta('CI/CD')}           Validation GitHub Actions des règles GEF

${chalk.bold.cyan('CE QUE GEF INSTALLE')}

  ✅  Documentation Diátaxis ${chalk.dim('(docs/tutorials, how-to, reference, explanation/adr)')}
  ✅  ENGINEERING_PLAYBOOK.md ${chalk.dim('adapté à la sévérité choisie')}
  ✅  Prompts IA ${chalk.dim('(.gef/prompts/) calibrés selon les Hard Limits du projet')}
  ✅  Hooks Git dynamiques ${chalk.dim('(commit-msg, pre-commit, pre-push) pour faire respecter les règles')}
  ✅  Pipeline CI/CD GitHub Actions ${chalk.dim('(Contrôle Qualité GEF et automatisation des Releases)')}

${chalk.bold.cyan('LIENS')}

  📦  NPM       ${chalk.underline('https://npmjs.com/package/create-gef')}
  💻  GitHub    ${chalk.underline('https://github.com/Gnzikoune/GEF')}

`);
}
