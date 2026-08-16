// tests/dora.test.js — Tests pour DORA Metrics Enhancement

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateChangeFailureRate,
  calculateTimeToRestore,
  getDoraLevel,
  calculatePearsonCorrelation,
  calculateCorrelation,
  getDoraBenchmarks
} from '../generator/features/dora.js';
import fs from 'fs';
import path from 'path';

describe('DORA Metrics', () => {
  describe('calculateChangeFailureRate', () => {
    it('devrait retourner 0 si pas d\'historique', () => {
      const result = calculateChangeFailureRate(null);
      assert.strictEqual(result, 0);
    });

    it('devrait retourner 0 si pas de déploiements', () => {
      const gitHistory = { commits: [{ message: 'feat: add feature' }] };
      const result = calculateChangeFailureRate(gitHistory);
      assert.strictEqual(result, 0);
    });

    it('devrait calculer CFR avec rollbacks', () => {
      const gitHistory = {
        commits: [
          { message: 'deploy: version 1.0', date: new Date() },
          { message: 'deploy: version 1.1', date: new Date() },
          { message: 'rollback: version 1.1', date: new Date() }
        ]
      };
      const result = calculateChangeFailureRate(gitHistory);
      assert.strictEqual(result, 50);
    });

    it('devrait calculer CFR avec hotfixs', () => {
      const gitHistory = {
        commits: [
          { message: 'deploy: version 1.0', date: new Date() },
          { message: 'hotfix: fix critical bug', date: new Date() }
        ]
      };
      const result = calculateChangeFailureRate(gitHistory);
      assert.strictEqual(result, 100);
    });
  });

  describe('calculateTimeToRestore', () => {
    it('devrait retourner 0 si RESEARCH_LOG n\'existe pas', () => {
      const result = calculateTimeToRestore('/nonexistent/path');
      assert.strictEqual(result, 0);
    });

    it('devrait calculer MTTR depuis RESEARCH_LOG', () => {
      const testDir = path.join(process.cwd(), 'test-temp-dora');
      fs.mkdirSync(testDir, { recursive: true });
      const researchDir = path.join(testDir, 'docs', 'research');
      fs.mkdirSync(researchDir, { recursive: true });
      const tempPath = path.join(researchDir, 'RESEARCH_LOG.md');
      fs.writeFileSync(tempPath, 'Temps de résolution : 2 heures\nTemps de résolution : 4 heures');
      
      const result = calculateTimeToRestore(testDir);
      assert.strictEqual(result, 3);
      
      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('devrait convertir les jours en heures', () => {
      const testDir = path.join(process.cwd(), 'test-temp-dora');
      fs.mkdirSync(testDir, { recursive: true });
      const researchDir = path.join(testDir, 'docs', 'research');
      fs.mkdirSync(researchDir, { recursive: true });
      const tempPath = path.join(researchDir, 'RESEARCH_LOG.md');
      fs.writeFileSync(tempPath, 'Temps de résolution : 1 jour\nTemps de résolution : 2 jours');
      
      const result = calculateTimeToRestore(testDir);
      assert.strictEqual(result, 36);
      
      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });

  describe('getDoraLevel', () => {
    it('devrait retourner Elite pour CFR < 15%', () => {
      const result = getDoraLevel('changeFailureRate', 10);
      assert.strictEqual(result.label, 'Elite');
    });

    it('devrait retourner High pour CFR 15-20%', () => {
      const result = getDoraLevel('changeFailureRate', 18);
      assert.strictEqual(result.label, 'High');
    });

    it('devrait retourner Medium pour CFR 21-30%', () => {
      const result = getDoraLevel('changeFailureRate', 25);
      assert.strictEqual(result.label, 'Medium');
    });

    it('devrait retourner Low pour CFR > 30%', () => {
      const result = getDoraLevel('changeFailureRate', 35);
      assert.strictEqual(result.label, 'Low');
    });

    it('devrait retourner Elite pour MTTR < 1h', () => {
      const result = getDoraLevel('timeToRestore', 0.5);
      assert.strictEqual(result.label, 'Elite');
    });

    it('devrait retourner High pour MTTR 1-24h', () => {
      const result = getDoraLevel('timeToRestore', 12);
      assert.strictEqual(result.label, 'High');
    });

    it('devrait retourner unknown pour métrique inconnue', () => {
      const result = getDoraLevel('unknown', 10);
      assert.strictEqual(result.label, 'Inconnu');
    });
  });

  describe('calculatePearsonCorrelation', () => {
    it('devrait retourner 0 pour tableaux vides', () => {
      const result = calculatePearsonCorrelation([], []);
      assert.strictEqual(result, 0);
    });

    it('devrait retourner 0 pour tableaux de longueurs différentes', () => {
      const result = calculatePearsonCorrelation([1, 2], [1]);
      assert.strictEqual(result, 0);
    });

    it('devrait calculer la corrélation positive', () => {
      const result = calculatePearsonCorrelation([1, 2, 3], [2, 4, 6]);
      assert.strictEqual(result, 1);
    });

    it('devrait calculer la corrélation négative', () => {
      const result = calculatePearsonCorrelation([1, 2, 3], [3, 2, 1]);
      assert.strictEqual(result, -1);
    });
  });

  describe('calculateCorrelation', () => {
    it('devrait calculer les corrélations GEF-DORA', () => {
      const gefScore = 85;
      const doraMetrics = {
        deploymentFrequency: 10,
        leadTime: 2,
        changeFailureRate: 5,
        timeToRestore: 0.5
      };
      
      const result = calculateCorrelation(gefScore, doraMetrics);
      assert.ok(result.deploymentFrequency !== undefined);
      assert.ok(result.leadTime !== undefined);
      assert.ok(result.changeFailureRate !== undefined);
      assert.ok(result.timeToRestore !== undefined);
    });
  });

  describe('getDoraBenchmarks', () => {
    it('devrait retourner tous les benchmarks', () => {
      const result = getDoraBenchmarks();
      assert.ok(result.deploymentFrequency);
      assert.ok(result.leadTime);
      assert.ok(result.changeFailureRate);
      assert.ok(result.timeToRestore);
    });

    it('devrait avoir 4 niveaux pour chaque métrique', () => {
      const result = getDoraBenchmarks();
      assert.ok(result.deploymentFrequency.elite);
      assert.ok(result.deploymentFrequency.high);
      assert.ok(result.deploymentFrequency.medium);
      assert.ok(result.deploymentFrequency.low);
    });
  });
});