import React from 'react';

const mockRooms = [
  { id: 1, name: 'English Communication Reflex Training - Level 2', lang: 'English', level: 'Intermediate', users: 124 },
  { id: 2, name: 'Japanese Anime & Manga Discussion', lang: 'Japanese', level: 'Beginner', users: 89 },
  { id: 3, name: 'Standard Beijing Mandarin Pronunciation', lang: 'Chinese', level: 'Advanced', users: 45 },
  { id: 4, name: 'Weekend Casual Chit-Chat', lang: 'English', level: 'All Levels', users: 210 },
];

export const LiveNowSection = ({ onRequireLogin }) => {
  return (
    <section className="live-section">
      <div className="section-header-row">
        <div>
          <span className="section-subtitle-tag">Active Classrooms</span>
          <div className="section-title-wrapper">
            <div className="pulse-dot-live"></div>
            <h2 className="section-title">Join Real-time Study Rooms Right Now</h2>
          </div>
        </div>
      </div>

      <div className="live-grid">
        {mockRooms.map((room) => (
          <div key={room.id} className="live-card">
            <div className="card-top-row">
              <span className="lang-badge">
                {room.lang}
              </span>
              <span className="live-badge">
                <span className="podcast-wave-container" style={{ height: '12px', width: '12px', marginRight: '4px', gap: '1.5px' }}>
                  <span className="podcast-wave-bar" style={{ width: '1.8px', backgroundColor: 'var(--red)' }}></span>
                  <span className="podcast-wave-bar" style={{ width: '1.8px', backgroundColor: 'var(--red)' }}></span>
                  <span className="podcast-wave-bar" style={{ width: '1.8px', backgroundColor: 'var(--red)' }}></span>
                </span>
                Live
              </span>
            </div>
            
            <h3 className="room-title">{room.name}</h3>
            <p className="room-level">{room.level}</p>
            
            <div className="card-footer">
              <div className="avatar-stack-container">
                <div className="avatar-stack">
                  {[...Array(4)].map((_, i) => (
                    <img 
                      key={i} 
                      className="avatar-stack-item" 
                      src={`https://i.pravatar.cc/100?img=${room.id * 10 + i}`} 
                      alt="User avatar" 
                    />
                  ))}
                </div>
                <span className="avatar-count">+{room.users}</span>
              </div>
              
              <button 
                onClick={onRequireLogin}
                className="sb-button sb-button--primary-filled"
                style={{ padding: '6px 16px', fontSize: '1.3rem' }}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

