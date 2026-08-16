// tests/compliance.test.js — Tests unitaires pour le module compliance
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Valider les fonctions de compliance as code

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import * as compliance from '../generator/features/compliance.js';

describe('Compliance Module Tests', () => {

  describe('generateComplianceTemplate()', () => {
    it('devrait générer un fichier compliance.yml', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Supprimer le fichier s'il existe déjà
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      compliance.generateComplianceTemplate('Standard');
      
      assert.ok(fs.existsSync(compliancePath), 'compliance.yml devrait être créé');
      
      // Nettoyer
      fs.unlinkSync(compliancePath);
    });

    it('devrait générer avec la bonne stricité', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      compliance.generateComplianceTemplate('Mission Critical');
      
      const content = fs.readFileSync(compliancePath, 'utf8');
      assert.ok(content.includes('Mission Critical'), 'devrait contenir la stricité spécifiée');
      
      fs.unlinkSync(compliancePath);
    });
  });

  describe('validateComplianceFile()', () => {
    it('devrait valider un fichier compliance.yml correct', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      if (!fs.existsSync(compliancePath)) {
        compliance.generateComplianceTemplate('Standard');
      }
      
      const result = compliance.validateComplianceFile();
      
      assert.strictEqual(result.valid, true, 'devrait être valide');
      assert.strictEqual(result.errors.length, 0, 'ne devrait pas avoir d\'erreurs');
    });

    it('devrait détecter un fichier manquant', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Sauvegarder et supprimer
      let originalContent = null;
      if (fs.existsSync(compliancePath)) {
        originalContent = fs.readFileSync(compliancePath, 'utf8');
        fs.unlinkSync(compliancePath);
      }
      
      const result = compliance.validateComplianceFile();
      
      assert.strictEqual(result.valid, false, 'devrait être invalide');
      assert.ok(result.errors.length > 0, 'devrait avoir des erreurs');
      
      // Restaurer
      if (originalContent) {
        fs.writeFileSync(compliancePath, originalContent);
      }
    });
  });

  describe('applyComplianceToHooks()', () => {
    it('devrait retourner false si compliance.yml manque', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      let originalContent = null;
      if (fs.existsSync(compliancePath)) {
        originalContent = fs.readFileSync(compliancePath, 'utf8');
        fs.unlinkSync(compliancePath);
      }
      
      const result = compliance.applyComplianceToHooks();
      
      assert.strictEqual(result, false, 'devrait retourner false');
      
      if (originalContent) {
        fs.writeFileSync(compliancePath, originalContent);
      }
    });

    it('devrait retourner true si compliance.yml existe', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      if (!fs.existsSync(compliancePath)) {
        compliance.generateComplianceTemplate('Standard');
      }
      
      const result = compliance.applyComplianceToHooks();
      
      assert.strictEqual(result, true, 'devrait retourner true');
    });
  });

  describe('applyComplianceToCI()', () => {
    it('devrait retourner false si compliance.yml manque', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      let originalContent = null;
      if (fs.existsSync(compliancePath)) {
        originalContent = fs.readFileSync(compliancePath, 'utf8');
        fs.unlinkSync(compliancePath);
      }
      
      const result = compliance.applyComplianceToCI();
      
      assert.strictEqual(result, false, 'devrait retourner false');
      
      if (originalContent) {
        fs.writeFileSync(compliancePath, originalContent);
      }
    });

    it('devrait retourner true si compliance.yml existe', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      if (!fs.existsSync(compliancePath)) {
        compliance.generateComplianceTemplate('Standard');
      }
      
      const result = compliance.applyComplianceToCI();
      
      assert.strictEqual(result, true, 'devrait retourner true');
    });
  });

  describe('compliance() - fonction principale', () => {
    it('devrait gérer l\'action generate', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      await compliance.compliance('generate');
      
      assert.ok(fs.existsSync(compliancePath), 'devrait créer compliance.yml');
      
      fs.unlinkSync(compliancePath);
    });

    it('devrait gérer l\'action validate', async () => {
      if (!fs.existsSync(path.join(process.cwd(), 'compliance.yml'))) {
        compliance.generateComplianceTemplate('Standard');
      }
      
      // Ne devrait pas lancer d'erreur
      await compliance.compliance('validate');
      
      assert.ok(true, 'devrait s\'exécuter sans erreur');
    });

    it('devrait gérer l\'action inconnue', async () => {
      // Ne devrait pas lancer d'erreur mais afficher un message
      await compliance.compliance('unknown-action');
      
      assert.ok(true, 'devrait gérer l\'action inconnue');
    });
  });

});