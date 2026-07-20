// features/scaffold-stack.js — Installation du framework principal
// Réf. Playbook §1 : SRP — une fonction par stack, Guard Clauses, Early Return

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const EXPRESS_ENTRY = (port = 3000) => `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || ${port};

app.use(cors());
app.use(express.json({ limit: '1mb' })); // Hard Limit Playbook §4 : 1Mo max

app.get('/', (req, res) => res.json({ message: 'API prête.' }));

app.listen(PORT, () => console.log(\`Serveur lancé sur http://localhost:\${PORT}\`));
`;

const FASTAPI_ENTRY = (projectName) => `from fastapi import FastAPI

app = FastAPI(title="${projectName}")

@app.get("/")
def read_root():
    return {"message": "API prête."}
`;

/**
 * Lance le scaffolding du framework choisi.
 * @param {Object} answers
 * @param {string} projectPath
 */
export function scaffoldStack(answers, projectPath) {
  if (answers.stack === 'Projet vide') return;

  const handlers = {
    'Next.js (React)': () => scaffoldNext(answers, projectPath),
    'React (Vite)': () => scaffoldVite(answers, projectPath),
    'API Node.js (Express)': () => scaffoldExpress(),
    'API Python (FastAPI)': () => scaffoldFastapi(answers.projectName),
  };

  const handler = handlers[stack];
  if (!handler) return;

  try {
    handler();
    console.log(chalk.green('\n✅ Framework installé.'));
  } catch (_) {
    console.log(chalk.red('\nErreur lors du scaffolding. Continuation avec la structure de base GEF.'));
  }
}

function scaffoldNext(answers, projectPath) {
  console.log(chalk.magenta('\n▲  Lancement de create-next-app en mode silencieux :\n'));
  process.chdir(path.resolve(projectPath, '..'));
  fs.rmdirSync(projectPath);
  
  const eslintFlag = answers.linter.includes('ESLint') ? '--eslint' : '--no-eslint';
  execSync(`npx create-next-app@latest ${answers.projectName} --typescript --tailwind ${eslintFlag} --app --src-dir --import-alias "@/*" --yes`, { stdio: 'inherit' });
  process.chdir(projectPath);
  console.log(chalk.yellow('\n🎭 Installation de Playwright (E2E)...'));
  execSync('npm init playwright@latest --yes -- --quiet --browser=chromium', { stdio: 'inherit' });
}

function scaffoldVite(answers, projectPath) {
  console.log(chalk.magenta('\n⚡ Lancement de create-vite en mode silencieux :\n'));
  process.chdir(path.resolve(projectPath, '..'));
  fs.rmdirSync(projectPath);
  execSync(`npm create vite@latest ${answers.projectName} -- --template react-ts`, { stdio: 'inherit' });
  process.chdir(projectPath);
  console.log(chalk.yellow('\nInstallation des dépendances...'));
  execSync('npm install', { stdio: 'inherit' });
  console.log(chalk.yellow('\n🎭 Installation de Playwright (E2E)...'));
  execSync('npm init playwright@latest --yes -- --quiet --browser=chromium', { stdio: 'inherit' });
}

function scaffoldExpress() {
  console.log(chalk.magenta('\n📦 Initialisation de l\'API Node.js...\n'));
  execSync('npm init -y', { stdio: 'ignore' });
  execSync('npm install express cors dotenv', { stdio: 'inherit' });
  fs.mkdirSync('src', { recursive: true });
  fs.writeFileSync('src/index.js', EXPRESS_ENTRY());
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.scripts = { start: 'node src/index.js', dev: 'node --watch src/index.js' };
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
}

function scaffoldFastapi(projectName) {
  console.log(chalk.magenta('\n🐍 Initialisation de l\'API Python (FastAPI)...\n'));
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  execSync(`${pythonCmd} -m venv venv`, { stdio: 'inherit' });
  fs.writeFileSync('requirements.txt', 'fastapi\nuvicorn[standard]\npython-dotenv\n');
  fs.mkdirSync('src', { recursive: true });
  fs.writeFileSync('src/__init__.py', '');
  fs.writeFileSync('src/main.py', FASTAPI_ENTRY(projectName));
}
