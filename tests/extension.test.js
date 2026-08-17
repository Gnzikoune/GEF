// tests/extension.test.js — Tests unitaires pour le module extension
// Réf. Issue #89, specs/spec-extension-system.md
// Objectif : Valider les fonctions du Extension System

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import * as extension from '../generator/features/extension.js';

describe('Extension Module Tests', () => {

  describe('installExtension()', () => {
    it('devrait installer une extension valide', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Nettoyer si existe
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      const result = await extension.installExtension('healthcare');
      
      assert.strictEqual(result, true, 'L\'installation devrait réussir');
      assert.ok(fs.existsSync(compliancePath), 'compliance.yml devrait être créé');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });

    it('devrait échouer pour une extension invalide', async () => {
      const result = await extension.installExtension('invalid-extension');
      assert.strictEqual(result, false, 'L\'installation devrait échouer');
    });

    it('devrait mettre à jour compliance.yml existant', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml de base en YAML
      const baseConfig = `version: '1.0.0'
gef:
  strictness: Standard
  hard_limits: {}
  security: {}
  git: {}
extensions:
  enabled: []`;
      
      fs.writeFileSync(compliancePath, baseConfig, 'utf8');
      
      const result = await extension.installExtension('finance');
      
      assert.strictEqual(result, true, 'L\'installation devrait réussir');
      
      // Vérifier que l'extension est dans la liste
      const content = fs.readFileSync(compliancePath, 'utf8');
      assert.ok(content.includes('finance'), 'L\'extension devrait être dans compliance.yml');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });
  });

  describe('listExtensions()', () => {
    it('devrait lister les extensions disponibles', async () => {
      const result = await extension.listExtensions();
      
      assert.ok(result.available, 'Devrait retourner les extensions disponibles');
      assert.ok(result.available.includes('healthcare'), 'Healthcare devrait être disponible');
      assert.ok(result.available.includes('finance'), 'Finance devrait être disponible');
      assert.ok(result.available.includes('security'), 'Security devrait être disponible');
    });

    it('devrait lister les extensions installées', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml avec une extension installée en YAML
      const config = `version: '1.0.0'
gef:
  strictness: Standard
extensions:
  enabled:
    - healthcare`;
      
      fs.writeFileSync(compliancePath, config, 'utf8');
      
      const result = await extension.listExtensions();
      
      assert.ok(result.installed.includes('healthcare'), 'Healthcare devrait être installée');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });

    it('devrait retourner vide si aucune extension installée', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml sans extension
      const config = {
        version: '1.0.0',
        gef: {
          strictness: 'Standard'
        },
        extensions: {
          enabled: []
        }
      };
      
      fs.writeFileSync(compliancePath, JSON.stringify(config), 'utf8');
      
      const result = await extension.listExtensions();
      
      assert.strictEqual(result.installed.length, 0, 'Aucune extension ne devrait être installée');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });
  });

  describe('removeExtension()', () => {
    it('devrait désinstaller une extension installée', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml avec une extension installée
      const config = {
        version: '1.0.0',
        gef: {
          strictness: 'Standard'
        },
        extensions: {
          enabled: ['healthcare']
        }
      };
      
      fs.writeFileSync(compliancePath, JSON.stringify(config), 'utf8');
      
      const result = await extension.removeExtension('healthcare');
      
      assert.strictEqual(result, true, 'La désinstallation devrait réussir');
      
      // Vérifier que l'extension n'est plus dans la liste
      const content = fs.readFileSync(compliancePath, 'utf8');
      assert.ok(!content.includes('healthcare'), 'L\'extension ne devrait plus être dans compliance.yml');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });

    it('devrait échouer si compliance.yml manque', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // S'assurer que le fichier n'existe pas
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      const result = await extension.removeExtension('healthcare');
      assert.strictEqual(result, false, 'La désinstallation devrait échouer');
    });

    it('devrait échouer si extension non installée', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml sans extension
      const config = {
        version: '1.0.0',
        gef: {
          strictness: 'Standard'
        },
        extensions: {
          enabled: []
        }
      };
      
      fs.writeFileSync(compliancePath, JSON.stringify(config), 'utf8');
      
      const result = await extension.removeExtension('healthcare');
      assert.strictEqual(result, false, 'La désinstallation devrait échouer');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });
  });

  describe('extension() - fonction principale', () => {
    it('devrait gérer l\'action install', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Nettoyer si existe
      if (fs.existsSync(compliancePath)) {
        fs.unlinkSync(compliancePath);
      }
      
      await extension.extension('install', 'security');
      
      assert.ok(fs.existsSync(compliancePath), 'compliance.yml devrait être créé');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
    });

    it('devrait gérer l\'action list', async () => {
      // Ne devrait pas lancer d'erreur
      await extension.extension('list');
      assert.ok(true, 'devrait s\'exécuter sans erreur');
    });

    it('devrait gérer l\'action remove', async () => {
      const compliancePath = path.join(process.cwd(), 'compliance.yml');
      
      // Créer un compliance.yml avec une extension
      const config = {
        version: '1.0.0',
        gef: {
          strictness: 'Standard'
        },
        extensions: {
          enabled: ['healthcare']
        }
      };
      
      fs.writeFileSync(compliancePath, JSON.stringify(config), 'utf8');
      
      await extension.extension('remove', 'healthcare');
      
      // Nettoyer
      if (fs.existsSync(compliancePath)) {
        try {
          fs.unlinkSync(compliancePath);
        } catch (err) {
          // Ignorer les erreurs de permission dans les tests
        }
      }
      
      assert.ok(true, 'devrait s\'exécuter sans erreur');
    });

    it('devrait gérer l\'action inconnue', async () => {
      await extension.extension('unknown-action');
      assert.ok(true, 'devrait gérer l\'action inconnue');
    });
  });

});