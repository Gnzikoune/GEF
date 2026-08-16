// generator/features/certification/badge-generator.js — Génération de badges et rapports
// Réf. Issue #89, specs/spec-governance-first-innovation.md
// Objectif : Génération badge SVG et rapport public de certification

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getLevelCriteria } from './level-determiner.js';
import { getDoraBenchmarks, calculateCorrelation, calculateChangeFailureRate, calculateTimeToRestore, getDoraLevel } from '../dora.js';

const ROOT = process.cwd();

/**
 * Génère un badge SVG pour la certification
 */
export function generateBadge(level) {
  console.log(chalk.cyan.bold('\n🎨 Génération du badge de certification...'));
  
  if (!level) {
    console.log(chalk.red('❌ Impossible de générer un badge : aucun niveau certifié'));
    return null;
  }
  
  const criteria = getLevelCriteria(level);
  const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="30">
  <rect width="200" height="30" fill="${criteria.color}" rx="4"/>
  <text x="100" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">
    GEF Certified: ${level}
  </text>
</svg>`;
  
  const badgePath = path.join(ROOT, 'gef-certified-badge.svg');
  fs.writeFileSync(badgePath, badgeSvg, 'utf8');
  
  console.log(chalk.green(`✅ Badge généré : ${badgePath}`));
  
  // Mettre à jour README.md avec le badge
  updateReadmeWithBadge(level);
  
  return badgePath;
}

/**
 * Met à jour le README.md avec le badge de certification
 */
function updateReadmeWithBadge(level) {
  const readmePath = path.join(ROOT, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.log(chalk.yellow('⚠️  README.md non trouvé. Le badge ne sera pas ajouté.'));
    return;
  }
  
  try {
    let content = fs.readFileSync(readmePath, 'utf8');
    const badgeLine = `![GEF Certified: ${level}](gef-certified-badge.svg)`;
    
    // Vérifier si le badge existe déjà
    if (content.includes('GEF Certified:')) {
      // Remplacer le badge existant
      content = content.replace(/!\[GEF Certified: [^\]]+\]\(gef-certified-badge\.svg\)/g, badgeLine);
    } else {
      // Ajouter le badge après le titre principal
      const titleMatch = content.match(/^#\s+.+/m);
      if (titleMatch) {
        const insertPosition = titleMatch.index + titleMatch[0].length;
        content = content.slice(0, insertPosition) + `\n\n${badgeLine}\n` + content.slice(insertPosition);
      }
    }
    
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log(chalk.green('✅ README.md mis à jour avec le badge de certification'));
    
  } catch (err) {
    console.log(chalk.red(`❌ Erreur lors de la mise à jour du README.md : ${err.message}`));
  }
}

/**
 * Génère un rapport public de certification
 */
export function generatePublicReport(level, gefScore, doraScore) {
  console.log(chalk.cyan.bold('\n📄 Génération du rapport public de certification...'));
  
  if (!level) {
    console.log(chalk.red('❌ Impossible de générer un rapport : aucun niveau certifié'));
    return null;
  }
  
  const criteria = getLevelCriteria(level);
  const reportPath = path.join(ROOT, 'GEF_CERTIFICATION_REPORT.md');
  
  // Calculer CFR et MTTR
  const gitHistory = getGitHistory();
  const cfr = calculateChangeFailureRate(gitHistory);
  const mttr = calculateTimeToRestore(ROOT);
  
  // Obtenir les benchmarks
  const benchmarks = getDoraBenchmarks();
  const cfrLevel = getDoraLevel('changeFailureRate', cfr).label;
  const mttrLevel = getDoraLevel('timeToRestore', mttr).label;
  
  // Calculer la corrélation
  const correlation = calculateCorrelation(gefScore, {
    deploymentFrequency: 0,
    leadTime: 0,
    changeFailureRate: cfr,
    timeToRestore: mttr
  });
  
  const reportContent = `# GEF Certification Report

**Certification Level : ${level}**
**Date : ${new Date().toISOString().split('T')[0]}**
**GEF Score : ${gefScore}%**
**DORA Score : ${doraScore}%**

---

## Certification Criteria

|| Criteria | Required | Achieved | Status |
||----------|-----------|----------|--------|
|| GEF Compliance | ${criteria.gef_threshold}% | ${gefScore}% | ${gefScore >= criteria.gef_threshold ? '✅ Pass' : '❌ Fail'} |
|| DORA Metrics | ${criteria.dora_threshold}% | ${doraScore}% | ${doraScore >= criteria.dora_threshold ? '✅ Pass' : '❌ Fail'} |

---

## DORA Metrics Enhancement

### Change Failure Rate (CFR)

**Current Value : ${cfr.toFixed(1)}%**
**Level : ${cfrLevel}**

| Level | Threshold | Current |
|-------|-----------|---------|
| Elite | < 15% | ${cfr < 15 ? '✅' : '❌'} |
| High | 15-20% | ${cfr >= 15 && cfr <= 20 ? '✅' : '❌'} |
| Medium | 21-30% | ${cfr > 20 && cfr <= 30 ? '✅' : '❌'} |
| Low | > 30% | ${cfr > 30 ? '✅' : '❌'} |

### Time to Restore (MTTR)

**Current Value : ${mttr.toFixed(1)} hours**
**Level : ${mttrLevel}**

| Level | Threshold | Current |
|-------|-----------|---------|
| Elite | < 1h | ${mttr < 1 ? '✅' : '❌'} |
| High | 1-24h | ${mttr >= 1 && mttr <= 24 ? '✅' : '❌'} |
| Medium | 1d-1w | ${mttr > 24 && mttr <= 168 ? '✅' : '❌'} |
| Low | > 1w | ${mttr > 168 ? '✅' : '❌'} |

---

## DORA Benchmarks

| Metric | Current | Elite | High | Medium | Low | Level |
|--------|---------|-------|------|--------|-----|-------|
| Change Failure Rate | ${cfr.toFixed(1)}% | < 15% | 15-20% | 21-30% | > 30% | ${cfrLevel} |
| Time to Restore | ${mttr.toFixed(1)}h | < 1h | 1-24h | 1d-1w | > 1w | ${mttrLevel} |

---

## GEF-DORA Correlation

| DORA Metric | Correlation | Interpretation |
|-------------|-------------|----------------|
| Change Failure Rate | ${correlation.changeFailureRate.toFixed(2)} | ${interpretCorrelation(correlation.changeFailureRate)} |
| Time to Restore | ${correlation.timeToRestore.toFixed(2)} | ${interpretCorrelation(correlation.timeToRestore)} |

---

## Description

${criteria.description}

## Audit Trail

This certification was generated using the GEF Compliance as Code framework.

- Compliance file : compliance.yml
- GEF Doctor : npx create-gef doctor
- Date : ${new Date().toISOString()}

---

**Generated by GEF Certification System**
Guardian Engineering Framework v1.19.0
`;
  
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(chalk.green(`✅ Rapport public généré : ${reportPath}`));
  
  return reportPath;
}

/**
 * Interprète la corrélation
 */
function interpretCorrelation(value) {
  if (value > 0.7) return 'Strong positive correlation';
  if (value > 0.3) return 'Moderate positive correlation';
  if (value > -0.3) return 'No significant correlation';
  if (value > -0.7) return 'Moderate negative correlation';
  return 'Strong negative correlation';
}

/**
 * Obtient l'historique Git basique
 */
function getGitHistory() {
  try {
    const { execSync } = require('child_process');
    const log = execSync('git log --all --pretty=format:"%H|%s|%ai" -20', 
                      { encoding: 'utf8', cwd: ROOT });
    const lines = log.trim().split('\n');
    const commits = lines.map(line => {
      const [hash, message, date] = line.split('|');
      return { hash, message, date: new Date(date) };
    });
    return { commits };
  } catch (err) {
    return { commits: [] };
  }
}