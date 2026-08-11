// generator/features/doctor.js — Commande gef doctor : Audit de conformité d'un projet existant
// Réf. Issue #81, specs/spec.md
// Objectif : Permettre aux développeurs de vérifier la conformité de leur projet au GEF

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const ROOT = process.cwd();

/**
 * Affiche un succès.
 */
function success(message) {
  console.log(chalk.green(`✅ ${message}`));
}

/**
 * Affiche une erreur.
 */
function error(message) {
  console.log(chalk.red(`❌ ${message}`));
}

/**
 * Affiche un avertissement.
 */
function warning(message) {
  console.log(chalk.yellow(`⚠️  ${message}`));
}

/**
 * Affiche un info.
 */
function info(message) {
  console.log(chalk.blue(`ℹ️  ${message}`));
}

/**
 * Vérifie les fichiers de règles IA (.cursorrules, .windsurfrules)
 */
function checkAIRules() {
  console.log(chalk.cyan('\n📁 Fichiers de Règles IA'));
  
  const cursorPath = path.join(ROOT, '.cursorrules');
  const windsurfPath = path.join(ROOT, '.windsurfrules');
  
  let score = 0;
  let max = 4;
  
  // Vérifier existence .cursorrules
  if (fs.existsSync(cursorPath)) {
    success('.cursorrules existe');
    score++;
  } else {
    error('.cursorrules manquant');
  }
  
  // Vérifier existence .windsurfrules
  if (fs.existsSync(windsurfPath)) {
    success('.windsurfrules existe');
    score++;
  } else {
    error('.windsurfrules manquant');
  }
  
  // Vérifier synchronisation
  if (fs.existsSync(cursorPath) && fs.existsSync(windsurfPath)) {
    const cursorContent = fs.readFileSync(cursorPath, 'utf8');
    const windsurfContent = fs.readFileSync(windsurfPath, 'utf8');
    
    if (cursorContent === windsurfContent) {
      success('.cursorrules et .windsurfrules synchronisés');
      score++;
    } else {
      error('.cursorrules et .windsurfrules désynchronisés');
    }
  } else {
    error('Synchronisation impossible (fichiers manquants)');
  }
  
  // Vérifier placeholders non résolus
  if (fs.existsSync(cursorPath)) {
    const cursorContent = fs.readFileSync(cursorPath, 'utf8');
    const placeholderPattern = /\{\{[A-Z_]+\}\}/g;
    const placeholders = cursorContent.match(placeholderPattern);
    
    if (placeholders && placeholders.length > 0) {
      error(`Placeholders non résolus détectés : ${[...new Set(placeholders)].join(', ')}`);
    } else {
      success('Aucun placeholder non résolu');
      score++;
    }
  } else {
    error('Détection des placeholders impossible (.cursorrules manquant)');
  }
  
  return { score, max };
}

/**
 * Vérifie les fichiers obligatoires du GEF
 */
function checkMandatoryFiles() {
  console.log(chalk.cyan('\n📄 Fichiers Obligatoires'));
  
  const mandatoryFiles = [
    { path: 'ENGINEERING_PLAYBOOK.md', alt: '.gef/ENGINEERING_PLAYBOOK.md' },
    { path: 'PROJECT_CONFIG.md', alt: null },
    { path: 'CONTEXT.md', alt: null },
    { path: 'docs/research/RESEARCH_LOG.md', alt: null },
  ];
  
  let score = 0;
  let max = mandatoryFiles.length;
  
  for (const file of mandatoryFiles) {
    const mainPath = path.join(ROOT, file.path);
    const altPath = file.alt ? path.join(ROOT, file.alt) : null;
    
    if (fs.existsSync(mainPath)) {
      success(`${file.path} existe`);
      score++;
    } else if (altPath && fs.existsSync(altPath)) {
      success(`${file.alt} existe (alternative)`);
      score++;
    } else {
      error(`${file.path} manquant`);
    }
  }
  
  return { score, max };
}

/**
 * Vérifie la configuration Git
 */
function checkGitConfig() {
  console.log(chalk.cyan('\n🔧 Configuration Git'));
  
  const gitDir = path.join(ROOT, '.git');
  
  if (!fs.existsSync(gitDir)) {
    error('Ce n\'est pas un dépôt Git');
    return { score: 0, max: 4 };
  }
  
  let score = 0;
  let max = 4;
  
  const hooks = ['pre-commit', 'pre-push', 'commit-msg'];
  
  for (const hook of hooks) {
    const hookPath = path.join(gitDir, 'hooks', hook);
    if (fs.existsSync(hookPath)) {
      success(`Hook ${hook} présent`);
      score++;
    } else {
      error(`Hook ${hook} manquant`);
    }
  }
  
  // Détecter la stratégie Git
  const configPath = path.join(gitDir, 'config');
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf8');
    
    if (config.includes('branch.main') || config.includes('branch.master')) {
      success('Branche principale détectée (main ou master)');
      score++;
      
      // Tenter de détecter la stratégie
      if (fs.existsSync(path.join(gitDir, 'hooks', 'pre-push'))) {
        const prePushContent = fs.readFileSync(path.join(gitDir, 'hooks', 'pre-push'), 'utf8');
        if (prePushContent.includes('main') && prePushContent.includes('block')) {
          info('Stratégie détectée : GitHub Flow (protection main activée)');
        } else {
          info('Stratégie détectée : Trunk-Based ou custom');
        }
      }
    } else {
      warning('Branche principale non configurée (main/master)');
    }
  } else {
    warning('Configuration Git introuvable');
  }
  
  return { score, max };
}

