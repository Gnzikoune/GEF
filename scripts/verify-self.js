#!/usr/bin/env node
// scripts/verify-self.js — Audit de cohérence interne du GEF
// Réf. ENGINEERING_PLAYBOOK.md §2 (Hard Limits), §7 (Documentation), §5 (Sécurité)
// Objectif : Garantir que la documentation et le code racontent la même histoire.

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
let hasError = false;

/**
 * Affiche une erreur bloquante et marque le run comme échoué.
 */
function fail(message) {
  console.error(`\x1b[31m✗ ERREUR : ${message}\x1b[0m`);
  hasError = true;
}

/**
 * Affiche un avertissement non-bloquant.
 */
function warn(message) {
  console.warn(`\x1b[33m⚠ AVERTISSEMENT : ${message}\x1b[0m`);
}

/**
 * Affiche un succès.
 */
function ok(message) {
  console.log(`\x1b[32m✓ ${message}\x1b[0m`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Vérification 1 : Intégrité du moteur de templating (placeholders dans locales/)
//
// Philosophie : Dans le dépôt GEF lui-même, .cursorrules et .windsurfrules sont
// des FICHIERS SOURCE — ils DOIVENT contenir des {{PLACEHOLDERS}} (matière première
// du générateur). Ce qui est vérifié ici, c'est que les TEMPLATES source sont
// cohérents entre eux : les mêmes variables existent dans fr/ et en/.
// La résolution effective des placeholders est testée par applyTemplating() à la génération.
// ─────────────────────────────────────────────────────────────────────────────
function checkTemplatePlaceholderConsistency() {
  const PLACEHOLDER_PATTERN = /\{\{([A-Z_]+)\}\}/g;
  const TEMPLATE_FILES = [
    { fr: 'locales/fr/.cursorrules', en: 'locales/en/.cursorrules' },
    { fr: 'locales/fr/ENGINEERING_PLAYBOOK.md', en: 'locales/en/ENGINEERING_PLAYBOOK.md' },
  ];

  let allOk = true;

  for (const pair of TEMPLATE_FILES) {
    const frPath = path.join(ROOT, pair.fr);
    const enPath = path.join(ROOT, pair.en);

    if (!fs.existsSync(frPath) || !fs.existsSync(enPath)) {
      warn(`Paire de templates incomplète : ${pair.fr} / ${pair.en}`);
      continue;
    }

    const extractVars = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return new Set([...content.matchAll(PLACEHOLDER_PATTERN)].map((m) => m[1]));
    };

    const frVars = extractVars(frPath);
    const enVars = extractVars(enPath);

    const onlyInFr = [...frVars].filter((v) => !enVars.has(v));
    const onlyInEn = [...enVars].filter((v) => !frVars.has(v));

    if (onlyInFr.length > 0 || onlyInEn.length > 0) {
      fail(
        `Désynchronisation de placeholders entre ${pair.fr} et ${pair.en}.\n` +
        (onlyInFr.length ? `  Uniquement dans FR : ${onlyInFr.join(', ')}\n` : '') +
        (onlyInEn.length ? `  Uniquement dans EN : ${onlyInEn.join(', ')}` : '')
      );
      allOk = false;
    }
  }

  if (allOk) {
    ok('Placeholders cohérents entre les templates FR et EN.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vérification 2 : Cohérence de version entre package.json et README.md
// Le badge de version dans le README doit refléter la version publiée.
// ─────────────────────────────────────────────────────────────────────────────
function checkVersionConsistency() {
  const pkgPath = path.join(ROOT, 'package.json');
  const readmePath = path.join(ROOT, 'README.md');

  if (!fs.existsSync(pkgPath) || !fs.existsSync(readmePath)) {
    warn('Impossible de vérifier la cohérence de version (package.json ou README.md introuvable).');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const currentVersion = pkg.version;
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  // Recherche d'un badge npm ou d'une mention de version dans le README
  const versionPattern = /v(\d+\.\d+\.\d+)/g;
  const mentionedVersions = [...readmeContent.matchAll(versionPattern)].map((m) => m[1]);

  if (mentionedVersions.length === 0) {
    warn(`Aucune version trouvée dans README.md. Ajoutez un badge npm ou une mention de v${currentVersion}.`);
    return;
  }

  const outdatedMentions = mentionedVersions.filter((v) => v !== currentVersion);
  if (outdatedMentions.length > 0) {
    fail(
      `README.md contient des versions obsolètes : ${[...new Set(outdatedMentions)].join(', ')}. ` +
      `La version actuelle est v${currentVersion}.`
    );
  } else {
    ok(`Version cohérente : v${currentVersion} (package.json ↔ README.md).`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vérification 3 : Synchronisation .cursorrules / .windsurfrules
// Remplace la délégation comportementale à l'IA par une vérification mécanique.
// ─────────────────────────────────────────────────────────────────────────────
function checkCursorWindsurfSync() {
  const cursorPath = path.join(ROOT, '.cursorrules');
  const windsurfPath = path.join(ROOT, '.windsurfrules');

  if (!fs.existsSync(cursorPath) || !fs.existsSync(windsurfPath)) {
    warn('Un des fichiers .cursorrules / .windsurfrules est absent — synchronisation impossible.');
    return;
  }

  const cursorContent = fs.readFileSync(cursorPath, 'utf8');
  const windsurfContent = fs.readFileSync(windsurfPath, 'utf8');

  if (cursorContent !== windsurfContent) {
    fail(
      '.cursorrules et .windsurfrules sont désynchronisés.\n' +
      '  Correction : cp .cursorrules .windsurfrules'
    );
  } else {
    ok('.cursorrules et .windsurfrules sont synchronisés.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vérification 4 : Présence des fichiers obligatoires du GEF
// ─────────────────────────────────────────────────────────────────────────────
function checkMandatoryFiles() {
  const MANDATORY_FILES = [
    'ENGINEERING_PLAYBOOK.md',
    'CONTEXT.md',
    'docs/research/RESEARCH_LOG.md',
    '.cursorrules',
    '.windsurfrules',
  ];

  let allPresent = true;
  for (const relPath of MANDATORY_FILES) {
    if (!fs.existsSync(path.join(ROOT, relPath))) {
      fail(`Fichier GEF obligatoire absent : ${relPath}`);
      allPresent = false;
    }
  }

  if (allPresent) {
    ok('Tous les fichiers obligatoires GEF sont présents.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vérification 5 : Avertissement si aucun linter n'est configuré
// Non-bloquant : signale un risque de dérive de qualité.
// ─────────────────────────────────────────────────────────────────────────────
function checkLinterPresence() {
  const pkgPath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const hasLintScript = pkg.scripts && pkg.scripts.lint;
  const hasMakefile = fs.existsSync(path.join(ROOT, 'Makefile'));

  if (!hasLintScript && !hasMakefile) {
    warn(
      'Aucun linter configuré (npm run lint ou Makefile lint absent).\n' +
      '  Les Hard Limits du Playbook §2 ne sont pas vérifiées mécaniquement.\n' +
      '  Configurez ESLint, Biome ou Ruff dans PROJECT_CONFIG.md.'
    );
  } else {
    ok('Linter détecté.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exécution
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[36m🛡️  GEF verify-self — Audit de cohérence interne\x1b[0m\n');

checkTemplatePlaceholderConsistency();
checkVersionConsistency();
checkCursorWindsurfSync();
checkMandatoryFiles();
checkLinterPresence();

console.log('');

if (hasError) {
  console.error('\x1b[31m✗ verify-self a détecté des incohérences. Corrigez les erreurs ci-dessus avant de continuer.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✓ verify-self : GEF est cohérent avec lui-même.\x1b[0m\n');
  process.exit(0);
}
