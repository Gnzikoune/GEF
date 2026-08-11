import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { applyTemplating } from './setup-gef.js';

export function setupAiRules(gefDir, projectPath, strictness) {
  console.log(chalk.blue('Configuration des barrières de sécurité IA (.cursorrules, .agents)...'));

  // Source unique de vérité : le .cursorrules du framework GEF lui-même
  const sourceRulesPath = path.join(gefDir, '.cursorrules');

  if (!fs.existsSync(sourceRulesPath)) {
    console.warn(chalk.yellow('Avertissement: .cursorrules source introuvable dans le répertoire GEF. Les règles IA ne seront pas copiées.'));
    return;
  }

  let aiRulesContent = fs.readFileSync(sourceRulesPath, 'utf-8');
  aiRulesContent = applyTemplating(aiRulesContent, strictness || 'Standard');

  // Écriture pour Cursor et Windsurf
  fs.writeFileSync(path.join(projectPath, '.cursorrules'), aiRulesContent);
  fs.writeFileSync(path.join(projectPath, '.windsurfrules'), aiRulesContent);

  // Écriture pour GitHub Copilot
  const githubPath = path.join(projectPath, '.github');
  if (!fs.existsSync(githubPath)) {
    fs.mkdirSync(githubPath, { recursive: true });
  }
  fs.writeFileSync(path.join(githubPath, 'copilot-instructions.md'), aiRulesContent);

  // Écriture pour Antigravity (.agents/AGENTS.md)
  const agentsPath = path.join(projectPath, '.agents');
  if (!fs.existsSync(agentsPath)) {
    fs.mkdirSync(agentsPath, { recursive: true });
  }
  fs.writeFileSync(path.join(agentsPath, 'AGENTS.md'), aiRulesContent);
}

