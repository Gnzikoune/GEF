// cli/questions.js — Questions interactives du générateur GEF
// Réf. Playbook §1 : Responsabilité Unique (SRP)

export const PROJECT_QUESTIONS = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Quel est le nom de votre nouveau projet ?',
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
    name: 'stack',
    message: 'Quel Framework principal voulez-vous installer ?',
    choices: [
      'Next.js (React)',
      'React (Vite)',
      'API Node.js (Express)',
      'API Python (FastAPI)',
      'Projet vide',
    ],
  },
  {
    type: 'list',
    name: 'database',
    message: 'Quelle Base de données principale ?',
    choices: ['PostgreSQL', 'MongoDB', 'Supabase', 'Aucune'],
  },
  {
    type: 'list',
    name: 'cloud',
    message: 'Quel Cloud Provider principal ?',
    choices: ['AWS', 'GCP', 'Azure', 'Vercel', 'Aucun'],
  },
  {
    type: 'confirm',
    name: 'includeDocker',
    message: 'Voulez-vous préparer un dossier Docker ?',
    default: true,
    when: (ans) => ans.cloud !== 'Vercel',
  },
  {
    type: 'confirm',
    name: 'includeCI',
    message: 'Voulez-vous inclure le template de CI/CD GEF ?',
    default: true,
  },
  // NOUVELLES QUESTIONS DYNAMIQUES
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
    name: 'linter',
    message: 'Quel outil de Linting / Formatage ?',
    choices: ['ESLint + Prettier', 'Biome', 'Ruff (Python)', 'Aucun'],
  },
  {
    type: 'list',
    name: 'language',
    message: 'Langue de la documentation et des prompts IA ?',
    choices: ['Français', 'English'],
  },
];
