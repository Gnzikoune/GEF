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
${chalk.dim('Générateur interactif de projets respectant le Guardian Engineering Framework.')}

${chalk.bold.cyan('USAGE')}

  ${chalk.green('npx create-gef')}                  Lance le générateur interactif de projet
  ${chalk.green('npx create-gef update')}           Met à jour le Playbook, les Prompts et les Hooks d'un projet existant
  ${chalk.green('npx create-gef --help')}           Affiche ce message d'aide
  ${chalk.green('npx create-gef --version')}        Affiche la version du framework

${chalk.bold.cyan('COMMANDES')}

  ${chalk.yellow('(aucune)')}   ${chalk.dim('─────────────────')}  Mode interactif : pose 11 questions et génère un projet complet
  ${chalk.yellow('update')}     ${chalk.dim('─────────────────')}  Met à jour les ressources GEF dans un projet existant

${chalk.bold.cyan('OPTIONS DU GÉNÉRATEUR INTERACTIF')}

  ${chalk.magenta('Stack')}            Next.js, React (Vite), Express, FastAPI, Projet vide
  ${chalk.magenta('Base de données')} PostgreSQL, MongoDB, Supabase, Aucune
  ${chalk.magenta('Cloud Provider')} AWS, GCP, Azure, Vercel, Aucun
  ${chalk.magenta('Workflow Git')}    GitHub Flow ${chalk.dim('(PRs, main verrouillé — Recommandé)')} | Trunk-Based Development
  ${chalk.magenta('Sévérité')}        Startup ${chalk.dim('(souple)')} | Standard ${chalk.dim('(recommandé)')} | Mission Critical ${chalk.dim('(strict)')}
  ${chalk.magenta('Linter')}          ESLint + Prettier | Biome | Ruff | Aucun
  ${chalk.magenta('Langue')}          Français | English

${chalk.bold.cyan('CE QUE LE GÉNÉRATEUR PRODUIT')}

  ✅  Structure de projet (Feature-Sliced Design)
  ✅  Documentation Diátaxis ${chalk.dim('(docs/tutorials, how-to, reference, explanation/adr)')}
  ✅  ENGINEERING_PLAYBOOK.md ${chalk.dim('adapté à la sévérité choisie')}
  ✅  Prompts IA ${chalk.dim('(.gef/prompts/) calibrés selon les Hard Limits du projet')}
  ✅  Hooks Git dynamiques ${chalk.dim('(commit-msg, pre-commit, pre-push)')}
  ✅  Fichiers de configuration du Linter ${chalk.dim('(biome.json, .eslintrc, ruff.toml)')}
  ✅  Docker ${chalk.dim('(Dockerfile + docker-compose)')} + ${chalk.dim('database/init.sql si PostgreSQL')}
  ✅  Pipeline CI/CD GitHub Actions ${chalk.dim('(tests, lint, déploiement)')}
  ✅  Automatisation des Releases ${chalk.dim('(release-please)')}

${chalk.bold.cyan('LIENS')}

  📦  NPM       ${chalk.underline('https://npmjs.com/package/create-gef')}
  💻  GitHub    ${chalk.underline('https://github.com/Gnzikoune/GEF')}

`);
}
