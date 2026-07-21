import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function scaffoldAiRules(projectPath) {
  console.log(chalk.blue('Configuration des barrières de sécurité IA (.cursorrules)...'));

  // Contenu qui bride formellement l'IA dans l'IDE avec toutes les règles du GEF
  const aiRulesContent = `
# 🛡️ GILDAS ENGINEERING FRAMEWORK (GEF) - AI RULES
# Ce fichier définit les limites dures et infranchissables pour toute IA opérant sur ce projet.

## 0. LE POURQUOI & CRASH CLAUSE (Anti-Contournement)
- **Le Pourquoi Avant Tout** : Avant de générer du code, assure-toi d'avoir compris l'intention métier. Ne devine pas, demande.
- **CRASH CLAUSE** : Face à une erreur inattendue, une ambiguïté ou un échec de commande, ARRÊTE-TOI IMMÉDIATEMENT. Ne cherche jamais à contourner le problème silencieusement.
- **Zéro Commit sur Main** : Ne commit/push JAMAIS directement sur \`main\`. Utilise \`git checkout -b <nom-branche>\`.

## 1. LIMITES DE CODE (HARD LIMITS)
- **Fonctions** : {{MAX_LINES}} lignes max.
- **Paramètres** : {{MAX_PARAMS}} arguments max.
- **Composants UI** : 150 à 200 lignes max. Logique > 50 lignes = Custom Hook.
- **Fichiers** : 300 à 400 lignes max.
- **Nesting / Profondeur** : 3 niveaux max.
- **Complexité** : {{MAX_COMPLEXITY}} chemins logiques max. Utilise les Guard Clauses (Early Return).
- **Règle de 3** : À la 3ème duplication, refactorise en abstraction.

## 2. ARCHITECTURE & ERREURS
- **Feature-Sliced Design** : Organise les dossiers par fonctionnalité métier (ex: \`/features/auth\`), pas par type technique (\`/controllers\`).
- **Information Hiding** : N'expose JAMAIS les stack traces à l'utilisateur final.
- **Result Pattern** : Privilégie le retour \`Result<Success, Failure>\` aux blocs \`try/catch\` massifs.

## 3. SÉCURITÉ (OWASP LIMITS)
- **Zero Trust** : Valide toutes les entrées (ex: Zod, Joi).
- **JWT** : Access Token = 15 minutes max. Refresh Token = 7 jours max (HttpOnly).
- **Payloads** : {{MAX_PAYLOAD}} max pour le JSON, 5 Mo max pour l'upload.
- **Rate Limiting** : Bloquer après 5 échecs en 15 min. Max 100 req/min/IP.
- **Secrets** : Toujours dans \`.env\`, jamais hardcodés.

## 4. GIT & MÉTHODOLOGIE
- **GitHub Flow** : Branches courtes (\`feat/\`, \`fix/\`), Pull Requests obligatoires.
- **Conventional Commits** : \`feat:\`, \`fix:\`, \`chore:\`, \`refactor:\`, \`docs:\`, \`test:\`. (Inclure l'ID de ticket Kanban).
- **Boy Scout Rule (Fix Forward)** : Nettoie le code environnant quand tu modifies un fichier, mais ne refactorise pas le code existant juste pour le plaisir.
- **Documentation** : Format Diátaxis (Tutoriels, How-to, Référence, Explication). Les bugs critiques vont dans RESEARCH_LOG.md.
`;

  // Écriture du fichier .cursorrules
  fs.writeFileSync(path.join(projectPath, '.cursorrules'), aiRulesContent.trim());
  
  // Également pour le format .windsurfrules et instructions copilot
  fs.writeFileSync(path.join(projectPath, '.windsurfrules'), aiRulesContent.trim());
  const githubPath = path.join(projectPath, '.github');
  if (!fs.existsSync(githubPath)) {
    fs.mkdirSync(githubPath, { recursive: true });
  }
  fs.writeFileSync(path.join(githubPath, 'copilot-instructions.md'), aiRulesContent.trim());
}
