// cli/questions.js — Questions interactives du générateur GEF
// Réf. Playbook §1 : Responsabilité Unique (SRP)

export const PROJECT_QUESTIONS = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Nom du dossier projet (utilisez "." pour initialiser dans le dossier courant) :',
    validate: (input) => (input ? true : 'Le nom du projet est requis.'),
  },
  {
    type: 'list',
    name: 'phase',
    message: 'Dans quelle phase se situe ce projet ?',
    choices: ['Prototype (R&D)', 'Développement contractuel / Production'],
  },
  {
    type: 'list',
    name: 'gitWorkflow',
    message: 'Quelle stratégie Git souhaitez-vous utiliser ?',
    choices: [
      'GitHub Flow (Branches + PRs obligatoires - Recommandé)',
      'Trunk-Based Development (Push direct sur main autorisé)',
    ],
  },
  {
    type: 'list',
    name: 'strictness',
    message: 'Niveau de sévérité du Clean Code (Hard Limits) ?',
    choices: [
      'Standard / Enterprise (30 lignes/fonction, complexité 10 - Recommandé)',
      'Startup / R&D (Souple : 50 lignes/fonction, complexité 15)',
      'Mission Critical (Strict : 15 lignes/fonction, complexité 5)',
    ],
  },
  {
    type: 'list',
    name: 'language',
    message: 'Langue de la documentation et des prompts IA ?',
    choices: ['Français', 'English'],
  },
  {
    type: 'confirm',
    name: 'includeCI',
    message: 'Voulez-vous inclure le template de CI/CD GEF (Validation du Playbook) ?',
    default: true,
  }
];
