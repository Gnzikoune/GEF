// features/scaffold-docker.js — Génération des fichiers Docker
// Réf. Playbook §1 : SRP — une fonction par stack Docker, nesting <= 3

import fs from 'fs';
import chalk from 'chalk';

const DOCKERIGNORE = [
  'node_modules', 'npm-debug.log', '.git', '.gitignore',
  '.env', '*.log', 'dist', 'build', '__pycache__', 'venv', '.venv',
].join('\n') + '\n';

const DOCKERFILES = {
  'Next.js (React)': `# Étape 1 : Build
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
`,
  'React (Vite)': `# Étape 1 : Build
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
`,
  'API Node.js (Express)': `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
`,
  'API Python (FastAPI)': `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
`,
  default: `FROM alpine:latest
WORKDIR /app
COPY . .
CMD ["sh"]
`,
};

/**
 * Génère un snippet docker-compose pour un service de base de données.
 * @param {string} database
 * @param {string} projectName
 * @returns {string}
 */
function buildDbService(database, projectName) {
  const dbName = projectName.toLowerCase().replace(/\s+/g, '_');
  if (database === 'PostgreSQL') {
    return `
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${dbName}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      - ../database/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  db_data:`;
  }
  if (database === 'MongoDB') {
    return `
  db:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - db_data:/data/db

volumes:
  db_data:`;
  }
  return '';
}

/**
 * Génère le contenu docker-compose selon la stack.
 * @param {string} stack
 * @param {string} database
 * @param {string} projectName
 * @returns {string}
 */
function buildComposeContent(stack, database, projectName) {
  const port = stack.includes('Python') ? '8000' : stack.includes('Vite') ? '80' : '3000';
  const dbService = buildDbService(database, projectName);
  const needsDb = stack.includes('Express') || stack.includes('Python');

  return `version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "${port}:${port}"
    ${needsDb ? 'env_file:\n      - ../.env\n    depends_on:\n      - db' : ''}${dbService}
`;
}

/**
 * Génère tous les fichiers Docker pour le projet.
 * @param {string} stack
 * @param {string} database
 * @param {string} projectName
 */
export function scaffoldDocker(stack, database, projectName) {
  console.log(chalk.yellow('🐳 Génération des fichiers Docker...'));
  fs.mkdirSync('docker', { recursive: true });
  fs.writeFileSync('.dockerignore', DOCKERIGNORE);

  const dockerfile = DOCKERFILES[stack] ?? DOCKERFILES.default;
  fs.writeFileSync('docker/Dockerfile', dockerfile);
  fs.writeFileSync('docker/docker-compose.yml', buildComposeContent(stack, database, projectName));

  if (database === 'PostgreSQL') {
    fs.mkdirSync('database', { recursive: true });
    fs.writeFileSync('database/init.sql', `-- Initialisation de la base de données ${projectName}
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);
  }

  console.log(chalk.green('✅ Fichiers Docker générés.'));
}
