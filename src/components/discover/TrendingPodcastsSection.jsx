import React, { useState } from 'react';
import { Play, Pause, Headphones } from 'lucide-react';

const mockPodcasts = [
  { id: 1, title: '10-Minute Daily HSK 3 Vocabulary', duration: '12:45', author: 'David Chen' },
  { id: 2, title: 'Common English Pronunciation Mistakes', duration: '08:20', author: 'Sarah Jenkins' },
  { id: 3, title: 'Shadowing Technique for Beginners', duration: '15:30', author: 'Elena Rodriguez' },
  { id: 4, title: 'Japanese Youth Slang 2026', duration: '09:15', author: 'Kenji Sato' },
];

export const TrendingPodcastsSection = () => {
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <section className="podcasts-section">
      <div className="podcasts-section-header" style={{ display: 'block', textAlign: 'center', marginBottom: '40px' }}>
        <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Audio Library</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <Headphones className="text-green-accent" size={32} style={{ color: 'var(--green-accent)' }} />
          <h2 className="section-title" style={{ margin: 0 }}>Exclusive Podcast Series</h2>
        </div>
      </div>

      <div className="podcast-list">
        {mockPodcasts.map((podcast) => {
          const isCurrentPlaying = playingId === podcast.id;
          return (
            <div key={podcast.id} className={`podcast-item ${isCurrentPlaying ? 'is-playing' : ''}`}>
              <button 
                onClick={() => togglePlay(podcast.id)}
                className="play-btn"
              >
                {isCurrentPlaying ? (
                  <Pause size={20} style={{ fill: 'currentColor' }} />
                ) : (
                  <Play size={20} style={{ fill: 'currentColor', marginLeft: '2px' }} />
                )}
              </button>
              
              <div className="podcast-info">
                <h3 className="podcast-title">{podcast.title}</h3>
                <p className="podcast-meta">{podcast.author} • {podcast.duration}</p>
              </div>
              
              {isCurrentPlaying && (
                <div className="podcast-wave-container">
                  <span className="podcast-wave-bar"></span>
                  <span className="podcast-wave-bar"></span>
                  <span className="podcast-wave-bar"></span>
                  <span className="podcast-wave-bar"></span>
                </div>
              )}
              
              <div className="podcast-badge">
                {isCurrentPlaying ? 'Playing' : 'Preview 30s'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

