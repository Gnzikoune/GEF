#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GEF_DIR = path.resolve(__dirname, '..');

console.log(chalk.cyan.bold('\n🚀 Bienvenue dans le générateur GEF Intelligent\n'));

async function run() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Quel est le nom de votre nouveau projet ?',
      validate: input => input ? true : 'Le nom du projet est requis.'
    },
    {
      type: 'list',
      name: 'phase',
      message: 'Dans quelle phase se situe ce projet ?',
      choices: ['Prototype (R&D)', 'Développement contractuel / Production']
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
        'Projet vide'
      ]
    },
    {
      type: 'list',
      name: 'database',
      message: 'Quelle Base de données principale ?',
      choices: ['PostgreSQL', 'MongoDB', 'Supabase', 'Aucune']
    },
    {
      type: 'list',
      name: 'cloud',
      message: 'Quel Cloud Provider principal ?',
      choices: ['AWS', 'GCP', 'Azure', 'Vercel', 'Aucun']
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Voulez-vous préparer un dossier Docker ?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeCI',
      message: 'Voulez-vous inclure le template de CI/CD GEF ?',
      default: true
    }
  ]);

  const { projectName, phase, stack, database, cloud, includeDocker, includeCI } = answers;
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\nErreur: Le dossier "${projectName}" existe déjà.`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nCréation du dossier projet : ${projectPath}`));
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  // --- SCAFFOLDING INTELLIGENT ---
  if (stack !== 'Projet vide') {
    console.log(chalk.magenta(`\n📦 Installation du framework : ${stack}... Cela peut prendre quelques minutes.`));
    
    try {
      if (stack === 'Next.js (React)') {
        execSync('npx create-next-app@latest . --typescript --eslint --tailwind --no-src-dir --app --import-alias "@/*" --use-npm', { stdio: 'inherit' });
      } 
      else if (stack === 'React (Vite)') {
        execSync('npm create vite@latest . -- --template react-ts', { stdio: 'inherit' });
        execSync('npm install', { stdio: 'inherit' });
      }
      else if (stack === 'API Node.js (Express)') {
        execSync('npm init -y', { stdio: 'ignore' });
        execSync('npm install express cors dotenv', { stdio: 'inherit' });
        fs.mkdirSync('src');
        fs.writeFileSync('src/index.js', "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => res.send('API Node.js Ready'));\n\napp.listen(3000, () => console.log('Server running on port 3000'));");
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts = { start: "node src/index.js", dev: "node src/index.js" };
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
      }
      else if (stack === 'API Python (FastAPI)') {
        // Compatibilité Windows / Unix
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
        execSync(`${pythonCmd} -m venv venv`, { stdio: 'inherit' });
        fs.writeFileSync('requirements.txt', 'fastapi\nuvicorn\n');
        fs.mkdirSync('src');
        fs.writeFileSync('src/main.py', "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/')\ndef read_root():\n    return {'message': 'API FastAPI Ready'}\n");
      }
      console.log(chalk.green('✅ Framework installé.'));
    } catch (err) {
      console.log(chalk.red('\nErreur lors de l\'installation du framework. Continuation avec la structure de base.'));
    }
  }

  // --- SURCOUCHE GEF ---
  console.log(chalk.yellow('\n📁 Application de la surcouche GEF (Architecture & Config)...'));
  
  // Création des dossiers manquants
  const dirs = [
    'docs/adr', 'docs/research', 'src', 'tests', 'scripts',
    'assets', 'infra', 'database'
  ];
  if (includeCI) dirs.push('.github/workflows');
  
  dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // --- DOCKER INTELLIGENT ---
  if (includeDocker) {
    console.log(chalk.yellow('🐳 Génération des fichiers Docker adaptés à votre stack...'));
    if (!fs.existsSync('docker')) fs.mkdirSync('docker');

    // .dockerignore (toujours présent)
    const dockerIgnoreLines = [
      'node_modules', 'npm-debug.log', '.git', '.gitignore',
      '.env', '*.log', 'dist', 'build', '__pycache__', 'venv', '.venv'
    ];
    fs.writeFileSync('.dockerignore', dockerIgnoreLines.join('\n') + '\n');

    if (stack === 'Next.js (React)') {
      fs.writeFileSync('docker/Dockerfile', `# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
`);
      fs.writeFileSync('docker/docker-compose.yml', `version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
`);
    }

    else if (stack === 'React (Vite)') {
      fs.writeFileSync('docker/Dockerfile', `# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur statique Nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`);
      fs.writeFileSync('docker/docker-compose.yml', `version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"
`);
    }

    else if (stack === 'API Node.js (Express)') {
      fs.writeFileSync('docker/Dockerfile', `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
`);
      // docker-compose avec DB optionnelle
      let dbService = '';
      if (database === 'PostgreSQL') {
        dbService = `
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${projectName.toLowerCase().replace(/\s+/g, '_')}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:`;
      } else if (database === 'MongoDB') {
        dbService = `
  db:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - db_data:/data/db

volumes:
  db_data:`;
      }
      fs.writeFileSync('docker/docker-compose.yml', `version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - ../.env
    depends_on:
      - db${dbService}
`);
    }

    else if (stack === 'API Python (FastAPI)') {
      fs.writeFileSync('docker/Dockerfile', `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
`);
      let dbService = '';
      if (database === 'PostgreSQL') {
        dbService = `
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${projectName.toLowerCase().replace(/\s+/g, '_')}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:`;
      } else if (database === 'MongoDB') {
        dbService = `
  db:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - db_data:/data/db

volumes:
  db_data:`;
      }
      fs.writeFileSync('docker/docker-compose.yml', `version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ../.env
    depends_on:
      - db${dbService}
`);
    }

    else {
      // Projet vide — Dockerfile générique
      fs.writeFileSync('docker/Dockerfile', `FROM alpine:latest
WORKDIR /app
COPY . .
CMD ["sh"]
`);
    }
    console.log(chalk.green('✅ Fichiers Docker générés.'));
  }

  // Mise à jour du README existant ou création
  const readmeHeader = `# ${projectName}\n\n## Fonctionnalités\n<À COMPLÉTER>\n\n## Installation\n<À COMPLÉTER>\n\n## Architecture\nStack: ${stack}\nCloud: ${cloud}\nDB: ${database}\n`;
  if (fs.existsSync('README.md')) {
    const existing = fs.readFileSync('README.md', 'utf8');
    fs.writeFileSync('README.md', readmeHeader + '\n---\n*Généré initialement par le framework:*\n' + existing);
  } else {
    fs.writeFileSync('README.md', readmeHeader);
  }

  // PROJECT_CONFIG.md
  let configContent = `# PROJECT_CONFIG.md\n- Projet : ${projectName}\n- Langage : ${stack}\n`;
  const templatePath = path.join(GEF_DIR, 'PROJECT_CONFIG.template.md');
  if (fs.existsSync(templatePath)) {
    let tpl = fs.readFileSync(templatePath, 'utf-8');
    tpl = tpl.replace(/{{PROJECT_NAME}}/g, projectName);
    tpl = tpl.replace(/{{STACK}}/g, stack);
    tpl = tpl.replace(/{{PHASE}}/g, phase);
    tpl = tpl.replace(/{{DATABASE}}/g, database);
    tpl = tpl.replace(/{{CLOUD}}/g, cloud);
    const dateStr = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    tpl = tpl.replace(/{{DATE}}/g, dateStr);
    configContent = tpl;
  }
  fs.writeFileSync('PROJECT_CONFIG.md', configContent);

  // RESEARCH_LOG.md
  if (!fs.existsSync('docs/research/RESEARCH_LOG.md')) {
    fs.writeFileSync('docs/research/RESEARCH_LOG.md', `# Research Log — Journal de bord scientifique\n> Documentez ici la résolution des bugs bloquants.\n\n## 1. <Titre>\n- **Contexte :** \n- **Cause :** \n- **Résolution :** \n`);
  }

  // .gitignore dynamique additionnel
  let gitignoreAdditions = `\n# GEF Standard\n.env\n.DS_Store\n`;
  if (stack.includes('Python')) gitignoreAdditions += `__pycache__/\nvenv/\n.venv/\n.pytest_cache/\n`;
  if (fs.existsSync('.gitignore')) {
    fs.appendFileSync('.gitignore', gitignoreAdditions);
  } else {
    fs.writeFileSync('.gitignore', gitignoreAdditions);
  }

  // Git et Hooks
  console.log(chalk.yellow('🔗 Initialisation Git et installation des hooks de sécurité...'));
  try {
    if (!fs.existsSync('.git')) {
      execSync('git init', { stdio: 'ignore' });
    }
    const hooksSrc = path.join(GEF_DIR, 'hooks');
    if (fs.existsSync(hooksSrc)) {
      const hooksDest = path.join(process.cwd(), '.git', 'hooks');
      fs.cpSync(hooksSrc, hooksDest, { recursive: true });
      try {
        execSync(`chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push`, { stdio: 'ignore' });
      } catch (e) { /* ignore on windows */ }
    }
  } catch (err) {
    console.log(chalk.red('Erreur lors de l\'installation des hooks Git.'));
  }

  // CI/CD
  if (includeCI) {
    console.log(chalk.yellow('🤖 Copie du template CI/CD...'));
    const ciSrc = path.join(GEF_DIR, 'ci-templates', 'main.yml');
    if (fs.existsSync(ciSrc)) {
      fs.cpSync(ciSrc, path.join(process.cwd(), '.github', 'workflows', 'main.yml'));
    }
  }

  if (!fs.existsSync('CHANGELOG.md')) fs.writeFileSync('CHANGELOG.md', '');
  if (!fs.existsSync('LICENSE')) fs.writeFileSync('LICENSE', '');

  console.log(chalk.green.bold(`\n✅ Projet "${projectName}" scaffoldé avec succès !`));
  console.log(chalk.cyan(`\nPour commencer :`));
  console.log(chalk.white(`  cd ${projectName}`));
  if (stack.includes('React') || stack.includes('Node')) {
    console.log(chalk.white(`  npm run dev`));
  } else if (stack.includes('Python')) {
    console.log(chalk.white(`  .\\venv\\Scripts\\activate  (ou source venv/bin/activate)`));
    console.log(chalk.white(`  uvicorn src.main:app --reload`));
  }
  console.log(chalk.white(`\nN'oubliez pas d'éditer PROJECT_CONFIG.md et de faire votre premier commit !`));
}

run().catch(err => {
  console.error(chalk.red('Une erreur est survenue :'), err);
  process.exit(1);
});
