// generator/features/certification/level-determiner.js — Détermination du niveau de certification
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Déterminer le niveau de certification Bronze/Silver/Gold/Platinum

import chalk from 'chalk';

/**
 * Niveaux de certification avec critères
 */
const CERTIFICATION_LEVELS = {
  Bronze: {
    gef_threshold: 60,
    dora_threshold: 40,
    color: '#CD7F32',
    description: 'Conformité de base GEF avec métriques DORA minimales'
  },
  Silver: {
    gef_threshold: 70,
    dora_threshold: 60,
    color: '#C0C0C0',
    description: 'Conformité GEF solide avec métriques DORA acceptables'
  },
  Gold: {
    gef_threshold: 85,
    dora_threshold: 80,
    color: '#FFD700',
    description: 'Excellence GEF avec métriques DORA élevées'
  },
  Platinum: {
    gef_threshold: 95,
    dora_threshold: 95,
    color: '#E5E4E2',
    description: 'Excellence GEF parfaite avec métriques DORA elite'
  }
};

/**
 * Détermine le niveau de certification
 */
export function determineCertificationLevel(gefScore, doraScore) {
  console.log(chalk.cyan.bold('\n🏆 Détermination du niveau de certification...'));
  
  let level = null;
  
  // Vérifier du plus haut au plus bas
  for (const [name, criteria] of Object.entries(CERTIFICATION_LEVELS)) {
    if (gefScore >= criteria.gef_threshold && doraScore >= criteria.dora_threshold) {
      level = name;
    }
  }
  
  if (!level) {
    console.log(chalk.yellow('⚠️  Aucun niveau de certification atteint. Score minimum requis : Bronze (GEF ≥ 60%, DORA ≥ 40%)'));
    return null;
  }
  
  const criteria = CERTIFICATION_LEVELS[level];
  console.log(chalk.green(`✅ Niveau certifié : ${level} (GEF: ${gefScore}% ≥ ${criteria.gef_threshold}%, DORA: ${doraScore}% ≥ ${criteria.dora_threshold}%)`));
  console.log(chalk.dim(`Description : ${criteria.description}`));
  
  return level;
}

/**
 * Retourne les critères pour un niveau donné
 */
export function getLevelCriteria(level) {
  return CERTIFICATION_LEVELS[level];
}

/**
 * Retourne tous les niveaux disponibles
 */
export function getAllLevels() {
  return Object.keys(CERTIFICATION_LEVELS);
}