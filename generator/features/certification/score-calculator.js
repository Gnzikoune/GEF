// generator/features/certification/score-calculator.js — Calcul des scores GEF et DORA
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Calcul des scores pour la certification

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { calculateChangeFailureRate, calculateTimeToRestore, getDoraLevel } from '../dora.js';

const ROOT = process.cwd();

/**
 * Benchmarks DORA industry standards
 */
const DORA_BENCHMARKS = {
  deployment_frequency: {
    elite: 'multiple_per_day',
    high: 'per_day',
    medium: 'per_week',
    low: 'per_month'
  },
  lead_time_hours: {
    elite: 1,
    high: 24,
    medium: 168,
    low: 720
  },
  change_failure_rate: {
    elite: 5,
    high: 15,
    medium: 30,
    low: 45
  },
  time_to_restore_hours: {
    elite: 1,
    high: 24,
    medium: 168,
    low: 720
  }
};

/**
 * Calcule le score GEF (0-100%)
 * Réutilise la logique du doctor pour calculer la conformité
 */
export function calculateGEFScore() {
  console.log(chalk.cyan.bold('\n📊 Calcul du score GEF...'));
  
  const checks = {
    aiRules: 0,
    mandatoryFiles: 0,
    gitConfig: 0,
    ciConfig: 0,
    linterConfig: 0
  };
  
  const maxValues = {
    aiRules: 4,
    mandatoryFiles: 4,
    gitConfig: 4,
    ciConfig: 3,
    linterConfig: 2
  };
  
  // Vérification fichiers de règles IA
  const cursorPath = path.join(ROOT, '.cursorrules');
  const windsurfPath = path.join(ROOT, '.windsurfrules');
  
  if (fs.existsSync(cursorPath)) checks.aiRules++;
  if (fs.existsSync(windsurfPath)) checks.aiRules++;
  
  if (fs.existsSync(cursorPath) && fs.existsSync(windsurfPath)) {
    const cursorContent = fs.readFileSync(cursorPath, 'utf8');
    const windsurfContent = fs.readFileSync(windsurfPath, 'utf8');
    if (cursorContent === windsurfContent) checks.aiRules++;
    
    const placeholderPattern = /\{\{[A-Z_]+\}\}/g;
    const placeholders = cursorContent.match(placeholderPattern);
    if (!placeholders || placeholders.length === 0) checks.aiRules++;
  }
  
  // Vérification fichiers obligatoires
  const mandatoryFiles = [
    'ENGINEERING_PLAYBOOK.md',
    'PROJECT_CONFIG.md',
    'CONTEXT.md',
    'docs/research/RESEARCH_LOG.md'
  ];
  
  for (const file of mandatoryFiles) {
    if (fs.existsSync(path.join(ROOT, file))) checks.mandatoryFiles++;
  }
  
  // Vérification Git
  const gitDir = path.join(ROOT, '.git');
  if (fs.existsSync(gitDir)) {
    const hooks = ['pre-commit', 'pre-push', 'commit-msg'];
    for (const hook of hooks) {
      if (fs.existsSync(path.join(gitDir, 'hooks', hook))) checks.gitConfig++;
    }
    checks.gitConfig++; // Pour la branche principale
  }
  
  // Vérification CI/CD
  const workflowsDir = path.join(ROOT, '.github', 'workflows');
  if (fs.existsSync(workflowsDir)) {
    checks.ciConfig++;
    const workflowFiles = fs.readdirSync(workflowsDir);
    if (workflowFiles.length > 0) checks.ciConfig++;
    checks.ciConfig++; // Pour les étapes GEF
  }
  
  // Vérification Linter
  const linterConfigs = [
    '.eslintrc', '.eslintrc.json', '.eslintrc.js', 'eslint.config.js',
    'biome.json', 'biome.jsonc',
    'ruff.toml', '.ruff.toml', 'pyproject.toml'
  ];
  
  for (const config of linterConfigs) {
    if (fs.existsSync(path.join(ROOT, config))) {
      checks.linterConfig++;
      break;
    }
  }
  
  const scores = [checks.aiRules, checks.mandatoryFiles, checks.gitConfig, checks.ciConfig, checks.linterConfig];
  const maxScores = [maxValues.aiRules, maxValues.mandatoryFiles, maxValues.gitConfig, maxValues.ciConfig, maxValues.linterConfig];
  
  const totalScore = scores.reduce((sum, val, index) => {
    const denominator = maxScores[index] || 1;
    return sum + (val / denominator) * 20;
  }, 0);
  
  const percentage = Math.min(100, Math.max(0, Math.round(totalScore)));
  
  console.log(chalk.green(`✅ Score GEF : ${percentage}%`));
  return percentage;
}

/**
 * Calcule le score DORA (0-100%)
 * Analyse les métriques DORA via compliance.yml ou données réelles
 */
