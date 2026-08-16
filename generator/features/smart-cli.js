// generator/features/smart-cli.js — Smart CLI Module Principal
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Module principal pour le Smart CLI avec routing et intégration des sous-modules

import chalk from 'chalk';
import { analyzeGEFFiles, analyzeGitConfig, analyzeCIConfig, calculateConformityScore, getConformityStatus } from './smart/context-analyzer.js';
import { explainRule as explainRuleModule } from './smart/rule-explainer.js';
import { suggestImprovements as suggestImprovementsModule } from './smart/suggester.js';
import { deepAudit as deepAuditModule } from './smart/auditor.js';
import { displayContextReport, displaySuggestions, displayAuditReport } from './smart/display.js';
import { chatAssistant } from './smart/chat.js';

/**
 * Explique une règle GEF spécifique
 * @param {string} ruleName - Nom de la règle à expliquer
 * @param {boolean} jsonOutput - Retourner le résultat au format JSON
 * @returns {object|string} Explication de la règle
 */
async function explainRule(ruleName, jsonOutput = false) {
  console.log(chalk.cyan(`📖 Explication de la règle: ${ruleName}`));

  const explanation = explainRuleModule(ruleName);

  if (jsonOutput) {
    return explanation;
  }

  console.log('');
  console.log(chalk.bold('Description:'), explanation.description);
  console.log(chalk.dim('Référence:'), explanation.reference);
  console.log(chalk.dim('Pourquoi:'), explanation.why);
  console.log('');

  return explanation;
}

/**
 * Suggère des améliorations basées sur l'analyse du code
 * @param {boolean} jsonOutput - Retourner le résultat au format JSON
 * @returns {object|string} Suggestions d'amélioration
 */
async function suggestImprovements(jsonOutput = false) {
  console.log(chalk.cyan('💡 Analyse des améliorations possibles...'));

  const suggestions = suggestImprovementsModule();

  if (jsonOutput) {
    return suggestions;
  }

  displaySuggestions(suggestions);
  return suggestions;
}

/**
 * Effectue un audit en profondeur du projet
 * @param {boolean} jsonOutput - Retourner le résultat au format JSON
 * @returns {object|string} Rapport d'audit
 */
async function deepAudit(jsonOutput = false) {
  console.log(chalk.cyan('🔬 Audit en profondeur du projet...'));

  const audit = await deepAuditModule();

  if (jsonOutput) {
    return audit;
  }

  displayAuditReport(audit);
  return audit;
}

/**
 * Actions disponibles dans le Smart CLI
 */
const ACTIONS = ['analyze', 'chat', 'explain', 'suggest', 'audit'];

/**
 * État du mode verbose pour debugging
 */
let verboseMode = false;

/**
 * Active le mode verbose pour afficher les détails de debugging
 * @param {boolean} verbose - État du mode verbose
 */
export function setVerboseMode(verbose) {
  verboseMode = verbose;
}

/**
 * Log uniquement en mode verbose
 * @param {string} message - Message à afficher
 */
function verboseLog(message) {
  if (verboseMode) {
    console.log(chalk.dim(`[VERBOSE] ${message}`));
  }
}

/**
 * Point d'entrée principal du Smart CLI
 * Route vers les actions appropriées selon les arguments
 * @param {string} action - Action à exécuter (analyze, chat, explain, suggest, audit)
 * @param {object} options - Options supplémentaires
 * @param {string} options.target - Cible pour l'action (ex: règle pour explain)
 * @param {boolean} options.verbose - Mode verbose activé
 * @param {boolean} options.json - Sortie au format JSON
 * @param {boolean} options.testMode - Mode test pour éviter l'interaction
 */
export async function smart(action, options = {}) {
  const { target, verbose, json, testMode } = options;

  // Configuration du mode verbose
  if (verbose) {
    setVerboseMode(true);
    verboseLog(`Mode verbose activé pour action: ${action}`);
  }

  // Validation de l'action
  if (!ACTIONS.includes(action)) {
    const error = new Error(`Action inconnue: ${action}. Actions disponibles: ${ACTIONS.join(', ')}`);
    if (!json) {
      console.error(chalk.red(`❌ ${error.message}`));
    }
    throw error;
  }

  verboseLog(`Exécution de l'action: ${action}`);

  try {
    let result;

    switch (action) {
      case 'analyze':
        result = await analyzeProjectContext(json);
        break;
      case 'chat':
        result = await chatAssistant(testMode);
        break;
      case 'explain':
        if (!target) {
          const error = new Error('Action explain requiert une cible (--target <rule>)');
          if (!json) {
            console.error(chalk.red(`❌ ${error.message}`));
          }
          throw error;
        }
        result = await explainRule(target, json);
        break;
      case 'suggest':
        result = await suggestImprovements(json);
        break;
      case 'audit':
        result = await deepAudit(json);
        break;
      default:
        throw new Error(`Action non implémentée: ${action}`);
    }

    // Affichage du résultat
    if (json && result) {
      console.log(JSON.stringify(result, null, 2));
    }

    verboseLog(`Action ${action} terminée avec succès`);
    return result;
  } catch (error) {
    if (!json) {
      console.error(chalk.red(`❌ Erreur lors de l'exécution de ${action}:`));
      console.error(chalk.dim(error.message));
      if (verboseMode) {
        console.error(error.stack);
      }
    }
    throw error;
  }
}

/**
 * Analyse le contexte du projet et génère un rapport de conformité
 * @param {boolean} jsonOutput - Retourner le résultat au format JSON
 * @returns {object} Rapport d'analyse du contexte
 */
async function analyzeProjectContext(jsonOutput = false) {
  console.log(chalk.cyan('🔍 Analyse du contexte du projet...'));

  const context = {
    timestamp: new Date().toISOString(),
    projectPath: process.cwd(),
    files: analyzeGEFFiles(),
    git: analyzeGitConfig(),
    cicd: analyzeCIConfig(),
    score: 0,
    status: 'unknown'
  };

  // Calcul du score de conformité
  context.score = calculateConformityScore(context);
  context.status = getConformityStatus(context.score);

  if (jsonOutput) {
    return context;
  }

  displayContextReport(context);
  return context;
}


