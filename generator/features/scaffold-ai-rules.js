import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function scaffoldAiRules(gefDir, projectPath) {
  console.log(chalk.blue('Configuration des barrières de sécurité IA (.cursorrules)...'));

  // Source unique de vérité : le .cursorrules du framework GEF lui-même
  const sourceRulesPath = path.join(gefDir, '.cursorrules');

  if (!fs.existsSync(sourceRulesPath)) {
    console.warn(chalk.yellow('Avertissement: .cursorrules source introuvable dans le répertoire GEF. Les règles IA ne seront pas copiées.'));
    return;
  }

  const aiRulesContent = fs.readFileSync(sourceRulesPath, 'utf-8');

  // Écriture pour Cursor et Windsurf
  fs.writeFileSync(path.join(projectPath, '.cursorrules'), aiRulesContent);
  fs.writeFileSync(path.join(projectPath, '.windsurfrules'), aiRulesContent);

  // Écriture pour GitHub Copilot
  const githubPath = path.join(projectPath, '.github');
  if (!fs.existsSync(githubPath)) {
    fs.mkdirSync(githubPath, { recursive: true });
  }
  fs.writeFileSync(path.join(githubPath, 'copilot-instructions.md'), aiRulesContent);
}

