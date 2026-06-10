import React from 'react';
import { Volume2, Play, Lock } from 'lucide-react';
import './ExclusivePodcasts.css';

const PREMIUM_PODCASTS = [
  {
    id: 1,
    title: 'E15: Masterclass - Trực giác suy nghĩ bằng tiếng Anh không dịch thầm',
    host: 'Hosted by Sarah Jenkins (IELTS Speaking Expert)',
    progress: '45%',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop'
  },
  {
    id: 2,
    title: 'E16: Giao tiếp Thương thảo trong môi trường công sở quốc tế',
    host: 'Hosted by Emily Watson & Team Pro Creators',
    progress: '20%',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150&h=150&fit=crop'
  },
  {
    id: 3,
    title: 'E17: Keigo & Các quy tắc ứng xử chuẩn Nhật Bản khi đi làm',
    host: 'Hosted by Kenji Sato (N3 Japanese Specialist)',
    progress: '65%',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=150&h=150&fit=crop'
  }
];

export const ExclusivePodcasts = () => {
  return (
    <div className="podcasts-page">
      <div className="podcasts-container">
        
        <div className="podcasts-header">
          <div className="podcasts-title-row">
            <h1 className="podcasts-title">Podcast Độc Quyền Từ Super Creators</h1>
            <Volume2 size={32} className="wave-sound-icon" />
          </div>
          <p className="podcasts-subtitle">
            Nghe lại những phiên Live đàm thoại giá trị nhất. Chỉ dành cho các tài khoản Pro & Super.
          </p>
        </div>

        <div className="podcasts-list">
          {PREMIUM_PODCASTS.map((podcast) => (
            <div key={podcast.id} className="podcast-horizontal-card">
              
              {/* Left Column: Image Cover & Play overlay */}
              <div className="podcast-cover-left">
                <img 
                  src={podcast.image} 
                  alt={podcast.title} 
                  className="podcast-cover-image"
                />
                <button className="play-circle-overlay">
                  <Play size={20} style={{ fill: '#FFFFFF', marginLeft: '3px' }} />
                </button>
              </div>

              {/* Middle Column: Info & progress */}
              <div className="podcast-info-middle">
                <h3 className="podcast-title-text">{podcast.title}</h3>
                <p className="podcast-host-text">{podcast.host}</p>
                <div className="podcast-progress-track">
                  <div className="podcast-progress-fill" style={{ width: podcast.progress }}></div>
                </div>
              </div>

              {/* Right Column: Premium badge & action */}
              <div className="podcast-action-right">
                <div className="podcast-premium-badge">
                  <Lock size={12} style={{ marginRight: '4px' }} /> Premium
                </div>
                <button className="podcast-unlock-btn" onClick={() => alert('Vui lòng nâng cấp tài khoản để mở khóa Podcast độc quyền!')}>
                  Mở khóa để nghe
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
