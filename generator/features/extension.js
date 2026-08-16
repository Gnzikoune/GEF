// generator/features/extension.js — Extension System pour GEF
// Réf. Issue #89, specs/spec-extension-system.md
// Objectif : Système d'extensions pour règles de gouvernance spécifiques

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
 * Marketplace GitHub registry pour les extensions GEF
 */
const MARKETPLACE_REGISTRY = {
  healthcare: {
    name: 'gef-extension-healthcare',
    description: 'Extension Healthcare avec règles HIPAA',
    version: '1.0.0',
    category: 'industry',
    rules: {
      hard_limits: {
        max_function_lines: 25,
        max_params: 3,
        max_complexity: 8
      },
      security: {
        enforce_hipaa: true,
        require_patient_data_encryption: true,
        require_audit_log: true
      },
      git: {
        require_hipaa_compliance: true
      }
    }
  },
  finance: {
    name: 'gef-extension-finance',
    description: 'Extension Finance avec règles PCI-DSS',
    version: '1.0.0',
    category: 'industry',
    rules: {
      hard_limits: {
        max_function_lines: 30,
        max_params: 4,
        max_complexity: 10
      },
      security: {
        enforce_pci_dss: true,
        require_encryption_at_rest: true,
        require_encryption_in_transit: true
      },
      git: {
        require_audit_trail: true,
        require_change_approval: true
      }
    }
  },
  security: {
    name: 'gef-extension-security',
    description: 'Extension Security avec OWASP étendu',
    version: '1.0.0',
    category: 'security',
    rules: {
      hard_limits: {
        max_function_lines: 30,
        max_params: 4,
        max_complexity: 10
      },
      security: {
        enforce_owasp: true,
        semgrep_enabled: true,
        secret_detection: true,
        require_sast: true
      },
      git: {
        require_security_review: true
      }
    }
  }
};

/**
 * Installe une extension
 */
export async function installExtension(extensionName) {
  console.log(chalk.bold.cyan('🔌 GEF Extension System\n'));
  
  const extensionKey = extensionName.toLowerCase();
  
  if (!MARKETPLACE_REGISTRY[extensionKey]) {
    error(`Extension "${extensionName}" non trouvée dans le marketplace.`);
    console.log(chalk.dim('Extensions disponibles: ' + Object.keys(MARKETPLACE_REGISTRY).join(', ')));
    return false;
  }
  
  const extension = MARKETPLACE_REGISTRY[extensionKey];
  
  console.log(chalk.cyan(`📦 Installation de l'extension : ${extension.name}`));
  console.log(chalk.dim(`Description : ${extension.description}`));
  console.log(chalk.dim(`Version : ${extension.version}`));
  
  // Lire compliance.yml existant
  const compliancePath = path.join(ROOT, 'compliance.yml');
  let existingConfig = {};
  
  if (fs.existsSync(compliancePath)) {
    try {
      const content = fs.readFileSync(compliancePath, 'utf8');
      existingConfig = yaml.load(content);
    } catch (err) {
      error(`Erreur lors de la lecture de compliance.yml : ${err.message}`);
      return false;
    }
  } else {
    warning('compliance.yml non trouvé. Génération d\'un fichier de base...');
    existingConfig = {
      version: '1.0.0',
      gef: {
        strictness: 'Standard',
        hard_limits: {},
        security: {},
        git: {},
        testing: {}
      },
      dora: {
        targets: {},
        benchmarks: {}
      },
      extensions: {
        enabled: []
      }
    };
  }
  
  // Merge les règles de l'extension
  if (!existingConfig.gef) {
    existingConfig.gef = {};
  }
  
  if (extension.rules.hard_limits) {
    existingConfig.gef.hard_limits = {
      ...existingConfig.gef.hard_limits,
      ...extension.rules.hard_limits
    };
  }
  
  if (extension.rules.security) {
    existingConfig.gef.security = {
      ...existingConfig.gef.security,
      ...extension.rules.security
    };
  }
  
  if (extension.rules.git) {
    existingConfig.gef.git = {
      ...existingConfig.gef.git,
      ...extension.rules.git
    };
  }
  
  // Ajouter l'extension à la liste des extensions activées
  if (!existingConfig.extensions) {
    existingConfig.extensions = { enabled: [] };
  }
  
  if (!existingConfig.extensions.enabled.includes(extensionKey)) {
    existingConfig.extensions.enabled.push(extensionKey);
  }
  
  // Écrire le fichier compliance.yml mis à jour
  try {
    const yamlContent = yaml.dump(existingConfig);
    fs.writeFileSync(compliancePath, yamlContent, 'utf8');
    success(`Extension "${extension.name}" installée avec succès.`);
    info(`compliance.yml mis à jour avec les règles de l'extension.`);
    return true;
  } catch (err) {
    error(`Erreur lors de l'écriture de compliance.yml : ${err.message}`);
    return false;
  }
}