/**
 * Vérifie la configuration CI/CD
 */
function checkCIConfig() {
  console.log(chalk.cyan('\n🚀 Configuration CI/CD'));
  
  const workflowsDir = path.join(ROOT, '.github', 'workflows');
  
  if (!fs.existsSync(workflowsDir)) {
    error('.github/workflows/ manquant');
    return { score: 0, max: 3 };
  }
  
  let score = 0;
  let max = 3;
  
  success('.github/workflows/ existe');
  score++;
  
  const workflowFiles = fs.readdirSync(workflowsDir);
  if (workflowFiles.length > 0) {
    success(`${workflowFiles.length} workflow(s) GitHub Actions détecté(s)`);
    score++;
    
    // Vérifier si des étapes GEF sont présentes
    let hasGefSteps = false;
    for (const file of workflowFiles) {
      const workflowPath = path.join(workflowsDir, file);
      const content = fs.readFileSync(workflowPath, 'utf8');
      
      if (content.includes('lint') || content.includes('test') || content.includes('security')) {
        hasGefSteps = true;
        break;
      }
    }
    
    if (hasGefSteps) {
      success('Étapes de validation GEF détectées (lint, tests, security)');
      score++;
    } else {
      warning('Aucune étape de validation GEF détectée');
    }
  } else {
    error('Aucun workflow GitHub Actions présent');
  }
  
  return { score, max };
}

/**
 * Vérifie la configuration du linter
 */
function checkLinterConfig() {
  console.log(chalk.cyan('\n🔍 Configuration du Linter'));
  
  const linterConfigs = [
    { name: 'ESLint', files: ['.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs', 'eslint.config.js'] },
    { name: 'Biome', files: ['biome.json', 'biome.jsonc'] },
    { name: 'Ruff', files: ['ruff.toml', '.ruff.toml', 'pyproject.toml'] },
    { name: 'Pylint', files: ['.pylintrc', 'pylintrc', 'pyproject.toml'] },
    { name: 'Flake8', files: ['.flake8', 'setup.cfg', 'tox.ini'] },
  ];
  
  let detectedLinter = null;
  
  for (const linter of linterConfigs) {
    for (const file of linter.files) {
      if (fs.existsSync(path.join(ROOT, file))) {
        detectedLinter = linter.name;
        break;
      }
    }
    if (detectedLinter) break;
  }
  
  if (detectedLinter) {
    success(`Linter détecté : ${detectedLinter}`);
    
    // Vérifier si les Hard Limits sont appliquées (ESLint seulement)
    if (detectedLinter === 'ESLint') {
      const eslintConfig = linterConfigs[0].files.find(f => fs.existsSync(path.join(ROOT, f)));
      if (eslintConfig) {
        const content = fs.readFileSync(path.join(ROOT, eslintConfig), 'utf8');
        if (content.includes('max-lines-per-function') || content.includes('max-params')) {
          success('Hard Limits ESLint appliquées');
          return { score: 2, max: 2 };
        } else {
          warning('Hard Limits ESLint non appliquées');
          return { score: 1, max: 2 };
        }
      }
    }
    
    return { score: 1, max: 2 };
  } else {
    warning('Aucun linter détecté');
    return { score: 0, max: 2 };
  }
}

/**
 * Affiche le rapport final avec le score de conformité
 */
function displayFinalReport(results) {
  const totalScore = Object.values(results).reduce((sum, r) => sum + r.score, 0);
  const totalMax = Object.values(results).reduce((sum, r) => sum + r.max, 0);
  const percentage = Math.round((totalScore / totalMax) * 100);
  
  console.log(chalk.cyan('\n─────────────────────────────────────'));
  console.log(chalk.bold(`📊 Score de Conformité : ${totalScore}/${totalMax} (${percentage}%)`));
  console.log(chalk.cyan('─────────────────────────────────────'));
  
  if (percentage === 100) {
    console.log(chalk.green('\n🎉 Votre projet est parfaitement conforme au GEF !'));
  } else if (percentage >= 70) {
    console.log(chalk.yellow('\n⚠️  Votre projet est globalement conforme mais quelques améliorations sont possibles.'));
  } else if (percentage >= 40) {
    console.log(chalk.red('\n❌ Votre projet présente plusieurs incohérences avec le GEF.'));
  } else {
    console.log(chalk.red.bold('\n🚨 Votre projet n\'est pas configuré avec le GEF ou présente de graves incohérences.'));
  }
}

/**
 * Fonction principale du doctor
 */
export async function doctor() {
  console.log(chalk.bold.cyan('🩺 GEF Doctor — Audit de Conformité\n'));
  
  // Vérifier si on est dans un dépôt Git
  const gitDir = path.join(ROOT, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log(chalk.yellow('⚠️  Ce n\'est pas un dépôt Git. Le doctor nécessite un dépôt Git pour fonctionner.'));
    console.log(chalk.blue('💡 Initialisez un dépôt Git avec : git init'));
    return;
  }
  
  const results = {
    aiRules: checkAIRules(),
    mandatoryFiles: checkMandatoryFiles(),
    gitConfig: checkGitConfig(),
    ciConfig: checkCIConfig(),
    linterConfig: checkLinterConfig(),
  };
  
  displayFinalReport(results);
}
