import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Crown } from 'lucide-react';

const stages = [
  { level: '1-30', title: 'Beginner', desc: 'Build core vocabulary and essential grammar foundations', icon: <Zap className="w-6 h-6" />, bg: '#d4e9e2', color: '#00754A' },
  { level: '31-70', title: 'Intermediate', desc: 'Communicate fluently on everyday topics', icon: <Award className="w-6 h-6" />, bg: '#faf6ee', color: '#cba258' },
  { level: '71-100', title: 'Advanced', desc: 'Master the language and speak like a native', icon: <Crown className="w-6 h-6" />, bg: '#fdf3f2', color: '#c82014' },
];

export const RoadmapSection = () => {
  return (
    <section className="roadmap-section">
      <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Gamified Timeline</span>
      <h2 className="section-title" style={{ marginBottom: '40px' }}>Conquer 100 Language Levels</h2>
      
      <div className="roadmap-timeline">
        {/* Connector Line */}
        <div className="timeline-connector"></div>
        
        <div className="timeline-grid">
          {stages.map((stage, index) => (
            <div key={index} className="timeline-node">
              <div 
                className="node-icon-wrapper"
                style={{ backgroundColor: stage.bg, color: stage.color }}
              >
                {stage.icon}
              </div>
              <div className="node-card">
                <div className="node-number">0{index + 1}</div>
                <div className="node-level-pill">
                  Lvl {stage.level}
                </div>
                <h3 className="node-title">{stage.title}</h3>
                <p className="node-desc">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="roadmap-cta">
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button 
            className="sb-button sb-button--primary-filled"
            style={{ 
              padding: '14px 36px', 
              fontSize: '1.8rem',
              boxShadow: '0 6px 20px rgba(0, 117, 74, 0.15)'
            }}
          >
            Create Persona & Start Now
          </button>
        </Link>
      </div>
    </section>
  );
};

