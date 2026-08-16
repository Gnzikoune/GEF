// tests/dora-trends.test.js — Tests pour DORA Trends

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateTrends } from '../generator/features/dora-trends.js';
import fs from 'fs';
import path from 'path';

describe('DORA Trends', () => {
  describe('generateTrends', () => {
    it('devrait générer le rapport de tendances', () => {
      const testDir = path.join(process.cwd(), 'test-temp-dora-trends');
      fs.mkdirSync(testDir, { recursive: true });
      const researchDir = path.join(testDir, 'docs', 'research');
      fs.mkdirSync(researchDir, { recursive: true });
      
      // Simuler un dépôt Git avec des commits
      const gitDir = path.join(testDir, '.git');
      fs.mkdirSync(gitDir, { recursive: true });
      
      const originalCwd = process.cwd();
      process.chdir(testDir);
      
      try {
        const resultPath = generateTrends();
        const result = fs.readFileSync(resultPath, 'utf8');
        assert.ok(result.includes('DORA Trends'));
        assert.ok(result.includes('Deployment Frequency'));
        assert.ok(result.includes('Change Failure Rate'));
        assert.ok(result.includes('Time to Restore'));
        assert.ok(result.includes('```mermaid'));
        assert.ok(result.includes('graph LR'));
      } finally {
        process.chdir(originalCwd);
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('devrait inclure des graphiques Mermaid', () => {
      const testDir = path.join(process.cwd(), 'test-temp-dora-trends');
      fs.mkdirSync(testDir, { recursive: true });
      const researchDir = path.join(testDir, 'docs', 'research');
      fs.mkdirSync(researchDir, { recursive: true });
      
      const gitDir = path.join(testDir, '.git');
      fs.mkdirSync(gitDir, { recursive: true });
      
      const originalCwd = process.cwd();
      process.chdir(testDir);
      
      try {
        const resultPath = generateTrends();
        const result = fs.readFileSync(resultPath, 'utf8');
        assert.ok(result.includes('```mermaid'));
        assert.ok(result.includes('graph LR'));
      } finally {
        process.chdir(originalCwd);
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });
  });
});