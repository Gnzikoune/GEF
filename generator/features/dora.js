// generator/features/dora.js — DORA Metrics Enhancement
// Change Failure Rate, Time to Restore, Benchmarks, Corrélation

import fs from 'fs';
import path from 'path';

/**
 * Benchmarks DORA par niveau
 */
const DORA_BENCHMARKS = {
  deploymentFrequency: {
    elite: { value: 'par jour', label: 'Elite' },
    high: { value: 'par semaine', label: 'High' },
    medium: { value: 'par mois', label: 'Medium' },
    low: { value: '< 6 mois', label: 'Low' }
  },
  leadTime: {
    elite: { value: '< 1h', label: 'Elite' },
    high: { value: '< 1j', label: 'High' },
    medium: { value: '< 1 sem', label: 'Medium' },
    low: { value: '> 1 sem', label: 'Low' }
  },
  changeFailureRate: {
    elite: { value: '< 15%', label: 'Elite' },
    high: { value: '15-20%', label: 'High' },
    medium: { value: '21-30%', label: 'Medium' },
    low: { value: '> 30%', label: 'Low' }
  },
  timeToRestore: {
    elite: { value: '< 1h', label: 'Elite' },
    high: { value: '1-24h', label: 'High' },
    medium: { value: '1j-1sem', label: 'Medium' },
    low: { value: '> 1 sem', label: 'Low' }
  }
};

/**
 * Calcule le Change Failure Rate (CFR)
 * @param {Object} gitHistory - Historique Git complet
 * @returns {number} CFR en pourcentage
 */
export function calculateChangeFailureRate(gitHistory) {
  if (!gitHistory || !gitHistory.commits) {
    return 0;
  }

  const commits = gitHistory.commits;
  
  // Compter tous les déploiements (commits avec "deploy")
  const totalDeploys = commits.filter(c => 
    c.message.toLowerCase().includes('deploy')
  ).length;
  
  if (totalDeploys === 0) {
    return 0;
  }

  // Compter les déploiements en échec (rollback, hotfix, revert après deploy)
  const failedDeploys = commits.filter(c => {
    const msg = c.message.toLowerCase();
    return msg.includes('rollback') || 
           msg.includes('hotfix') || 
           msg.includes('revert');
  }).length;

  return (failedDeploys / totalDeploys) * 100;
}

/**
 * Vérifie si un commit est dans les 24h précédentes
 */
function isWithin24Hours(date, gitHistory) {
  const deployDate = new Date(date);
  const recentDate = new Date();
  recentDate.setHours(recentDate.getHours() - 24);
  return deployDate >= recentDate;
}

/**
 * Calcule le Time to Restore (MTTR) depuis RESEARCH_LOG.md
 * @param {string} projectPath - Chemin du projet
 * @returns {number} MTTR en heures
 */
export function calculateTimeToRestore(projectPath) {
  const researchLogPath = path.join(projectPath, 'docs', 'research', 'RESEARCH_LOG.md');
  
  if (!fs.existsSync(researchLogPath)) {
    return 0;
  }

  const content = fs.readFileSync(researchLogPath, 'utf8');
  const timeMatches = content.match(/Temps de résolution\s*:\s*(\d+)\s*(heures?|jours?|h|d)/gi);
  
  if (!timeMatches || timeMatches.length === 0) {
    return 0;
  }

  let totalHours = 0;
  timeMatches.forEach(match => {
    const parts = match.match(/(\d+)\s*(heures?|jours?|h|d)/i);
    if (parts) {
      const value = parseInt(parts[1]);
      const unit = parts[2].toLowerCase();
      if (unit.startsWith('h')) {
        totalHours += value;
      } else if (unit.startsWith('j') || unit.startsWith('d')) {
        totalHours += value * 24;
      }
    }
  });

  return totalHours / timeMatches.length;
}

/**
 * Obtient le niveau DORA pour une métrique
 * @param {string} metricName - Nom de la métrique
 * @param {number} value - Valeur de la métrique
 * @returns {Object} Niveau DORA
 */
export function getDoraLevel(metricName, value) {
  const benchmarks = DORA_BENCHMARKS[metricName];
  if (!benchmarks) {
    return { level: 'unknown', label: 'Inconnu' };
  }

  if (metricName === 'changeFailureRate') {
    if (value < 15) return benchmarks.elite;
    if (value <= 20) return benchmarks.high;
    if (value <= 30) return benchmarks.medium;
    return benchmarks.low;
  }

  if (metricName === 'timeToRestore') {
    if (value < 1) return benchmarks.elite;
    if (value <= 24) return benchmarks.high;
    if (value <= 168) return benchmarks.medium;
    return benchmarks.low;
  }

  return { level: 'unknown', label: 'Inconnu' };
}

/**
 * Calcule la corrélation de Pearson entre deux tableaux
 * @param {Array} x - Premier tableau
 * @param {Array} y - Deuxième tableau
 * @returns {number} Coefficient de corrélation
 */
export function calculatePearsonCorrelation(x, y) {
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

/**
 * Calcule la corrélation entre score GEF et métriques DORA
 * @param {number} gefScore - Score de compliance GEF
 * @param {Object} doraMetrics - Métriques DORA
 * @returns {Object} Corrélations calculées
 */
export function calculateCorrelation(gefScore, doraMetrics) {
  return {
    deploymentFrequency: calculatePearsonCorrelation([gefScore], [doraMetrics.deploymentFrequency || 0]),
    leadTime: calculatePearsonCorrelation([gefScore], [doraMetrics.leadTime || 0]),
    changeFailureRate: calculatePearsonCorrelation([gefScore], [doraMetrics.changeFailureRate || 0]),
    timeToRestore: calculatePearsonCorrelation([gefScore], [doraMetrics.timeToRestore || 0])
  };
}

/**
 * Obtient tous les benchmarks DORA
 * @returns {Object} Benchmarks DORA
 */
export function getDoraBenchmarks() {
  return DORA_BENCHMARKS;
}