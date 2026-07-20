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
];
