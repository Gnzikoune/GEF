import React, { useState, useEffect, useCallback } from 'react';

const TerminalDemo: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  const script = [
    { text: "npx create-gef", delay: 800, type: "input" },
    { text: "🚀 Bienvenue dans le générateur GEF Intelligent", delay: 500, type: "output", color: "#00f0ff" },
    { text: "? Quel est le nom de votre nouveau projet ? my-saas", delay: 900, type: "input" },
    { text: "? Quel Framework principal ? Next.js (React)", delay: 700, type: "input" },
    { text: "? Quelle Base de données ? Supabase", delay: 700, type: "input" },
    { text: "? Quel Cloud Provider ? Vercel", delay: 700, type: "input" },
    { text: "▲ Lancement de create-next-app...", delay: 600, type: "output", color: "#c77dff" },
    { text: "✅ Framework installé.", delay: 400, type: "output", color: "#00ff66" },
    { text: "🎭 Installation de Playwright (TDD E2E)...", delay: 500, type: "output", color: "#c77dff" },
    { text: "✅ Playwright configuré.", delay: 300, type: "output", color: "#00ff66" },
    { text: "📝 Création du template ADR dans docs/adr/...", delay: 400, type: "output", color: "#ffb703" },
    { text: "⚡ Configuration Supabase et migration initiale...", delay: 400, type: "output", color: "#ffb703" },
    { text: "📚 Playbook et Prompts IA copiés dans .gef/...", delay: 400, type: "output", color: "#00f0ff" },
    { text: "🔗 Hooks Git (Conventional Commits + Kanban) installés...", delay: 500, type: "output", color: "#ffb703" },
    { text: "🤖 CI/CD Vercel + release-please générés...", delay: 500, type: "output", color: "#ffb703" },
    { text: "✅ Projet \"my-saas\" scaffoldé avec succès !", delay: 200, type: "output", color: "#00ff66" }
  ];

  useEffect(() => {
    let currentLine = 0;
    
    const nextLine = () => {
      if (currentLine < script.length) {
        const line = script[currentLine];
        setTimeout(() => {
          setLines(prev => [...prev, line.text]);
          currentLine++;
          nextLine();
        }, line.delay);
      } else {
        setIsTyping(false);
      }
    };

    nextLine();
  }, []);

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', margin: '0 auto', overflow: 'hidden' }}>
      {/* Terminal Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#a0a0b0', fontSize: '0.85rem', fontFamily: 'sans-serif' }}>bash — create-gef</div>
      </div>
      
      {/* Terminal Body */}
      <div className="font-mono" style={{ padding: '24px', minHeight: '350px', fontSize: '0.9rem', lineHeight: '1.6' }}>
        {lines.map((line, index) => {
          const scriptLine = script[index];
          const isInput = scriptLine?.type === 'input';
          
          return (
            <div key={index} style={{ marginBottom: '8px', color: scriptLine?.color || '#fff' }}>
              {isInput && <span style={{ color: '#27c93f', marginRight: '8px' }}>$</span>}
              {line}
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'inline-block', width: '8px', height: '16px', background: '#a0a0b0', animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }}></div>
        )}
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TerminalDemo;
