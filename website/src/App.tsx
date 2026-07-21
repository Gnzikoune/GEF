import React from 'react';
import FeatureCard from './components/FeatureCard';
import './index.css';

function App() {
  return (
    <>
      <div className="bg-gradients"></div>
      
      <div className="container">
        {/* Navigation */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', marginBottom: '4rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>GEF.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://github.com/Gnzikoune/GEF" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>GitHub</a>
            <a href="https://npmjs.com/package/create-gef" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>NPM</a>
          </div>
        </nav>

        {/* Hero Section */}
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '6rem' }}>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(157, 78, 221, 0.1)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '100px', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem' }}>
            v1.0.0 est disponible sur npm 🚀
          </div>
          
          <h1 style={{ maxWidth: '800px' }}>
            L'ingénierie stricte,<br />
            installée en 10 secondes.
          </h1>
          
          <p style={{ maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '1.25rem' }}>
            Guardian Engineering Framework transforme les règles de travail en outils automatisés. Obtenez une traçabilité, une sécurité et une qualité absolues dès le premier commit.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
            <button className="btn-primary" onClick={() => navigator.clipboard.writeText('npx create-gef')}>
              <span style={{ marginRight: '8px' }}>📋</span> npx create-gef
            </button>
            <a href="#features" className="btn-secondary">Découvrir les fonctionnalités</a>
          </div>

          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-glass)', boxShadow: '0 0 60px rgba(157, 78, 221, 0.15)' }}>
            {/* Remplacer src par le chemin de votre vidéo une fois filmée */}
            <video
              autoPlay
              loop
              muted
              playsInline
              src=""
              style={{ width: '100%', display: 'block', background: '#0d0d14' }}
            />
            {/* Placeholder affiché tant que la vidéo n'est pas définie */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(10, 10, 15, 0.92)',
              gap: '1rem',
              minHeight: '380px'
            }}>
              <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>🎬</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                Démo vidéo à venir
              </p>
              <p style={{ color: 'rgba(160,160,176,0.4)', fontSize: '0.8rem' }}>
                Remplacez <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>src=""</code> dans <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>App.tsx</code> par le chemin de votre fichier .mp4
              </p>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" style={{ padding: '4rem 0' }}>
          <h2>Pourquoi utiliser le GEF ?</h2>
          <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Oubliez les configurations manuelles et les copier-coller. GEF orchestre intelligemment votre stack technique et impose les bonnes pratiques.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <FeatureCard 
              icon="⚡" 
              title="Scaffolding Intelligent" 
              description="Aucun choix imposé. Next.js, Vite, Express ou FastAPI lancés nativement, puis la surcouche GEF appliquée par dessus." 
            />
            <FeatureCard 
              icon="🔒" 
              title="Sécurité par Défaut" 
              description="Hooks Git installés automatiquement. Les commits sans référence Kanban (#42) ou sans format Conventional Commits sont bloqués." 
            />
            <FeatureCard 
              icon="🤖" 
              title="Autonomie IA" 
              description="Le Playbook et les prompts sont copiés dans .gef/ de chaque projet. L'IA est cadré dès la première session." 
            />
            <FeatureCard 
              icon="🔄" 
              title="CI/CD + Release Please" 
              description="Pipeline GitHub Actions sur-mesure ET automatisation des tags et notes de version générés depuis vos commits." 
            />
            <FeatureCard 
              icon="📋" 
              title="Kanban Autonome" 
              description="L'IA crée ses propres tickets GitHub, lie ses commits, ouvre les Pull Requests et attend votre validation avant de merger." 
            />
            <FeatureCard 
              icon="📝" 
              title="Auto-Documentation ADR" 
              description="Chaque décision architecturale est obligatoirement documentée dans docs/explanation/adr/ avant la première ligne de code." 
            />
            <FeatureCard 
              icon="🎭" 
              title="TDD Piloté par l'IA" 
              description="Playwright installé nativement. L'IA écrit le test E2E avant le code applicatif pour garantir une qualité incassable." 
            />
            <FeatureCard 
              icon="🧠" 
              title="Hard Limits Adaptatifs" 
              description="3 niveaux de sévérité : Startup (souple), Enterprise (standard) ou Mission Critical (ultra-strict). Les Prompts IA sont calibrés automatiquement selon le niveau choisi." 
            />
            <FeatureCard 
              icon="🍷" 
              title="Stratégie Git Configurable" 
              description="GitHub Flow (PRs obligatoires, main verrouillé) ou Trunk-Based Development. Le hook pre-push est généré à la volée selon votre choix." 
            />
            <FeatureCard 
              icon="🧹" 
              title="Linter clé en main" 
              description="Biome, ESLint+Prettier, ou Ruff (Python). Le générateur écrit les fichiers de config et connecte les commandes au pre-commit automatiquement." 
            />
          </div>
        </section>

        {/* Commands Section */}
        <section style={{ padding: '4rem 0' }}>
          <h2>4 commandes. C'est tout.</h2>
          <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Un CLI simple, lisible, et entièrement documentable depuis votre terminal.
          </p>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { cmd: 'npx create-gef', desc: 'Lance le générateur interactif et crée un nouveau projet' },
              { cmd: 'npx create-gef update', desc: 'Met à jour le Playbook, Prompts et Hooks dans un projet existant' },
              { cmd: 'npx create-gef --help', desc: 'Affiche toutes les commandes et options disponibles' },
              { cmd: 'npx create-gef --version', desc: 'Affiche la version actuelle du framework' },
            ].map(({ cmd, desc }) => (
              <div key={cmd} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: '12px', gap: '1rem', flexWrap: 'wrap'
              }}>
                <code style={{ fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.95rem' }}>{cmd}</code>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer style={{ marginTop: '6rem', padding: '2rem 0', borderTop: '1px solid var(--border-glass)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>© {new Date().getFullYear()} Guardian Engineering Framework. MIT License.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
