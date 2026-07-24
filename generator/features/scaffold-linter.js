// features/scaffold-linter.js — Génération des configurations de linter dynamiques
// Réf. Playbook : Code Quality

import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Détermine les limites métriques selon le niveau de sévérité.
 */
function getLimits(strictness) {
  if (strictness.includes('Startup')) return { maxLines: 50, maxParams: 4, maxComplexity: 15 };
  if (strictness.includes('Mission Critical')) return { maxLines: 15, maxParams: 2, maxComplexity: 5 };
  return { maxLines: 30, maxParams: 3, maxComplexity: 10 }; // Standard
}

/**
 * Configure ESLint et Prettier.
 */
function configureEslint(stack, strictness) {
  console.log(chalk.yellow('🧹 Configuration de ESLint + Prettier avec Hard Limits...'));
  const limits = getLimits(strictness);
  const eslintConfig = {
    env: { browser: true, es2021: true, node: true },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'max-lines-per-function': ['error', limits.maxLines],
      'max-params': ['error', limits.maxParams],
      'complexity': ['error', limits.maxComplexity]
    },
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
function configureBiome(strictness) {
  console.log(chalk.yellow('⚡ Configuration de Biome avec Hard Limits...'));
  console.log(chalk.yellow('⚠️  Note: Les limites de lignes et paramètres ne sont pas supportées nativement par Biome dans cette configuration. Seule la complexité est vérifiée.'));
  const limits = getLimits(strictness);
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
      rules: {
        recommended: true,
        complexity: {
          noExcessiveCognitiveComplexity: {
            level: "error",
            options: { maxAllowedComplexity: limits.maxComplexity }
          }
        }
      }
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
function configureRuff(strictness) {
  console.log(chalk.yellow('🐍 Configuration de Ruff avec Hard Limits...'));
  console.log(chalk.yellow('⚠️  Note: Les limites de lignes et paramètres ne sont pas supportées nativement par Ruff dans cette configuration. Seule la complexité est vérifiée.'));
  const limits = getLimits(strictness);
  const ruffToml = `[lint]
select = ["E", "F", "I", "C90"]
ignore = []

[lint.mccabe]
max-complexity = ${limits.maxComplexity}

[format]
quote-style = "double"
indent-style = "space"
`;
  fs.writeFileSync('ruff.toml', ruffToml);
}

/**
 * Orchestre la génération de la configuration du linter.
 */
export function scaffoldLinter(linterChoice, stack, strictness) {
  if (linterChoice === 'Aucun' || !linterChoice) return;

  try {
    if (linterChoice.includes('ESLint')) configureEslint(stack, strictness);
    else if (linterChoice.includes('Biome')) configureBiome(strictness);
    else if (linterChoice.includes('Ruff')) configureRuff(strictness);
    console.log(chalk.green('✅ Linter configuré.'));
  } catch (err) {
    console.log(chalk.red('Erreur lors de la configuration du linter.'));
  }
}
