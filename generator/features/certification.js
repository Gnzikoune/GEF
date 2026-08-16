// generator/features/certification.js — Certification System pour GEF
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Système de certification avec niveaux Bronze/Silver/Gold/Platinum

import chalk from 'chalk';
import { calculateGEFScore, calculateDORAScore } from './certification/score-calculator.js';
import { determineCertificationLevel } from './certification/level-determiner.js';
import { generateBadge, generatePublicReport } from './certification/badge-generator.js';

/**
 * Fonction principale pour la commande certify
 */
export async function certify(action = 'check', options = {}) {
  console.log(chalk.bold.cyan('🏆 GEF Certification System\n'));
  
  switch (action) {
    case 'check':
      const gefScore = calculateGEFScore();
      const doraScore = calculateDORAScore();
      const level = determineCertificationLevel(gefScore, doraScore);
      
      if (level) {
        console.log(chalk.green.bold(`\n🎉 Certification possible : ${level}`));
      } else {
        console.log(chalk.red.bold('\n❌ Certification non atteinte'));
      }
      break;
      
    case 'generate':
      const gefScoreGen = calculateGEFScore();
      const doraScoreGen = calculateDORAScore();
      const levelGen = determineCertificationLevel(gefScoreGen, doraScoreGen);
      
      if (levelGen) {
        generateBadge(levelGen);
        generatePublicReport(levelGen, gefScoreGen, doraScoreGen);
      } else {
        console.log(chalk.red('❌ Certification non atteinte. Améliorez votre score GEF et DORA.'));
      }
      break;
      
    default:
      console.log(chalk.red(`❌ Action inconnue: ${action}`));
      console.log(chalk.dim('Actions disponibles: check, generate'));
  }
}