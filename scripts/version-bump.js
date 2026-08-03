#!/usr/bin/env node
/**
 * Script d'aide au versioning manuel respectant le GEF
 * Réf: ADR-004 - Processus de versioning manuel
 * 
 * Ce script guide le développeur à travers le processus de versioning
 * manuel qui respecte le format Conventional Commits du Playbook §5.
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Lire package.json pour obtenir la version actuelle
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const currentVersion = packageJson.version;

console.log(`\n📦 Version actuelle: ${currentVersion}`);
console.log('\n🔄 Processus de versioning manuel (ADR-004)\n');
console.log('Ce script va vous guider pour créer un version bump respectant le GEF.\n');

// Demander le type de version
const bumpTypes = ['patch', 'minor', 'major'];
const typeIndex = process.argv.findIndex(arg => bumpTypes.includes(arg));
const bumpType = typeIndex !== -1 ? process.argv[typeIndex] : 'patch';

console.log(`📌 Type de bump: ${bumpType}`);
console.log('\n📋 Instructions manuelles (exécutez ces commandes):\n');

console.log(`# 1. Mettre à jour la version sans créer de commit`);
console.log(`npm version ${bumpType} --no-git-tag-version`);
console.log('');
console.log(`# 2. Commiter avec message Conventional Commits conforme`);
console.log(`git add package.json package-lock.json`);
console.log(`git commit -m "chore: bump version to X.Y.Z (#ticket)"`);
console.log('');
console.log(`# 3. Créer le tag manuellement`);
console.log(`git tag vX.Y.Z`);
console.log('');
console.log(`# 4. Pusher avec les tags`);
console.log(`git push --follow-tags`);
console.log('');
console.log('⚠️  N\'oubliez pas de remplacer X.Y.Z par la nouvelle version et #ticket par votre numéro de ticket.\n');

// Afficher la prochaine version estimée
const [major, minor, patch] = currentVersion.split('.').map(Number);
let nextVersion;
switch (bumpType) {
  case 'major':
    nextVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    nextVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    nextVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`🎯 Prochaine version estimée: ${nextVersion}\n`);