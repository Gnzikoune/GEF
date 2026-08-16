// generator/features/smart/context-analyzer.js — Analyse contexte projet
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour l'analyse du contexte du projet

import fs from 'fs';
import path from 'path';

/**
 * Analyse la présence des fichiers GEF obligatoires
 * @returns {object} État des fichiers GEF
 */
export function analyzeGEFFiles() {
  const files = {
    'ENGINEERING_PLAYBOOK.md': existsFile('ENGINEERING_PLAYBOOK.md'),
    'PROJECT_CONFIG.md': existsFile('PROJECT_CONFIG.md'),
    'CONTEXT.md': existsFile('CONTEXT.md'),
    'docs/research/RESEARCH_LOG.md': existsFile('docs/research/RESEARCH_LOG.md'),
    '.cursorrules': existsFile('.cursorrules'),
    '.windsurfrules': existsFile('.windsurfrules'),
    'compliance.yml': existsFile('compliance.yml')
  };

  const present = Object.values(files).filter(Boolean).length;
  const total = Object.keys(files).length;

  return { files, present, total };
}

/**
 * Vérifie si un fichier existe dans le répertoire courant
 * @param {string} filePath - Chemin du fichier
 * @returns {boolean} True si le fichier existe
 */
function existsFile(filePath) {
  try {
    return fs.existsSync(path.join(process.cwd(), filePath));
  } catch {
    return false;
  }
}

/**
 * Analyse la configuration Git du projet
 * @returns {object} État de la configuration Git
 */
export function analyzeGitConfig() {
  const git = {
    exists: existsFile('.git'),
    hooks: {
      'pre-commit': existsFile('.git/hooks/pre-commit'),
      'pre-push': existsFile('.git/hooks/pre-push'),
      'commit-msg': existsFile('.git/hooks/commit-msg')
    }
  };

  return git;
}

/**
 * Analyse la configuration CI/CD du projet
 * @returns {object} État de la configuration CI/CD
 */
export function analyzeCIConfig() {
  const cicd = {
    workflows: existsFile('.github/workflows'),
    workflowCount: 0
  };

  if (cicd.workflows) {
    try {
      const workflowsPath = path.join(process.cwd(), '.github/workflows');
      const files = fs.readdirSync(workflowsPath);
      cicd.workflowCount = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml')).length;
    } catch {
      // Ignore les erreurs de lecture
    }
  }

  return cicd;
}

/**
 * Calcule le score de conformité basé sur l'analyse
 * @param {object} context - Contexte analysé
 * @returns {number} Score de 0 à 100
 */
export function calculateConformityScore(context) {
  let score = 0;

  // Fichiers GEF (40 points)
  const fileScore = (context.files.present / context.files.total) * 40;
  score += fileScore;

  // Configuration Git (30 points)
  if (context.git.exists) score += 10;
  const gitHooks = Object.values(context.git.hooks).filter(Boolean).length;
  score += (gitHooks / 3) * 20;

  // Configuration CI/CD (30 points)
  if (context.cicd.workflows) score += 15;
  if (context.cicd.workflowCount > 0) score += 15;

  return Math.round(score);
}

/**
 * Détermine le statut de conformité selon le score
 * @param {number} score - Score de conformité
 * @returns {string} Statut (excellent/good/acceptable/poor)
 */
export function getConformityStatus(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'acceptable';
  return 'poor';
}
