// generator/features/smart/rule-explainer.js — Explication des règles GEF
// Réf. Playbook §1 : SRP, §2 : Clean Code Limits
// Sous-module pour l'explication des règles GEF

import fs from 'fs';
import path from 'path';

/**
 * Explique une règle GEF spécifique
 * @param {string} ruleName - Nom de la règle à expliquer
 * @returns {object} Explication de la règle
 */
export function explainRule(ruleName) {
  const explanation = {
    rule: ruleName,
    description: '',
    reference: '',
    examples: { compliant: '', nonCompliant: '' },
    why: ''
  };

  // Recherche de la règle dans ENGINEERING_PLAYBOOK.md
  const playbookPath = path.join(process.cwd(), 'ENGINEERING_PLAYBOOK.md');

  if (!fs.existsSync(playbookPath)) {
    explanation.error = "ENGINEERING_PLAYBOOK.md non trouvé. Impossible d'expliquer la règle en mode offline.";
    return explanation;
  }

  // Analyse basique du Playbook pour extraire l'information
  try {
    const playbookContent = fs.readFileSync(playbookPath, 'utf8');

    // Recherche de mentions de la règle
    const ruleMatches = playbookContent.match(new RegExp(ruleName, 'gi'));

    if (ruleMatches && ruleMatches.length > 0) {
      explanation.description = `Règle trouvée ${ruleMatches.length} fois dans le Playbook.`;
      explanation.reference = 'Voir ENGINEERING_PLAYBOOK.md pour détails complets';
      explanation.why = 'Cette règle assure la qualité et la maintenabilité du code selon les standards Clean Code.';
    } else {
      explanation.description = `Règle "${ruleName}" non trouvée explicitement dans le Playbook.`;
      explanation.reference = 'Vérifiez l\'orthographe ou consultez ENGINEERING_PLAYBOOK.md';
    }
  } catch (error) {
    explanation.error = `Erreur de lecture du Playbook: ${error.message}`;
  }

  return explanation;
}

/**
 * Recherche une règle par mot-clé
 * @param {string} keyword - Mot-clé pour la recherche
 * @returns {Array} Règles correspondantes
 */
export function searchRule(keyword) {
  const playbookPath = path.join(process.cwd(), 'ENGINEERING_PLAYBOOK.md');

  if (!fs.existsSync(playbookPath)) {
    return [];
  }

  try {
    const playbookContent = fs.readFileSync(playbookPath, 'utf8');
    const matches = playbookContent.match(new RegExp(keyword, 'gi'));

    if (matches) {
      return matches.map((match, index) => ({
        match,
        index,
        context: `Occurrence #${index + 1}`
      }));
    }

    return [];
  } catch {
    return [];
  }
}
