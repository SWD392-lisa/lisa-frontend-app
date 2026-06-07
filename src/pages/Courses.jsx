import React, { useState } from 'react';
import { Play, Pause, Lock, Sparkles, X, ChevronRight, RotateCcw } from 'lucide-react';
import './Courses.css';

// Language Specific Levels Data
const languageLevels = {
  English: [
    { level: '1', title: 'Survival Speaking', desc: 'Master basic words and essentials.', x: 400, y: 80, side: 'right', unlocked: true },
    { level: '2', title: 'Daily Interactions', desc: 'Schedules, ordering food, and travel.', x: 200, y: 240, side: 'right', unlocked: true },
    { level: '3', title: 'Professional Intro', desc: 'Introduce yourself in workplaces.', x: 600, y: 410, side: 'left', unlocked: false },
    { level: '4', title: 'Business Pitching', desc: 'Deliver basic proposals and ideas.', x: 200, y: 580, side: 'right', unlocked: false },
    { level: '5', title: 'Debating & Arguing', desc: 'State opinions and counter-arguments.', x: 400, y: 750, side: 'left', unlocked: false },
    { level: '6', title: 'Fluent Mastery', desc: 'Speak like a native with slang/slurs.', x: 400, y: 920, side: 'right', unlocked: false }
  ],
  Chinese: [
    { level: '1', title: 'Survival Pinyin', desc: 'Learn Pinyin and initials.', x: 400, y: 80, side: 'right', unlocked: true },
    { level: '2', title: 'Tones & Greetings', desc: 'Master tones and everyday hellos.', x: 200, y: 240, side: 'right', unlocked: true },
    { level: '3', title: 'Shopping & Dining', desc: 'Ask for prices and order food.', x: 600, y: 410, side: 'left', unlocked: false },
    { level: '4', title: 'City Navigation', desc: 'Ask for directions and take cabs.', x: 200, y: 580, side: 'right', unlocked: false },
    { level: '5', title: 'Social Interactions', desc: 'Talk about hobbies and make friends.', x: 400, y: 750, side: 'left', unlocked: false },
    { level: '6', title: 'Business HSK 5+', desc: 'Discuss HSK business negotiations.', x: 400, y: 920, side: 'right', unlocked: false }
  ],
  Japanese: [
    { level: '1', title: 'Hiragana & Katakana', desc: 'Read and write core characters.', x: 400, y: 80, side: 'right', unlocked: true },
    { level: '2', title: 'Basic Greetings', desc: 'Daily expressions and bowing cues.', x: 200, y: 240, side: 'right', unlocked: true },
    { level: '3', title: 'Anime & Manga Chat', desc: 'Discuss popular pop-culture phrases.', x: 600, y: 410, side: 'left', unlocked: false },
    { level: '4', title: 'JLPT N5 Survival', desc: 'Core grammar for basic travel.', x: 200, y: 580, side: 'right', unlocked: false },
    { level: '5', title: 'JLPT N4 Communication', desc: 'Express desires and possibilities.', x: 400, y: 750, side: 'left', unlocked: false },
    { level: '6', title: 'Native Refinements', desc: 'Honorifics and natural sentence flows.', x: 400, y: 920, side: 'right', unlocked: false }
  ]
};

