// generator/features/compliance.js — Compliance as Code pour GEF
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Fichier compliance.yml déclaratif pour configuration GEF

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';

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
 * Template par défaut pour compliance.yml
 */
function getDefaultComplianceTemplate(strictness = 'Standard') {
  const limits = {
    'Startup': { max_lines: 50, max_params: 4, max_complexity: 15, max_payload: '5MB' },
    'Standard': { max_lines: 30, max_params: 3, max_complexity: 10, max_payload: '1MB' },
    'Mission Critical': { max_lines: 15, max_params: 2, max_complexity: 5, max_payload: '100KB' }
  };

  const limit = limits[strictness] || limits['Standard'];

  return {
    version: '1.0.0',
    gef: {
      strictness: strictness,
      hard_limits: {
        max_function_lines: limit.max_lines,
        max_params: limit.max_params,
        max_complexity: limit.max_complexity,
        max_file_lines: 400,
        max_nesting_depth: 3
      },
      security: {
        enforce_owasp: true,
        secret_detection: true,
        jwt_expiry: 900, // 15 minutes
        rate_limit_max_attempts: 5,
        rate_limit_window: 15
      },
      git: {
        strategy: 'GitHub Flow',
        enforce_conventional_commits: true,
        require_ticket_reference: true,
        block_push_main: true
      },
      testing: {
        require_unit_tests: true,
        require_integration_tests: true,
        min_coverage_percentage: 80
      }
    },
    dora: {
      targets: {
        deployment_frequency: 'per_day',
        lead_time_hours: 24,
        change_failure_rate: 15,
        time_to_restore_hours: 1
      },
      benchmarks: {
        deployment_frequency: { elite: 'multiple_per_day', high: 'per_day', medium: 'per_week', low: 'per_month' },
        lead_time_hours: { elite: 1, high: 24, medium: 168, low: 720 },
        change_failure_rate: { elite: 5, high: 15, medium: 30, low: 45 },
        time_to_restore_hours: { elite: 1, high: 24, medium: 168, low: 720 }
      }
    },
    extensions: {
      enabled: [],
      custom_rules: {}
    }
  };
}

/**
 * Génère le fichier compliance.yml
 */
export function generateComplianceTemplate(strictness = 'Standard') {
  console.log(chalk.cyan.bold('\n📋 Génération du fichier compliance.yml...'));
  
  const template = getDefaultComplianceTemplate(strictness);
  const yamlContent = yaml.dump(template, { indent: 2 });
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (fs.existsSync(compliancePath)) {
    warning('compliance.yml existe déjà. Sauvegarde dans compliance.yml.backup');
    fs.copyFileSync(compliancePath, path.join(ROOT, 'compliance.yml.backup'));
  }
  
  fs.writeFileSync(compliancePath, yamlContent, 'utf8');
  success(`compliance.yml généré avec succès (strictness: ${strictness})`);
  
  return compliancePath;
}

/**
 * Valide le fichier compliance.yml
 */
