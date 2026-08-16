// generator/features/smart/display.js — Fonctions d'affichage Smart CLI
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour les fonctions d'affichage et reporting

import chalk from 'chalk';

/**
 * Affiche le rapport d'analyse du contexte
 * @param {object} context - Contexte analysé
 */
export function displayContextReport(context) {
  console.log('');
  console.log(chalk.bold('📊 Rapport d\'Analyse du Contexte'));
  console.log('');

  // Score global
  const scoreColor = context.score >= 80 ? 'green' : context.score >= 60 ? 'yellow' : 'red';
  console.log(`${chalk.bold('Score de Conformité :')} ${chalk[scoreColor](context.score + '%')} (${context.status})`);
  console.log('');

  // Fichiers GEF
  console.log(chalk.bold('📁 Fichiers GEF :'));
  Object.entries(context.files.files).forEach(([file, exists]) => {
    const icon = exists ? '✅' : '❌';
    const color = exists ? 'green' : 'red';
    console.log(`  ${icon} ${chalk[color](file)}`);
  });
  console.log(chalk.dim(`  ${context.files.present}/${context.files.total} fichiers présents`));
  console.log('');

  // Configuration Git
  console.log(chalk.bold('🔧 Configuration Git :'));
  console.log(`  ${context.git.exists ? '✅' : '❌'} .git ${context.git.exists ? 'existe' : 'manquant'}`);
  Object.entries(context.git.hooks).forEach(([hook, exists]) => {
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${hook}`);
  });
  console.log('');

  // Configuration CI/CD
  console.log(chalk.bold('🚀 Configuration CI/CD :'));
  console.log(`  ${context.cicd.workflows ? '✅' : '❌'} .github/workflows ${context.cicd.workflows ? 'existe' : 'manquant'}`);
  if (context.cicd.workflows) {
    console.log(chalk.dim(`  ${context.cicd.workflowCount} workflow(s) détecté(s)`));
  }
  console.log('');
}

/**
 * Affiche les suggestions d'amélioration
 * @param {object} suggestions - Suggestions à afficher
 */
export function displaySuggestions(suggestions) {
  console.log('');

  const categories = [
    { name: 'CRITIQUE', items: suggestions.critical, color: 'red' },
    { name: 'HAUTE', items: suggestions.high, color: 'yellow' },
    { name: 'MOYENNE', items: suggestions.medium, color: 'blue' },
    { name: 'FAIBLE', items: suggestions.low, color: 'dim' }
  ];

  categories.forEach(category => {
    if (category.items.length > 0) {
      console.log(chalk.bold[category.color](`⚠️  Priorité ${category.name} (${category.items.length})`));
      category.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.message}`);
        console.log(chalk.dim(`     Fix: ${item.fix}`));
      });
      console.log('');
    }
  });

  if (suggestions.critical.length === 0 && suggestions.high.length === 0) {
    console.log(chalk.green('✅ Aucune amélioration critique détectée !'));
  }
}

/**
 * Affiche le rapport d'audit
 * @param {object} audit - Résultats de l'audit
 */
export function displayAuditReport(audit) {
  console.log('');
  console.log(chalk.bold('🔬 Rapport d\'Audit en Profondeur'));
  console.log('');

  console.log(chalk.bold('📊 Conformité GEF:'));
  const gefColor = audit.gefCompliance.score >= 80 ? 'green' : audit.gefCompliance.score >= 60 ? 'yellow' : 'red';
  console.log(`  Score: ${chalk[gefColor](audit.gefCompliance.score + '%')} (${audit.gefCompliance.status})`);
  console.log('');

  console.log(chalk.bold('📈 Métriques DORA:'));
  if (audit.doraMetrics.status === 'unavailable') {
    console.log(chalk.dim('  Non disponibles (module DORA non trouvé)'));
  } else {
    const doraColor = audit.doraMetrics.status === 'elite' ? 'green' : audit.doraMetrics.status === 'high' ? 'yellow' : 'red';
    console.log(`  Score: ${chalk[doraColor](audit.doraMetrics.score + '%')} (${audit.doraMetrics.status})`);
  }
  console.log('');

  console.log(chalk.bold('🔗 Corrélation GEF/DORA:'));
  console.log(`  GEF: ${audit.correlation.gefScore}%, DORA: ${audit.correlation.doraScore}%`);
  console.log(`  Corrélation: ${audit.correlation.correlation}`);
  console.log('');

  if (audit.patterns.length > 0) {
    console.log(chalk.bold('🔄 Patterns Récurrents:'));
    audit.patterns.forEach(pattern => {
      console.log(`  • ${pattern.description} (${pattern.impact} impact)`);
    });
    console.log('');
  }

  if (audit.improvementPlan.length > 0) {
    console.log(chalk.bold('📋 Plan d\'Amélioration:'));
    audit.improvementPlan.forEach(item => {
      console.log(`  ${item.priority}. ${item.action}`);
      console.log(chalk.dim(`     Commande: ${item.command}`));
      console.log(chalk.dim(`     Effort: ${item.estimatedEffort}, Impact: ${item.impact}`));
    });
    console.log('');
  }
}
