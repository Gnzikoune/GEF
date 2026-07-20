// features/scaffold-linter.js — Génération des configurations de linter dynamiques
// Réf. Playbook : Code Quality

import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Configure ESLint et Prettier.
 */
function configureEslint(stack) {
  console.log(chalk.yellow('🧹 Configuration de ESLint + Prettier...'));
  const eslintConfig = {
    env: { browser: true, es2021: true, node: true },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {},
  };
  fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
  fs.writeFileSync('.prettierrc', '{\n  "semi": true,\n  "singleQuote": true,\n  "printWidth": 100\n}\n');
  
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.lint = 'eslint . && prettier --check .';
    pkg.scripts['lint:fix'] = 'eslint . --fix && prettier --write .';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  }
}

/**
 * Configure Biome.
 */
function configureBiome() {
  console.log(chalk.yellow('⚡ Configuration de Biome...'));
  const biomeConfig = {
    $schema: "https://biomejs.dev/schemas/1.8.3/schema.json",
    formatter: {
      enabled: true,
      formatWithErrors: false,
      indentStyle: "space",
      indentWidth: 2,
      lineWidth: 100
    },
    linter: {
      enabled: true,
      rules: { recommended: true }
    }
  };
  fs.writeFileSync('biome.json', JSON.stringify(biomeConfig, null, 2));
  
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.lint = 'biome check .';
    pkg.scripts['lint:fix'] = 'biome check --write .';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  }
}

/**
 * Configure Ruff pour Python.
 */
function configureRuff() {
  console.log(chalk.yellow('🐍 Configuration de Ruff...'));
  const ruffToml = `[lint]
select = ["E", "F", "I"]
ignore = []

[format]
quote-style = "double"
indent-style = "space"
`;
  fs.writeFileSync('ruff.toml', ruffToml);
}

/**
 * Orchestre la génération de la configuration du linter.
 */
export function scaffoldLinter(linterChoice, stack) {
  if (linterChoice === 'Aucun' || !linterChoice) return;

  try {
    if (linterChoice.includes('ESLint')) configureEslint(stack);
    else if (linterChoice.includes('Biome')) configureBiome();
    else if (linterChoice.includes('Ruff')) configureRuff();
    console.log(chalk.green('✅ Linter configuré.'));
  } catch (err) {
    console.log(chalk.red('Erreur lors de la configuration du linter.'));
  }
}