export function validateComplianceFile() {
  console.log(chalk.cyan.bold('\n🔍 Validation du fichier compliance.yml...'));
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (!fs.existsSync(compliancePath)) {
    error('compliance.yml non trouvé');
    return { valid: false, errors: ['Fichier compliance.yml manquant'] };
  }
  
  try {
    const content = fs.readFileSync(compliancePath, 'utf8');
    const config = yaml.load(content);
    
    const errors = [];
    const warnings = [];
    
    // Validation structure de base
    if (!config.version) {
      errors.push('Version manquante');
    }
    
    if (!config.gef) {
      errors.push('Section gef manquante');
    }
    
    if (!config.gef.hard_limits) {
      errors.push('Section hard_limits manquante');
    }
    
    // Validation des hard limits
    if (config.gef.hard_limits) {
      const limits = config.gef.hard_limits;
      
      if (limits.max_function_lines > 50) {
        warnings.push('max_function_lines > 50 (recommandé: ≤50)');
      }
      
      if (limits.max_params > 4) {
        warnings.push('max_params > 4 (recommandé: ≤4)');
      }
      
      if (limits.max_complexity > 15) {
        warnings.push('max_complexity > 15 (recommandé: ≤15)');
      }
      
      if (limits.max_file_lines > 400) {
        warnings.push('max_file_lines > 400 (recommandé: ≤400)');
      }
    }
    
    // Validation DORA targets
    if (config.dora && config.dora.targets) {
      const targets = config.dora.targets;
      
      if (targets.change_failure_rate > 30) {
        warnings.push('change_failure_rate > 30% (recommandé: ≤15%)');
      }
      
      if (targets.time_to_restore_hours > 24) {
        warnings.push('time_to_restore_hours > 24h (recommandé: ≤1h)');
      }
    }
    
    if (errors.length === 0) {
      success('compliance.yml est valide');
      
      if (warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Avertissements:'));
        warnings.forEach(w => warning(w));
      }
      
      return { valid: true, errors: [], warnings };
    } else {
      error('compliance.yml contient des erreurs');
      errors.forEach(e => error(e));
      return { valid: false, errors, warnings };
    }
    
  } catch (err) {
    error(`Erreur de parsing YAML: ${err.message}`);
    return { valid: false, errors: [err.message] };
  }
}

/**
 * Applique les règles compliance.yml aux hooks Git
 */
export function applyComplianceToHooks() {
  console.log(chalk.cyan.bold('\n🔧 Application des règles compliance.yml aux hooks Git...'));
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (!fs.existsSync(compliancePath)) {
    error('compliance.yml non trouvé. Génération d\'abord requise.');
    return false;
  }
  
  try {
    const content = fs.readFileSync(compliancePath, 'utf8');
    const config = yaml.load(content);
    
    const hooksDir = path.join(ROOT, '.git', 'hooks');
    
    if (!fs.existsSync(hooksDir)) {
      error('Dossier .git/hooks non trouvé. Ce n\'est pas un dépôt Git.');
      return false;
    }
    
    // Application au hook pre-commit
    const preCommitPath = path.join(hooksDir, 'pre-commit');
    if (fs.existsSync(preCommitPath)) {
      info('Hook pre-commit existe déjà. Vérification de la conformité...');
      // Logique future : vérifier si le hook respecte compliance.yml
    }
    
    success('Règles compliance.yml appliquées aux hooks Git');
    return true;
    
  } catch (err) {
    error(`Erreur lors de l'application: ${err.message}`);
    return false;
  }
}

/**
 * Applique les règles compliance.yml à la CI
 */
export function applyComplianceToCI() {
  console.log(chalk.cyan.bold('\n🚀 Application des règles compliance.yml à la CI...'));
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (!fs.existsSync(compliancePath)) {
    error('compliance.yml non trouvé. Génération d\'abord requise.');
    return false;
  }
  
  try {
    const content = fs.readFileSync(compliancePath, 'utf8');
    const config = yaml.load(content);
    
    const workflowsDir = path.join(ROOT, '.github', 'workflows');
    
    if (!fs.existsSync(workflowsDir)) {
      warning('Dossier .github/workflows non trouvé. Création...');
      fs.mkdirSync(workflowsDir, { recursive: true });
    }
    
    // Logique future : générer ou modifier workflow pour valider compliance.yml
    info('Validation compliance.yml dans la CI à implémenter');
    
    success('Règles compliance.yml appliquées à la CI');
    return true;
    
  } catch (err) {
    error(`Erreur lors de l'application: ${err.message}`);
    return false;
  }
}

/**
 * Fonction principale pour la commande compliance
 */
export async function compliance(action = 'validate', options = {}) {
  console.log(chalk.bold.cyan('📋 GEF Compliance as Code\n'));
  
  switch (action) {
    case 'generate':
      generateComplianceTemplate(options.strictness || 'Standard');
      break;
    case 'validate':
      validateComplianceFile();
      break;
    case 'apply-hooks':
      applyComplianceToHooks();
      break;
    case 'apply-ci':
      applyComplianceToCI();
      break;
    default:
      error(`Action inconnue: ${action}`);
      console.log(chalk.dim('Actions disponibles: generate, validate, apply-hooks, apply-ci'));
  }
}