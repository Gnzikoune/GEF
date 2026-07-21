import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function scaffoldAiRules(projectPath) {
  console.log(chalk.blue('Configuration des barrières de sécurité IA (.cursorrules)...'));

  // Contenu qui bride formellement l'IA dans l'IDE
  const aiRulesContent = `
# Règles Strictes Anti-Contournement (GEF)
# Ce fichier est lu automatiquement par les IA (Cursor, Windsurf, Copilot).

1. LE POURQUOI AVANT TOUT : Avant de générer du code, demande l'intention métier précise à l'utilisateur si elle n'est pas claire.
2. PAS DE COMMITS SUR MAIN : Tu dois toujours suggérer ou utiliser une nouvelle branche (git checkout -b <nom>).
3. CRASH CLAUSE (Zéro Contournement Silencieux) : Face à une erreur inattendue ou une commande qui échoue, ARRÊTE-TOI. Ne cherche jamais à contourner le problème en masquant l'erreur.
4. RESPECT DU PLAYBOOK : Tu dois respecter le fichier ENGINEERING_PLAYBOOK.md à la lettre.
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
