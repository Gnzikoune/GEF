import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'translateY(-5px)';
           e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(157, 78, 221, 0.2)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'translateY(0)';
           e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
         }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
};

export default FeatureCard;
