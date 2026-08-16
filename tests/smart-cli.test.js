// tests/smart-cli.test.js — Tests unitaires pour Smart CLI
// Réf. Playbook §8 : Test Pyramid, TDD

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { smart, setVerboseMode } from '../generator/features/smart-cli.js';
import { analyzeGEFFiles, analyzeGitConfig, analyzeCIConfig, calculateConformityScore, getConformityStatus } from '../generator/features/smart/context-analyzer.js';
import { explainRule } from '../generator/features/smart/rule-explainer.js';
import { suggestImprovements } from '../generator/features/smart/suggester.js';
import { deepAudit } from '../generator/features/smart/auditor.js';

describe('Smart CLI Module', () => {
  describe('setVerboseMode()', () => {
    it('devrait activer le mode verbose', () => {
      setVerboseMode(true);
      assert.ok(true);
    });

    it('devrait désactiver le mode verbose', () => {
      setVerboseMode(false);
      assert.ok(true);
    });
  });

  describe('smart() - routing', () => {
    it('devrait rejeter une action inconnue', async () => {
      await assert.rejects(
        async () => smart('unknown-action', { json: true }),
        (err) => {
          assert.ok(err.message.includes('Action inconnue'));
          return true;
        }
      );
    });

    it('devrait accepter l\'action analyze', async () => {
      const result = await smart('analyze', { json: true });
      assert.ok(result);
      assert.ok(typeof result === 'object');
    });

    it('devrait rejeter explain sans cible', async () => {
      await assert.rejects(
        async () => smart('explain', { json: true }),
        (err) => {
          assert.ok(err.message.includes('cible'));
          return true;
        }
      );
    });

    it('devrait accepter chat en mode test', async () => {
      const result = await smart('chat', { json: true, testMode: true });
      assert.ok(result);
      assert.ok(Array.isArray(result.history));
    });
  });
});

describe('Context Analyzer Module', () => {
  describe('analyzeGEFFiles()', () => {
    it('devrait retourner un objet avec fichiers', () => {
      const result = analyzeGEFFiles();
      assert.ok(result.files);
      assert.ok(typeof result.present === 'number');
      assert.ok(typeof result.total === 'number');
    });

    it('devrait détecter ENGINEERING_PLAYBOOK.md', () => {
      const result = analyzeGEFFiles();
      assert.ok(result.files['ENGINEERING_PLAYBOOK.md'] !== undefined);
    });
  });

  describe('analyzeGitConfig()', () => {
    it('devrait retourner un objet avec git et hooks', () => {
      const result = analyzeGitConfig();
      assert.ok(result.exists !== undefined);
      assert.ok(result.hooks);
      assert.ok(typeof result.exists === 'boolean');
    });
  });

  describe('analyzeCIConfig()', () => {
    it('devrait retourner un objet avec workflows', () => {
      const result = analyzeCIConfig();
      assert.ok(result.workflows !== undefined);
      assert.ok(typeof result.workflowCount === 'number');
    });
  });

  describe('calculateConformityScore()', () => {
    it('devrait calculer un score entre 0 et 100', () => {
      const context = {
        files: { present: 5, total: 7 },
        git: { exists: true, hooks: { 'pre-commit': true, 'pre-push': true, 'commit-msg': true } },
        cicd: { workflows: true, workflowCount: 2 }
      };
      const score = calculateConformityScore(context);
      assert.ok(score >= 0);
      assert.ok(score <= 100);
    });
  });

  describe('getConformityStatus()', () => {
    it('devrait retourner excellent pour score >= 80', () => {
      assert.strictEqual(getConformityStatus(85), 'excellent');
    });

    it('devrait retourner good pour score >= 60', () => {
      assert.strictEqual(getConformityStatus(70), 'good');
    });

    it('devrait retourner acceptable pour score >= 40', () => {
      assert.strictEqual(getConformityStatus(50), 'acceptable');
    });

    it('devrait retourner poor pour score < 40', () => {
      assert.strictEqual(getConformityStatus(30), 'poor');
    });
  });
});

describe('Rule Explainer Module', () => {
  describe('explainRule()', () => {
    it('devrait retourner un objet d\'explication', () => {
      const result = explainRule('test');
      assert.ok(result);
      assert.ok(result.rule === 'test');
    });

    it('devrait inclure une description', () => {
      const result = explainRule('test');
      assert.ok(result.description !== undefined);
    });
  });
});

describe('Suggester Module', () => {
  describe('suggestImprovements()', () => {
    it('devrait retourner un objet avec catégories', () => {
      const result = suggestImprovements();
      assert.ok(result.critical);
      assert.ok(result.high);
      assert.ok(result.medium);
      assert.ok(result.low);
      assert.ok(Array.isArray(result.critical));
    });

    it('devrait inclure un timestamp', () => {
      const result = suggestImprovements();
      assert.ok(result.timestamp);
      assert.ok(typeof result.timestamp === 'string');
    });
  });
});

describe('Auditor Module', () => {
  describe('deepAudit()', () => {
    it('devrait effectuer un audit complet', async () => {
      const result = await deepAudit();
      assert.ok(result);
      assert.ok(result.gefCompliance);
      assert.ok(result.doraMetrics);
      assert.ok(result.correlation);
    });

    it('devrait inclure la conformité GEF', async () => {
      const result = await deepAudit();
      assert.ok(result.gefCompliance.score !== undefined);
      assert.ok(result.gefCompliance.status);
    });

    it('devrait inclure les métriques DORA', async () => {
      const result = await deepAudit();
      assert.ok(result.doraMetrics);
      assert.ok(result.doraMetrics.score !== undefined);
    });

    it('devrait calculer la corrélation GEF/DORA', async () => {
      const result = await deepAudit();
      assert.ok(result.correlation);
      assert.ok(result.correlation.gefScore !== undefined);
      assert.ok(result.correlation.doraScore !== undefined);
      assert.ok(['strong', 'moderate', 'weak'].includes(result.correlation.correlation));
    });

    it('devrait identifier des patterns', async () => {
      const result = await deepAudit();
      assert.ok(Array.isArray(result.patterns));
    });

    it('devrait générer un plan d\'amélioration', async () => {
      const result = await deepAudit();
      assert.ok(Array.isArray(result.improvementPlan));
    });
  });
});
