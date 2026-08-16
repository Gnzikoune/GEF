// generator/features/smart/chat.js — Mode conversationnel Smart CLI
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour le mode conversationnel et traitement des requêtes

import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { explainRule as explainRuleModule } from './rule-explainer.js';
import { suggestImprovements as suggestImprovementsModule, prioritizeSuggestions } from './suggester.js';
import { deepAudit as deepAuditModule } from './auditor.js';
import { analyzeGEFFiles, analyzeGitConfig, analyzeCIConfig, calculateConformityScore, getConformityStatus } from './context-analyzer.js';

/**
 * Mode conversationnel pour assistant interactif
 * @param {boolean} testMode - Mode test pour éviter l'interaction
 * @returns {object} Résultat de la conversation
 */
export async function chatAssistant(testMode = false) {
  if (testMode) {
    return {
      history: [
        { query: 'test query', response: 'Test response in offline mode' }
      ]
    };
  }

  console.log(chalk.cyan('💬 Mode Assistant Conversationnel'));
  console.log(chalk.dim('Tapez "exit" pour quitter'));
  console.log('');

  const conversationHistory = [];

  while (true) {
    const { query } = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: chalk.blue('🤖 Vous:'),
        validate: (input) => input.trim().length > 0 || 'Veuillez entrer une question'
      }
    ]);

    if (query.toLowerCase() === 'exit') {
      console.log(chalk.dim('👋 Au revoir !'));
      break;
    }

    const response = await processUserQuery(query, conversationHistory);
    conversationHistory.push({ query, response });

    console.log('');
    console.log(chalk.green('🤖 GEF:'), response);
    console.log('');
  }

  return { history: conversationHistory };
}

/**
 * Traite une requête utilisateur en mode conversationnel
 * @param {string} query - Requête utilisateur
 * @param {Array} history - Historique de conversation
 * @returns {string} Réponse générée
 */
export async function processUserQuery(query, history = []) {
  const intention = detectIntention(query);

  switch (intention) {
    case 'explain':
      const ruleMatch = query.match(/règle\s+(?:de\s+)?(.+)/i);
      if (ruleMatch) {
        const explanation = explainRuleModule(ruleMatch[1]);
        return explanation.description || explanation.error || 'Règle non trouvée';
      }
      return "Je peux expliquer les règles GEF. Quelle règle souhaitez-vous comprendre ?";
    case 'suggest':
      const suggestions = suggestImprovementsModule();
      const prioritized = prioritizeSuggestions(suggestions);
      return prioritized.length > 0 
        ? `${prioritized.length} suggestions trouvées. Utilisez 'npx create-gef smart suggest' pour détails.`
        : "Aucune suggestion d'amélioration détectée.";
    case 'audit':
      const audit = await deepAuditModule();
      return `Score GEF: ${audit.gefCompliance.score}%, Score DORA: ${audit.doraMetrics.score}%`;
    case 'analyze':
      const context = {
        files: analyzeGEFFiles(),
        git: analyzeGitConfig(),
        cicd: analyzeCIConfig()
      };
      const score = calculateConformityScore(context);
      return `Votre projet a un score de conformité de ${score}%. ${getConformityAdvice(score)}`;
    default:
      return generateGenericResponse(query);
  }
}

/**
 * Détecte l'intention de la requête utilisateur
 * @param {string} query - Requête utilisateur
 * @returns {string} Intention détectée
 */
function detectIntention(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('explique') || lowerQuery.includes('règle')) {
    return 'explain';
  }
  if (lowerQuery.includes('suggère') || lowerQuery.includes('améliore') || lowerQuery.includes('problème')) {
    return 'suggest';
  }
  if (lowerQuery.includes('audit') || lowerQuery.includes('analyse') || lowerQuery.includes('approfondi')) {
    return 'audit';
  }
  if (lowerQuery.includes('conformité') || lowerQuery.includes('score') || lowerQuery.includes('état')) {
    return 'analyze';
  }

  return 'generic';
}

/**
 * Génère une réponse générique basée sur ENGINEERING_PLAYBOOK.md
 * @param {string} query - Requête utilisateur
 * @returns {string} Réponse générée
 */
function generateGenericResponse(query) {
  const playbookPath = path.join(process.cwd(), 'ENGINEERING_PLAYBOOK.md');

  if (!fs.existsSync(playbookPath)) {
    return "Je fonctionne en mode offline. Pour des réponses détaillées, assurez-vous que ENGINEERING_PLAYBOOK.md est présent dans votre projet.";
  }

  return `Je peux vous aider avec : analyse du contexte, explication des règles, suggestions d'amélioration, ou audit approfondi. Essayez "explique la règle X" ou "suggère des améliorations".`;
}

/**
 * Fournit des conseils basés sur le score de conformité
 * @param {number} score - Score de conformité
 * @returns {string} Conseil
 */
function getConformityAdvice(score) {
  if (score >= 80) {
    return "Excellent travail ! Votre projet est bien conforme aux standards GEF.";
  }
  if (score >= 60) {
    return "Bon début. Quelques améliorations possibles pour atteindre l'excellence.";
  }
  if (score >= 40) {
    return "Acceptable mais des améliorations sont nécessaires. Utilisez 'npx create-gef smart suggest' pour des conseils.";
  }
  return "Conformité faible. Je recommande d'exécuter 'npx create-gef smart audit' pour identifier les priorités.";
}
