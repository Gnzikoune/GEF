// tests/doctor.test.js — Tests unitaires pour le module doctor
// Réf. Issue #81, specs/spec.md
// Objectif : Valider les fonctions de vérification du doctor

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import * as doctor from '../generator/features/doctor.js';

describe('Doctor Module Tests', () => {

  describe('checkAIRules()', () => {
    it('devrait détecter que .cursorrules existe', async () => {
      const cursorPath = path.join(process.cwd(), '.cursorrules');
      const exists = fs.existsSync(cursorPath);
      assert.strictEqual(exists, true, '.cursorrules devrait exister dans le dépôt GEF');
    });

    it('devrait détecter que .windsurfrules existe', async () => {
      const windsurfPath = path.join(process.cwd(), '.windsurfrules');
      const exists = fs.existsSync(windsurfPath);
      assert.strictEqual(exists, true, '.windsurfrules devrait exister dans le dépôt GEF');
    });

    it('devrait détecter les placeholders non résolus', async () => {
      const cursorPath = path.join(process.cwd(), '.cursorrules');
      const content = fs.readFileSync(cursorPath, 'utf8');
      const placeholderPattern = /\{\{[A-Z_]+\}\}/g;
      const placeholders = content.match(placeholderPattern);
      
      // Dans le dépôt GEF, les placeholders sont présents (c'est normal)
      assert.ok(placeholders && placeholders.length > 0, 'Des placeholders devraient être détectés');
    });
  });

  describe('checkMandatoryFiles()', () => {
    it('devrait détecter que ENGINEERING_PLAYBOOK.md existe', async () => {
      const playbookPath = path.join(process.cwd(), 'ENGINEERING_PLAYBOOK.md');
      const exists = fs.existsSync(playbookPath);
      assert.strictEqual(exists, true, 'ENGINEERING_PLAYBOOK.md devrait exister');
    });

    it('devrait détecter que CONTEXT.md existe', async () => {
      const contextPath = path.join(process.cwd(), 'CONTEXT.md');
      const exists = fs.existsSync(contextPath);
      assert.strictEqual(exists, true, 'CONTEXT.md devrait exister');
    });

    it('devrait détecter que docs/research/RESEARCH_LOG.md existe', async () => {
      const researchLogPath = path.join(process.cwd(), 'docs/research/RESEARCH_LOG.md');
      const exists = fs.existsSync(researchLogPath);
      assert.strictEqual(exists, true, 'docs/research/RESEARCH_LOG.md devrait exister');
    });
  });

  describe('checkGitConfig()', () => {
    it('devrait détecter que .git existe', async () => {
      const gitDir = path.join(process.cwd(), '.git');
      const exists = fs.existsSync(gitDir);
      assert.strictEqual(exists, true, '.git devrait exister');
    });

    it('devrait détecter que le dossier .git/hooks existe', async () => {
      const hooksDir = path.join(process.cwd(), '.git', 'hooks');
      const exists = fs.existsSync(hooksDir);
      assert.strictEqual(exists, true, '.git/hooks devrait exister');
    });
  });

  describe('checkCIConfig()', () => {
    it('devrait détecter que .github/workflows existe', async () => {
      const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
      const exists = fs.existsSync(workflowsDir);
      assert.strictEqual(exists, true, '.github/workflows devrait exister');
    });

    it('devrait détecter au moins un workflow GitHub Actions', async () => {
      const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
      const files = fs.readdirSync(workflowsDir);
      assert.ok(files.length > 0, 'Au moins un workflow devrait exister');
    });
  });

  describe('doctor() - fonction principale', () => {
    it('devrait s\'exécuter sans erreur', async () => {
      // La fonction doctor() est async et ne retourne rien
      // On vérifie juste qu'elle ne lance pas d'erreur
      try {
        await doctor.doctor();
        assert.ok(true, 'doctor() devrait s\'exécuter sans erreur');
      } catch (error) {
        assert.fail(`doctor() a lancé une erreur : ${error.message}`);
      }
    });
  });

});
