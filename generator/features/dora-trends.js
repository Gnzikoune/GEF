// generator/features/dora-trends.js — Génération de graphiques de tendance DORA
// Réf. specs/spec-dora-metrics-enhancement.md
// Objectif : Générer des graphiques Mermaid pour les métriques DORA sur 30 jours

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { calculateChangeFailureRate, calculateTimeToRestore } from './dora.js';

const ROOT = process.cwd();

/**
 * Génère les tendances DORA et les graphiques Mermaid
 */
export function generateTrends() {
  console.log(chalk.bold.cyan('📈 Génération des tendances DORA...\n'));
  
  const gitHistory = getGitHistory();
  const trends = calculateTrendsData(gitHistory);
  
  const reportPath = path.join(ROOT, 'docs', 'research', 'DORA_TRENDS.md');
  const reportContent = generateTrendsReport(trends);
  
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  
  console.log(chalk.green(`✅ Rapport de tendances généré : ${reportPath}`));
  return reportPath;
}

/**
 * Calcule les données de tendance sur 30 jours
 */
function calculateTrendsData(gitHistory) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const commits = gitHistory.commits.filter(c => new Date(c.date) >= thirtyDaysAgo);
  
  // Regrouper par semaine (4 semaines)
  let weeklyData = {
    deploymentFrequency: [0, 0, 0, 0],
    changeFailureRate: [0, 0, 0, 0],
    timeToRestore: [0, 0, 0, 0]
  };
  
  let weekStart = new Date(thirtyDaysAgo);
  
  for (let week = 0; week < 4; week++) {
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const weekCommits = commits.filter(c => {
      const date = new Date(c.date);
      return date >= weekStart && date < weekEnd;
    });
    
    // Deployment Frequency
    weeklyData.deploymentFrequency[week] = weekCommits.filter(c => 
      c.message.toLowerCase().includes('deploy')
    ).length;
    
    // Change Failure Rate
    const deploys = weekCommits.filter(c => 
      c.message.toLowerCase().includes('deploy')
    ).length;
    const failures = weekCommits.filter(c => 
      c.message.toLowerCase().includes('rollback') || 
      c.message.toLowerCase().includes('hotfix') ||
      c.message.toLowerCase().includes('revert')
    ).length;
    weeklyData.changeFailureRate[week] = deploys > 0 ? (failures / deploys) * 100 : 0;
    
    // Time to Restore (estimé depuis RESEARCH_LOG)
    weeklyData.timeToRestore[week] = calculateTimeToRestore(ROOT);
    
    weekStart = weekEnd;
  }
  
  return weeklyData;
}

/**
 * Génère le rapport de tendances avec graphiques Mermaid
 */
function generateTrendsReport(trends) {
  const now = new Date();
  const weekLabels = [];
  let weekStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 4; i++) {
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    weekLabels.push(`${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`);
    weekStart = weekEnd;
  }
  
  return `# DORA Trends - 30 Days

**Generated : ${now.toISOString().split('T')[0]}**
**Period : Last 30 days**

---

## Deployment Frequency Trend

\`\`\`mermaid
%%{init: {'theme':'base'}}%%
graph LR
    title["Deployment Frequency - 30 days"]
    w1["Week 1: ${trends.deploymentFrequency[0]} deploys"]
    w2["Week 2: ${trends.deploymentFrequency[1]} deploys"]
    w3["Week 3: ${trends.deploymentFrequency[2]} deploys"]
    w4["Week 4: ${trends.deploymentFrequency[3]} deploys"]
    w1 --> w2 --> w3 --> w4
\`\`\`

---

## Change Failure Rate Trend

\`\`\`mermaid
%%{init: {'theme':'base'}}%%
graph LR
    title["Change Failure Rate - 30 days"]
    w1["Week 1: ${trends.changeFailureRate[0].toFixed(1)}%"]
    w2["Week 2: ${trends.changeFailureRate[1].toFixed(1)}%"]
    w3["Week 3: ${trends.changeFailureRate[2].toFixed(1)}%"]
    w4["Week 4: ${trends.changeFailureRate[3].toFixed(1)}%"]
    w1 --> w2 --> w3 --> w4
\`\`\`

---

## Time to Restore Trend

\`\`\`mermaid
%%{init: {'theme':'base'}}%%
graph LR
    title["Time to Restore - 30 days"]
    w1["Week 1: ${trends.timeToRestore[0].toFixed(1)}h"]
    w2["Week 2: ${trends.timeToRestore[1].toFixed(1)}h"]
    w3["Week 3: ${trends.timeToRestore[2].toFixed(1)}h"]
    w4["Week 4: ${trends.timeToRestore[3].toFixed(1)}h"]
    w1 --> w2 --> w3 --> w4
\`\`\`

---

## Summary

| Week | Deployment Frequency | Change Failure Rate | Time to Restore |
|------|---------------------|---------------------|------------------|
| 1 | ${trends.deploymentFrequency[0]} | ${trends.changeFailureRate[0].toFixed(1)}% | ${trends.timeToRestore[0].toFixed(1)}h |
| 2 | ${trends.deploymentFrequency[1]} | ${trends.changeFailureRate[1].toFixed(1)}% | ${trends.timeToRestore[1].toFixed(1)}h |
| 3 | ${trends.deploymentFrequency[2]} | ${trends.changeFailureRate[2].toFixed(1)}% | ${trends.timeToRestore[2].toFixed(1)}h |
| 4 | ${trends.deploymentFrequency[3]} | ${trends.changeFailureRate[3].toFixed(1)}% | ${trends.timeToRestore[3].toFixed(1)}h |

---

**Generated by GEF DORA Trends**
Guardian Engineering Framework v1.19.0
`;
}

/**
 * Obtient l'historique Git basique
 */
function getGitHistory() {
  try {
    const { execSync } = require('child_process');
    const log = execSync('git log --all --pretty=format:"%H|%s|%ai" -100', 
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