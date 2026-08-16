// generator/features/smart/auditor.js — Audit en profondeur
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour l'audit en profondeur du projet

import { analyzeGEFFiles, analyzeGitConfig, analyzeCIConfig, calculateConformityScore, getConformityStatus } from './context-analyzer.js';

/**
 * Effectue un audit en profondeur du projet
 * @returns {object} Rapport d'audit
 */
export async function deepAudit() {
  const audit = {
    timestamp: new Date().toISOString(),
    gefCompliance: {},
    doraMetrics: {},
    correlation: {},
    patterns: [],
    improvementPlan: []
  };

  // Analyse de la conformité GEF
  const context = {
    files: analyzeGEFFiles(),
    git: analyzeGitConfig(),
    cicd: analyzeCIConfig()
  };

  audit.gefCompliance = {
    score: calculateConformityScore(context),
    status: getConformityStatus(calculateConformityScore(context)),
    details: {
      timestamp: new Date().toISOString(),
      projectPath: process.cwd(),
      ...context
    }
  };

  // Analyse des métriques DORA (si disponibles)
  try {
    const doraModule = await import('../dora.js');
    const doraScore = doraModule.calculateDoraScore ? doraModule.calculateDoraScore() : 50;
    audit.doraMetrics = {
      score: doraScore,
      status: doraScore >= 80 ? 'elite' : doraScore >= 60 ? 'high' : doraScore >= 40 ? 'medium' : 'low'
    };
  } catch {
    audit.doraMetrics = {
      score: 0,
      status: 'unavailable',
      error: 'Module DORA non disponible'
    };
  }

  // Corrélation GEF/DORA
  audit.correlation = {
    gefScore: audit.gefCompliance.score,
    doraScore: audit.doraMetrics.score,
    correlation: calculateCorrelationScore(audit.gefCompliance.score, audit.doraMetrics.score)
  };

  // Identification des patterns
  audit.patterns = identifyRecurringPatterns(context);

  // Plan d'amélioration
  audit.improvementPlan = generateImprovementPlan(audit);

  return audit;
}

/**
 * Calcule un score de corrélation simplifié entre GEF et DORA
 * @param {number} gefScore - Score GEF
 * @param {number} doraScore - Score DORA
 * @returns {string} Niveau de corrélation
 */
function calculateCorrelationScore(gefScore, doraScore) {
  const diff = Math.abs(gefScore - doraScore);
  if (diff < 10) return 'strong';
  if (diff < 20) return 'moderate';
  return 'weak';
}

/**
 * Identifie les patterns récurrents dans le projet
 * @param {object} context - Contexte du projet
 * @returns {Array} Patterns identifiés
 */
function identifyRecurringPatterns(context) {
  const patterns = [];

  // Pattern : Fichiers GEF manquants
  if (context.files.present < context.files.total) {
    patterns.push({
      type: 'missing_gef_files',
      frequency: 'always',
      impact: 'high',
      description: 'Fichiers GEF systématiquement manquants'
    });
  }

  // Pattern : Hooks Git incomplets
  const gitHooksPresent = Object.values(context.git.hooks).filter(Boolean).length;
  if (gitHooksPresent < 3) {
    patterns.push({
      type: 'incomplete_git_hooks',
      frequency: 'always',
      impact: 'medium',
      description: 'Hooks Git incomplets'
    });
  }

  return patterns;
}

/**
 * Génère un plan d'amélioration priorisé
 * @param {object} audit - Résultats de l'audit
 * @returns {Array} Plan d'amélioration
 */
function generateImprovementPlan(audit) {
  const plan = [];

  // Priorité 1 : Fichiers GEF manquants
  if (audit.gefCompliance.details.files.present < audit.gefCompliance.details.files.total) {
    plan.push({
      priority: 1,
      action: 'Installer les fichiers GEF manquants',
      command: 'npx create-gef',
      estimatedEffort: '5 minutes',
      impact: 'high'
    });
  }

  // Priorité 2 : Hooks Git
  const gitHooksPresent = Object.values(audit.gefCompliance.details.git.hooks).filter(Boolean).length;
  if (gitHooksPresent < 3) {
    plan.push({
      priority: 2,
      action: 'Installer les hooks Git manquants',
      command: 'npx create-gef update',
      estimatedEffort: '2 minutes',
      impact: 'medium'
    });
  }

  // Priorité 3 : CI/CD
  if (!audit.gefCompliance.details.cicd.workflows) {
    plan.push({
      priority: 3,
      action: 'Configurer les workflows CI/CD',
      command: 'npx create-gef',
      estimatedEffort: '10 minutes',
      impact: 'medium'
    });
  }

  return plan;
}
