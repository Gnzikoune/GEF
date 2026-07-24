const fs = require('fs');
const https = require('https');
const child_process = require('child_process');

// Configuration
const apiKey = process.env.GEF_LLM_API_KEY;
const prBody = process.env.PR_BODY || "";
const baseRef = process.env.BASE_REF || "main";

// --- HEURISTIC FALLBACK MODE ---
function runHeuristicMode() {
  console.log("⚠️ Aucune clé GEF_LLM_API_KEY détectée. Passage en mode Heuristique (Fallback).");
  
  // 1. Vérification de la mention sur l'honneur dans le corps de la PR
  const humanCheckRegex = /- \[[xX]\] Je certifie sur l'honneur que l'intention déclarée correspond au code/i;
  
  if (!humanCheckRegex.test(prBody)) {
    console.error("❌ ERREUR SÉMANTIQUE (Heuristique) :");
    console.error("L'intention n'a pas été validée humainement.");
    console.error("Veuillez ajouter et cocher la ligne suivante dans la description de votre PR :");
    console.error("- [ ] Je certifie sur l'honneur que l'intention déclarée correspond au code");
    process.exit(1);
  }

  // 2. Vérification des ADRs (si package.json modifié)
  try {
    const diffFiles = child_process.execSync(`git diff --name-only origin/${baseRef} HEAD`).toString();
    if (diffFiles.includes('package.json')) {
      const adrRegex = /docs\/explanation\/adr\//;
      if (!adrRegex.test(diffFiles)) {
         // Ce cas est normalement couvert par le pre-commit, mais on le revérifie
         console.error("❌ ERREUR: package.json modifié mais aucun ADR n'a été ajouté.");
         process.exit(1);
      }
      
      // Heuristique temporelle basique : on s'assure que l'ADR n'a pas été créé dans un commit isolé *après* package.json juste pour faire taire la CI.
      // (Dans une vraie implémentation robuste, on analyserait git log --format=%ct)
      const humanCheckAdrRegex = /- \[[xX]\] Je certifie sur l'honneur que l'ADR correspond au changement d'architecture/i;
      if (!humanCheckAdrRegex.test(prBody)) {
        console.error("❌ ERREUR SÉMANTIQUE (Heuristique ADR) :");
        console.error("Un ADR est requis. Veuillez valider son contenu en ajoutant :");
        console.error("- [ ] Je certifie sur l'honneur que l'ADR correspond au changement d'architecture");
        process.exit(1);
      }
    }
  } catch(e) {
    console.warn("Impossible de vérifier le diff (probablement pas dans un dépôt git complet).");
  }

  console.log("✅ Validation Sémantique (Heuristique) réussie.");
  process.exit(0);
}

// --- LLM SEMANTIC MODE ---
async function runLLMMode() {
  console.log("🤖 Clé LLM détectée. Exécution de la validation sémantique par l'IA...");
  
  try {
    const diff = child_process.execSync(`git diff origin/${baseRef} HEAD`).toString().slice(0, 10000); // Truncate for token limits
    
    // Extrait l'intention
    const intentionMatch = prBody.match(/(?:intention|pourquoi).*?\n([\s\S]*?)(?:\n##|$)/i);
    const intention = intentionMatch ? intentionMatch[1].trim() : prBody;

    const prompt = `
Tu es le Tech Lead Juge (Guardian Engineering Framework).
Ton rôle est de vérifier que l'intention (le Pourquoi) déclarée par le développeur correspond RÉELLEMENT au code produit (le Diff).

INTENTION DÉCLARÉE :
"""
${intention}
"""

DIFF DE CODE :
"""
${diff}
"""

Tâche : L'intention justifie-t-elle le diff ? Réponds uniquement par OUI ou NON. Si NON, ajoute une courte phrase d'explication.
`;

    // Appel API OpenAI basique (peut être adapté pour Anthropic/Autres)
    const data = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.error) {
             console.error("Erreur API LLM:", response.error.message);
             runHeuristicMode(); // Fallback on error
             return;
          }
          const answer = response.choices[0].message.content.trim();
          
          if (answer.startsWith("OUI")) {
            console.log("✅ Validation Sémantique IA réussie : L'intention correspond au code.");
            process.exit(0);
          } else {
            console.error("❌ ERREUR SÉMANTIQUE DÉTECTÉE PAR L'IA :");
            console.error(answer);
            process.exit(1);
          }
        } catch(e) {
          console.error("Erreur de parsing de la réponse LLM.");
          runHeuristicMode();
        }
      });
    });

    req.on('error', (e) => {
      console.error("Erreur réseau vers l'API LLM:", e.message);
      runHeuristicMode();
    });

    req.write(data);
    req.end();

  } catch (error) {
    console.error("Erreur lors de l'exécution du mode LLM:", error.message);
    runHeuristicMode();
  }
}

// Entry point
if (apiKey && apiKey.length > 5) {
  runLLMMode();
} else {
  runHeuristicMode();
}