export function calculateDORAScore() {
  console.log(chalk.cyan.bold('\n📈 Calcul du score DORA...'));
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (!fs.existsSync(compliancePath)) {
    console.log(chalk.yellow('⚠️  compliance.yml non trouvé. Utilisation des valeurs par défaut.'));
    return 50; // Score moyen par défaut
  }
  
  try {
    const content = fs.readFileSync(compliancePath, 'utf8');
    const config = yaml.load(content);
    
    if (!config.dora || !config.dora.targets) {
      console.log(chalk.yellow('⚠️  Configuration DORA non trouvée dans compliance.yml'));
      return 50;
    }
    
    const targets = config.dora.targets;
    const benchmarks = config.dora.benchmarks || DORA_BENCHMARKS;
    
    // Calculer CFR et MTTR automatiquement si non fournis
    let cfr = targets.change_failure_rate;
    let mttr = targets.time_to_restore_hours;
    
    if (cfr === undefined) {
      const gitHistory = getGitHistory();
      cfr = calculateChangeFailureRate(gitHistory);
      console.log(chalk.dim(`📊 CFR calculé automatiquement : ${cfr.toFixed(1)}%`));
    }
    
    if (mttr === undefined) {
      mttr = calculateTimeToRestore(ROOT);
      console.log(chalk.dim(`📊 MTTR calculé automatiquement : ${mttr.toFixed(1)}h`));
    }
    
    let score = 0;
    let max_score = 0;
    
    // Deployment Frequency
    if (targets.deployment_frequency) {
      max_score += 25;
      const level = getDORALevel(targets.deployment_frequency, benchmarks.deployment_frequency);
      score += level * 25;
    }
    
    // Lead Time
    if (targets.lead_time_hours) {
      max_score += 25;
      const level = getDORALevelHours(targets.lead_time_hours, benchmarks.lead_time_hours);
      score += level * 25;
    }
    
    // Change Failure Rate
    if (cfr !== undefined) {
      max_score += 25;
      const level = getDoraLevel('changeFailureRate', cfr);
      const levelScore = level.label === 'Elite' ? 1 : 
                         level.label === 'High' ? 0.75 : 
                         level.label === 'Medium' ? 0.5 : 0.25;
      score += levelScore * 25;
    }
    
    // Time to Restore
    if (mttr !== undefined) {
      max_score += 25;
      const level = getDoraLevel('timeToRestore', mttr);
      const levelScore = level.label === 'Elite' ? 1 : 
                         level.label === 'High' ? 0.75 : 
                         level.label === 'Medium' ? 0.5 : 0.25;
      score += levelScore * 25;
    }
    
    const percentage = max_score > 0 ? Math.round((score / max_score) * 100) : 50;
    
    console.log(chalk.green(`✅ Score DORA : ${percentage}%`));
    return percentage;
    
  } catch (err) {
    console.log(chalk.red(`❌ Erreur lors du calcul DORA : ${err.message}`));
    return 50;
  }
}

/**
 * Obtient l'historique Git basique (simplifié)
 */
function getGitHistory() {
  try {
    const { execSync } = require('child_process');
    const log = execSync('git log --all --pretty=format:"%H|%s|%ai" -20', 
                      { encoding: 'utf8', cwd: ROOT });
    const lines = log.trim().split('\n');
    const commits = lines.map(line => {
      const [hash, message, date] = line.split('|');
      return { hash, message, date: new Date(date) };
    });
    return { commits };
  } catch (err) {
    return { commits: [] };
  }
}

/**
 * Détermine le niveau DORA (0-1) pour une valeur textuelle
 */
function getDORALevel(value, benchmarks) {
  if (value === benchmarks.elite) return 1;
  if (value === benchmarks.high) return 0.75;
  if (value === benchmarks.medium) return 0.5;
  if (value === benchmarks.low) return 0.25;
  return 0.5;
}

/**
 * Détermine le niveau DORA (0-1) pour une valeur en heures
 */
function getDORALevelHours(value, benchmarks, inverted = false) {
  if (value <= benchmarks.elite) return inverted ? 1 : 1;
  if (value <= benchmarks.high) return inverted ? 0.75 : 0.75;
  if (value <= benchmarks.medium) return inverted ? 0.5 : 0.5;
  if (value <= benchmarks.low) return inverted ? 0.25 : 0.25;
  return 0.25;
}

/**
 * Détermine le niveau DORA (0-1) pour un pourcentage
 */
function getDORALevelPercent(value, benchmarks, inverted = false) {
  if (value <= benchmarks.elite) return inverted ? 1 : 1;
  if (value <= benchmarks.high) return inverted ? 0.75 : 0.75;
  if (value <= benchmarks.medium) return inverted ? 0.5 : 0.5;
  if (value <= benchmarks.low) return inverted ? 0.25 : 0.25;
  return 0.25;
}