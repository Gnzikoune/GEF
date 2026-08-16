// generator/features/smart/suggester.js — Suggestions d'améliorations
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour les suggestions d'améliorations

import fs from 'fs';
import path from 'path';

/**
 * Analyse les violations de code et génère des suggestions
 * @returns {object} Suggestions par priorité
 */
export function suggestImprovements() {
  const suggestions = {
    timestamp: new Date().toISOString(),
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  // Analyse des fichiers du projet
  // (Implémentation simplifiée - à compléter avec analyse de code réelle)

  // Exemple de suggestion critique
  if (!existsFile('ENGINEERING_PLAYBOOK.md')) {
    suggestions.critical.push({
      type: 'missing_file',
      file: 'ENGINEERING_PLAYBOOK.md',
      message: 'Fichier ENGINEERING_PLAYBOOK.md manquant',
      fix: 'Exécutez npx create-gef pour initialiser le projet'
    });
  }

  // Exemple de suggestion haute priorité
  if (!existsFile('.git/hooks/pre-commit')) {
    suggestions.high.push({
      type: 'missing_hook',
      hook: 'pre-commit',
      message: 'Hook pre-commit manquant',
      fix: 'Exécutez npx create-gef update pour installer les hooks'
    });
  }

  return suggestions;
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
 * Priorise les suggestions par impact
 * @param {object} suggestions - Suggestions à prioriser
 * @returns {Array} Suggestions triées par priorité
 */
export function prioritizeSuggestions(suggestions) {
  const priorityOrder = ['critical', 'high', 'medium', 'low'];
  const allSuggestions = [];

  priorityOrder.forEach(priority => {
    suggestions[priority].forEach(item => {
      allSuggestions.push({ ...item, priority });
    });
  });

  return allSuggestions;
}

/**
 * Génère des correctifs automatiques pour les suggestions
 * @param {Array} selectedSuggestions - Suggestions sélectionnées
 * @returns {Array} Correctifs générés
 */
export function generateFixSuggestions(selectedSuggestions) {
  const fixes = [];

  selectedSuggestions.forEach(suggestion => {
    if (suggestion.fix) {
      fixes.push({
        original: suggestion,
        fix: suggestion.fix,
        autoApply: suggestion.type === 'missing_file' || suggestion.type === 'missing_hook'
      });
    }
  });

  return fixes;
}
