import React from 'react';
import TerminalDemo from './components/TerminalDemo';
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
            <a href="https://github.com/votre-compte/GEF" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>GitHub</a>
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
            Gildas Engineering Framework transforme les règles de travail en outils automatisés. Obtenez une traçabilité, une sécurité et une qualité absolues dès le premier commit.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
            <button className="btn-primary" onClick={() => navigator.clipboard.writeText('npx create-gef')}>
              <span style={{ marginRight: '8px' }}>📋</span> npx create-gef
            </button>
            <a href="#features" className="btn-secondary">Découvrir les fonctionnalités</a>
          </div>

          <TerminalDemo />
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
              description="Chaque décision architecturale est obligatoirement documentée dans docs/adr/ avant la première ligne de code." 
            />
            <FeatureCard 
              icon="🎭" 
              title="TDD Piloté par l'IA" 
              description="Playwright installé nativement. L'IA écrit le test E2E avant le code applicatif pour garantir une qualité incassable." 
            />
          </div>
        </section>
        
        {/* Footer */}
        <footer style={{ marginTop: '6rem', padding: '2rem 0', borderTop: '1px solid var(--border-glass)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>© {new Date().getFullYear()} Gildas Engineering Framework. MIT License.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
