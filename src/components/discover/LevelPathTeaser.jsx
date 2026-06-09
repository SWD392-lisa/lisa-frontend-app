import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import './LevelPathTeaser.css';

export const LevelPathTeaser = () => {
  return (
    <div className="level-teaser-wrapper">
      <div className="level-teaser-container">
        
        {/* Left Column: Text Content */}
        <div className="level-teaser-left">
          <div className="level-teaser-tag">
            <Sparkles size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} /> 
            Gamified Learning
          </div>
          <h2>Hành trình 100 Cấp độ</h2>
          <p className="level-teaser-desc">
            Học ngôn ngữ như một trò chơi thực thụ. Vượt qua từng chặng đàm thoại, 
            mở khóa các chủ đề độc đáo và theo dõi biểu đồ tiến bộ của bạn mỗi ngày cùng AI Copilot hỗ trợ.
          </p>
          <Link to="/courses" className="level-teaser-cta">
            Bắt đầu hành trình
          </Link>
        </div>

        {/* Right Column: Visual Game-like Map */}
        <div className="level-teaser-right">
          <div className="map-svg-container">
            <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
              {/* Dashed curved path */}
              <path 
                d="M 50 160 Q 150 40 250 120 T 450 80" 
                stroke="#00754A" 
                strokeWidth="4" 
                strokeDasharray="8 8" 
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Active Glow filter for Level 12 Node */}
              <defs>
                <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Node 1: Level 11 (Passed) */}
              <g transform="translate(50, 160)">
                <circle r="24" fill="#d4e9e2" stroke="#00754A" strokeWidth="3" />
                <text x="0" y="5" fill="#00754A" fontSize="11" fontWeight="bold" textAnchor="middle">Lvl 11</text>
              </g>

              {/* Node 2: Level 12 (Active & Glowing) */}
              <g transform="translate(245, 120)">
                {/* Glow ring */}
                <circle r="34" fill="rgba(0, 117, 74, 0.15)" className="node-active-glow" style={{ filter: 'url(#glow-effect)' }} />
                <circle r="26" fill="#00754A" stroke="#1E3932" strokeWidth="4" />
                <text x="0" y="5" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">Lvl 12</text>
                {/* Active Indicator Pin */}
                <path d="M 0 -38 L -6 -48 L 6 -48 Z" fill="#cba258" />
                <circle cx="0" cy="-48" r="4" fill="#cba258" />
              </g>

              {/* Node 3: Level 13 (Locked) */}
              <g transform="translate(420, 85)" className="node-locked">
                <circle r="24" fill="#f2f0eb" stroke="#edebe9" strokeWidth="3" />
                <circle cx="0" cy="0" r="12" fill="#FFFFFF" opacity="0.9" />
                <g transform="translate(-6, -6)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="3">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </g>
                <text x="0" y="38" fill="#4b5563" fontSize="11" fontWeight="bold" textAnchor="middle">Lvl 13</text>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};
