import React, { useState, useEffect } from 'react';

const TerminalDemo: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  const script = [
    { text: "npx create-gef", delay: 800, type: "input" },
    { text: "🚀 Bienvenue dans le générateur GEF Intelligent", delay: 500, type: "output", color: "#00f0ff" },
    { text: "? Quel est le nom de votre nouveau projet ? my-awesome-app", delay: 1000, type: "input" },
    { text: "? Dans quelle phase se situe ce projet ? Prototype (R&D)", delay: 800, type: "input" },
    { text: "? Quel Framework principal voulez-vous installer ? Next.js (React)", delay: 800, type: "input" },
    { text: "? Quelle Base de données principale ? Supabase", delay: 800, type: "input" },
    { text: "📦 Installation du framework : Next.js (React)...", delay: 600, type: "output", color: "#c77dff" },
    { text: "✅ Framework installé.", delay: 400, type: "output", color: "#00ff66" },
    { text: "📁 Application de la surcouche GEF (Architecture & Config)...", delay: 400, type: "output", color: "#ffb703" },
    { text: "⚡ Génération de la configuration Supabase...", delay: 400, type: "output", color: "#ffb703" },
    { text: "📚 Ajout du Playbook et des Prompts IA locaux...", delay: 400, type: "output", color: "#00f0ff" },
    { text: "🔗 Initialisation Git et installation des hooks de sécurité...", delay: 500, type: "output", color: "#ffb703" },
    { text: "🤖 Génération du pipeline CI/CD adapté à votre stack...", delay: 500, type: "output", color: "#ffb703" },
    { text: "✅ Projet \"my-awesome-app\" scaffoldé avec succès !", delay: 200, type: "output", color: "#00ff66" }
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