export const Courses = () => {
  const [selectedLang, setSelectedLang] = useState('English');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const activeLevels = languageLevels[selectedLang];

  const handlePlayPreview = (e) => {
    e.stopPropagation();
    setIsPlayerOpen(true);
    setIsPlayingAudio(true);
  };

  const toggleAudioPlayback = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="courses-page">
      {/* 3D Blurry background blobs */}
      <div className="courses-aurora-bg">
        <div className="courses-blob courses-blob--1"></div>
        <div className="courses-blob courses-blob--2"></div>
        <div className="courses-blob courses-blob--3"></div>
      </div>

      <main className="courses-boxed-container">
        
        {/* Hero Section */}
        <section className="courses-hero">
          <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Gamified Learning</span>
          <h1>100-Level Language Journey</h1>
          
          {/* Capsule Language Toggle */}
          <div className="lang-toggle-container">
            <div className="lang-toggle-capsule">
              {Object.keys(languageLevels).map((lang) => (
                <button
                  key={lang}
                  className={`lang-toggle-btn ${selectedLang === lang ? 'is-active' : ''}`}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Skill Tree Map Section */}
        <section className="skill-tree-section">
          <div className="skill-tree-container">
            
            {/* SVG Interactive dashed path */}
            <div className="timeline-svg-container">
              <svg viewBox="0 0 800 1000" preserveAspectRatio="none" className="timeline-svg">
                {/* Background path line */}
                <path 
                  d="M 400,80 C 250,150 150,210 200,240 C 250,270 550,350 600,410 C 650,470 250,530 200,580 C 150,640 350,690 400,750 C 450,810 400,870 400,920" 
                  className="svg-path-dashed" 
                />
                {/* Active animated overlay path from level 1 to level 2 */}
                <path 
                  d="M 400,80 C 250,150 150,210 200,240" 
                  className="svg-path-active" 
                />
              </svg>
            </div>

            {/* Render Nodes along path */}
            {activeLevels.map((stage) => (
              <div 
                key={stage.level} 
                className="skill-node"
                style={{ left: `${(stage.x / 800) * 100}%`, top: `${stage.y}px` }}
              >
                {/* Node center dot */}
                <div className={`node-dot ${stage.unlocked ? 'node-dot--unlocked' : 'node-dot--locked'}`}>
                  {stage.unlocked ? (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--white)' }} />
                  ) : (
                    <Lock size={12} />
                  )}
                  
                  {/* Floating play button for Level 1 */}
                  {stage.level === '1' && stage.unlocked && (
                    <button 
                      className="play-btn-float" 
                      onClick={handlePlayPreview}
                      aria-label="Play sample audio"
                    >
                      <Play size={12} style={{ fill: 'currentColor', marginLeft: '1px' }} />
                    </button>
                  )}
                </div>

                {/* Floating Glass Card Details */}
                <div 
                  className={`node-glass-card ${!stage.unlocked ? 'is-locked' : ''} ${stage.side === 'left' ? 'node-glass-card--left' : 'node-glass-card--right'}`}
                >
                  <div className="card-level-badge">Lvl {stage.level}</div>
                  <h3 className="card-node-title">{stage.title}</h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-black-soft)', margin: '4px 0 0', lineHeight: '1.4' }}>
                    {stage.desc}
                  </p>
                </div>
                
                {/* Tooltip for locked nodes */}
                {!stage.unlocked && (
                  <div className="locked-tooltip">
                    🔒 Complete the previous level to unlock this topic
                  </div>
                )}
              </div>
            ))}

            {/* Final CTA Block at the end of the road */}
            <div className="final-cta-block">
              <h3>Ready to conquer this journey?</h3>
              <p>Take the Placement Test and let our AI determine your starting Level right now!</p>
              <button className="final-cta-btn">Start Placement Test</button>
            </div>

            {/* LUCY AI Copilot Floating Card */}
            <div className="copilot-floating-card">
              <div className="copilot-header">
                <div className="copilot-badge">
                  <Sparkles size={14} style={{ fill: 'currentColor' }} />
                  <span>AI Agent</span>
                </div>
                <div className="copilot-visualizer">
                  <span className="copilot-visualizer-bar" style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}></span>
                  <span className="copilot-visualizer-bar" style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}></span>
                  <span className="copilot-visualizer-bar" style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}></span>
                  <span className="copilot-visualizer-bar" style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}></span>
                  <span className="copilot-visualizer-bar" style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}></span>
                </div>
              </div>
              
              <h3 className="copilot-title-gradient">Generative AI Copilot</h3>
              <p className="copilot-desc">
                Our AI Copilot continuously listens as your Thought Partner, analyzing pronunciation blind spots and dynamically restructuring your Skill Tree in real-time.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-accent)', cursor: 'pointer' }}>
                <span>Copilot Settings</span>
                <ChevronRight size={14} />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Floating Audio Preview Player Modal */}
      {isPlayerOpen && (
        <div className="audio-modal-overlay" onClick={() => setIsPlayerOpen(false)}>
          <div className="audio-player-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="audio-player-close" 
              onClick={() => setIsPlayerOpen(false)}
              aria-label="Close player"
            >
              <X size={18} />
            </button>
            
            <div className={`audio-player-disc ${isPlayingAudio ? 'disc-spinning' : ''}`}>
              <Sparkles size={28} />
            </div>
            
            <h3 className="audio-player-title">Survival Speaking Preview</h3>
            <p className="audio-player-subtitle">{selectedLang} • Level 1 cohort room audio</p>
            
            <div className="audio-player-progress-container">
              <div 
                className="audio-player-progress-bar" 
                style={{ animationPlayState: isPlayingAudio ? 'running' : 'paused' }}
              ></div>
            </div>
            
            <div className="audio-player-controls">
              <button className="audio-control-btn" aria-label="Rewind">
                <RotateCcw size={20} />
              </button>
              <button 
                className="audio-control-btn audio-control-btn--play" 
                onClick={toggleAudioPlayback}
                aria-label={isPlayingAudio ? 'Pause' : 'Play'}
              >
                {isPlayingAudio ? (
                  <Pause size={24} style={{ fill: 'currentColor' }} />
                ) : (
                  <Play size={24} style={{ fill: 'currentColor', marginLeft: '3px' }} />
                )}
              </button>
              <button className="audio-control-btn" style={{ opacity: 0.3 }} disabled aria-label="Skip forward">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
