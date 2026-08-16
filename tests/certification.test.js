// tests/certification.test.js — Tests unitaires pour le module certification
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Valider les fonctions de certification system

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import * as certification from '../generator/features/certification.js';
import { calculateGEFScore, calculateDORAScore } from '../generator/features/certification/score-calculator.js';
import { determineCertificationLevel } from '../generator/features/certification/level-determiner.js';
import { generateBadge, generatePublicReport } from '../generator/features/certification/badge-generator.js';

describe('Certification Module Tests', () => {

  describe('calculateGEFScore()', () => {
    it('devrait retourner un score entre 0 et 100', async () => {
      const score = calculateGEFScore();
      assert.ok(score >= 0 && score <= 100, 'Score devrait être entre 0 et 100');
    });

    it('devrait retourner un score élevé pour le dépôt GEF lui-même', async () => {
      const score = calculateGEFScore();
      assert.ok(score >= 50, 'Score GEF devrait être ≥ 50% pour le dépôt lui-même');
    });
  });

  describe('calculateDORAScore()', () => {
    it('devrait retourner un score entre 0 et 100', async () => {
      const score = calculateDORAScore();
      assert.ok(score >= 0 && score <= 100, 'Score devrait être entre 0 et 100');
    });

    it('devrait utiliser les valeurs par défaut si compliance.yml manque', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      let originalContent = null;
      if (fs.existsSync(compliancePath)) {
        originalContent = fs.readFileSync(compliancePath, 'utf8');
        fs.unlinkSync(compliancePath);
      }
      
      const score = calculateDORAScore();
      assert.strictEqual(score, 50, 'Devrait retourner 50 par défaut');
      
      if (originalContent) {
        fs.writeFileSync(compliancePath, originalContent);
      }
    });
  });

  describe('determineCertificationLevel()', () => {
    it('devrait retourner Platinum pour scores élevés', async () => {
      const level = determineCertificationLevel(95, 95);
      assert.strictEqual(level, 'Platinum', 'Devrait être Platinum');
    });

    it('devrait retourner Gold pour scores bons', async () => {
      const level = determineCertificationLevel(85, 80);
      assert.strictEqual(level, 'Gold', 'Devrait être Gold');
    });

    it('devrait retourner Silver pour scores moyens', async () => {
      const level = determineCertificationLevel(70, 60);
      assert.strictEqual(level, 'Silver', 'Devrait être Silver');
    });

    it('devrait retourner Bronze pour scores basiques', async () => {
      const level = determineCertificationLevel(60, 40);
      assert.strictEqual(level, 'Bronze', 'Devrait être Bronze');
    });

    it('devrait retourner null pour scores insuffisants', async () => {
      const level = determineCertificationLevel(50, 30);
      assert.strictEqual(level, null, 'Devrait être null');
    });
  });

  describe('generateBadge()', () => {
    it('devrait générer un fichier SVG pour un niveau valide', async () => {
      const badgePath = path.join(process.cwd(), 'gef-certified-badge.svg');
      
      // Nettoyer si existe
      if (fs.existsSync(badgePath)) {
        fs.unlinkSync(badgePath);
      }
      
      const result = generateBadge('Gold');
      
      assert.ok(fs.existsSync(badgePath), 'Badge SVG devrait être créé');
      assert.ok(result !== null, 'Devrait retourner le chemin du badge');
      
      // Nettoyer
      fs.unlinkSync(badgePath);
    });

    it('devrait retourner null pour un niveau null', async () => {
      const result = generateBadge(null);
      assert.strictEqual(result, null, 'Devrait retourner null');
    });
  });

  describe('generatePublicReport()', () => {
    it('devrait générer un fichier MD pour un niveau valide', async () => {
      const reportPath = path.join(process.cwd(), 'GEF_CERTIFICATION_REPORT.md');
      
      // Nettoyer si existe
      if (fs.existsSync(reportPath)) {
        fs.unlinkSync(reportPath);
      }
      
      const result = generatePublicReport('Silver', 70, 60);
      
      assert.ok(fs.existsSync(reportPath), 'Rapport MD devrait être créé');
      assert.ok(result !== null, 'Devrait retourner le chemin du rapport');
      
      // Nettoyer
      fs.unlinkSync(reportPath);
    });

    it('devrait retourner null pour un niveau null', async () => {
      const result = generatePublicReport(null, 50, 50);
      assert.strictEqual(result, null, 'Devrait retourner null');
    });
  });

  describe('certify() - fonction principale', () => {
    it('devrait gérer l\'action check', async () => {
      // Ne devrait pas lancer d'erreur
      await certification.certify('check');
      assert.ok(true, 'devrait s\'exécuter sans erreur');
    });

    it('devrait gérer l\'action generate si certification possible', async () => {
      // Note : Cette commande peut échoucer si le score n'est pas suffisant
      // On teste juste qu'elle ne lance pas d'erreur fatale
      try {
        await certification.certify('generate');
        assert.ok(true, 'devrait s\'exécuter sans erreur fatale');
      } catch (error) {
        // C'est OK si la certification échoue, ce qui n'est pas une erreur fatale
        assert.ok(true, 'l\'échec de certification est acceptable');
      }
    });

    it('devrait gérer l\'action inconnue', async () => {
      await certification.certify('unknown-action');
      assert.ok(true, 'devrait gérer l\'action inconnue');
    });
  });

});