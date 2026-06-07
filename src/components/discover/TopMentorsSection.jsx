import React from 'react';
import { Star } from 'lucide-react';

const mockMentors = [
  { id: 1, name: 'Elena Rodriguez', role: 'Spanish Native', hours: '1.2k+', rating: 4.9, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', badge: 'LUCY Pro' },
  { id: 2, name: 'Kenji Sato', role: 'JLPT N1 Expert', hours: '850+', rating: 5.0, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', badge: 'LUCY Super' },
  { id: 3, name: 'Sarah Jenkins', role: 'IELTS Examiner', hours: '2.5k+', rating: 4.8, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', badge: 'LUCY Super' },
  { id: 4, name: 'David Chen', role: 'HSK 6 Master', hours: '500+', rating: 4.9, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', badge: 'LUCY Pro' },
];

export const TopMentorsSection = ({ onRequireLogin }) => {
  return (
    <section className="mentors-section">
      <div className="section-header-row" style={{ display: 'block', textAlign: 'center', marginBottom: '40px' }}>
        <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Verified Tutors</span>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>Learn with Top Language Experts</h2>
        <p style={{ fontSize: '1.6rem', color: 'var(--text-black-soft)', maxWidth: '600px', margin: '0 auto' }}>
          LUCY Pro & Super Mentors with verified credentials.
        </p>
      </div>

      <div className="mentors-grid">
        {mockMentors.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-avatar-wrapper">
              <img 
                src={mentor.img} 
                alt={mentor.name} 
                className="mentor-avatar" 
                style={{ 
                  borderColor: mentor.badge === 'LUCY Super' ? '#7c3aed' : '#cba258',
                  padding: '3px'
                }}
              />
              <div className={`mentor-badge ${mentor.badge === 'LUCY Super' ? 'mentor-badge--super' : ''}`}>
                {mentor.badge}
              </div>
            </div>
            
            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-role">{mentor.role}</p>
            
            <div className="mentor-stats">
              <div className="rating-wrapper">
                <Star className="rating-star-icon" size={16} />
                <span>{mentor.rating}</span>
              </div>
              <div className="stats-divider"></div>
              <div>{mentor.hours} Live hours</div>
            </div>
            
            <button 
              onClick={onRequireLogin}
              className="sb-button sb-button--dark-outlined"
              style={{ width: '100%', padding: '8px 16px', fontSize: '1.4rem' }}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