/**
 * Liste les extensions
 */
export async function listExtensions() {
  console.log(chalk.bold.cyan('🔌 GEF Extension System\n'));
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  let installedExtensions = [];
  
  if (fs.existsSync(compliancePath)) {
    try {
      const content = fs.readFileSync(compliancePath, 'utf8');
      const config = yaml.load(content);
      installedExtensions = config.extensions?.enabled || [];
    } catch (err) {
      error(`Erreur lors de la lecture de compliance.yml : ${err.message}`);
    }
  }
  
  console.log(chalk.bold.cyan('Extensions Installées :'));
  if (installedExtensions.length === 0) {
    console.log(chalk.dim('Aucune extension installée.'));
  } else {
    for (const extKey of installedExtensions) {
      const ext = MARKETPLACE_REGISTRY[extKey];
      if (ext) {
        console.log(chalk.green(`  ✅ ${ext.name} (${ext.version})`));
        console.log(chalk.dim(`     ${ext.description}`));
      }
    }
  }
  
  console.log(chalk.bold.cyan('\nExtensions Disponibles :'));
  for (const [key, ext] of Object.entries(MARKETPLACE_REGISTRY)) {
    const isInstalled = installedExtensions.includes(key);
    const status = isInstalled ? chalk.green('✅ Installé') : chalk.dim('○ Disponible');
    console.log(`  ${status} ${ext.name} (${ext.version})`);
    console.log(chalk.dim(`     ${ext.description}`));
  }
  
  return { installed: installedExtensions, available: Object.keys(MARKETPLACE_REGISTRY) };
}

/**
 * Désinstalle une extension
 */
export async function removeExtension(extensionName) {
  console.log(chalk.bold.cyan('🔌 GEF Extension System\n'));
  
  const extensionKey = extensionName.toLowerCase();
  
  if (!MARKETPLACE_REGISTRY[extensionKey]) {
    error(`Extension "${extensionName}" non trouvée dans le marketplace.`);
    return false;
  }
  
  const compliancePath = path.join(ROOT, 'compliance.yml');
  
  if (!fs.existsSync(compliancePath)) {
    error('compliance.yml non trouvé. Aucune extension à désinstaller.');
    return false;
  }
  
  try {
    const content = fs.readFileSync(compliancePath, 'utf8');
    const config = yaml.load(content);
    
    if (!config.extensions || !config.extensions.enabled) {
      warning('Aucune extension installée.');
      return false;
    }
    
    const extensionIndex = config.extensions.enabled.indexOf(extensionKey);
    
    if (extensionIndex === -1) {
      warning(`Extension "${extensionName}" n'est pas installée.`);
      return false;
    }
    
    // Retirer l'extension de la liste
    config.extensions.enabled.splice(extensionIndex, 1);
    
    // Pourrait ici nettoyer les règles spécifiques de l'extension
    // (implémentation simplifiée pour MVP)
    
    // Écrire le fichier compliance.yml mis à jour
    const yamlContent = yaml.dump(config);
    fs.writeFileSync(compliancePath, yamlContent, 'utf8');
    
    success(`Extension "${extensionName}" désinstallée avec succès.`);
    return true;
  } catch (err) {
    error(`Erreur lors de la désinstallation : ${err.message}`);
    return false;
  }
}

/**
 * Fonction principale pour la commande extension
 */
export async function extension(action, name) {
  console.log(chalk.bold.cyan('🔌 GEF Extension System\n'));
  
  switch (action) {
    case 'install':
      if (!name) {
        error('Nom de l\'extension requis. Usage: npx create-gef extension install <name>');
        return;
      }
      await installExtension(name);
      break;
      
    case 'list':
      await listExtensions();
      break;
      
    case 'remove':
      if (!name) {
        error('Nom de l\'extension requis. Usage: npx create-gef extension remove <name>');
        return;
      }
      await removeExtension(name);
      break;
      
    default:
      error(`Action inconnue: ${action}`);
      console.log(chalk.dim('Actions disponibles: install, list, remove'));
  }
}