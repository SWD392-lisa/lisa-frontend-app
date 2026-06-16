import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './FeaturedMentors.css';

const INITIAL_MENTORS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    langTag: 'IELTS Speaking Expert',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: 2,
    name: 'Kenji Sato',
    langTag: 'N3 Japanese Specialist',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isFollowing: true
  },
  {
    id: 3,
    name: 'Wang Wei',
    langTag: 'HSK 6 Chinese Master',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: 4,
    name: 'Emily Watson',
    langTag: 'Business English Coach',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: 5,
    name: 'Pierre Dubois',
    langTag: 'DELF French Expert',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: 6,
    name: 'Elena Rostova',
    langTag: 'Russian Native Coach',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: 7,
    name: 'Carlos Mendez',
    langTag: 'DELE Spanish Specialist',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    isFollowing: true
  },
  {
    id: 8,
    name: 'Min-ji Kim',
    langTag: 'TOPIK Korean Expert',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  }
];

export const FeaturedMentors = () => {
  const [mentors, setMentors] = useState(INITIAL_MENTORS);

  const handleFollowToggle = (id) => {
    setMentors(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, isFollowing: !m.isFollowing };
      }
      return m;
    }));
  };

  return (
    <div className="mentors-page">
      <div className="mentors-container">
        
        <div className="mentors-header">
          <h1 className="mentors-title">Gặp gỡ các Mentor hàng đầu</h1>
          <p className="mentors-subtitle">
            Học hỏi từ những chuyên gia được đánh giá cao nhất tuần qua, nâng trình ngoại ngữ cùng lộ trình chuẩn hóa.
          </p>
        </div>

        <div className="mentors-grid">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="mentor-glass-card">
              
              <div className="mentor-avatar-box">
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="mentor-avatar-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`;
                  }}
                />
              </div>

              <h3 className="mentor-card-name">{mentor.name}</h3>
              <span className="mentor-tag-lang">{mentor.langTag}</span>

              <div className="mentor-rating-row">
                <Star size={16} className="star-gold-icon" />
                <span>{mentor.rating} Rating</span>
              </div>

              <button 
                className="mentor-follow-btn"
                onClick={() => handleFollowToggle(mentor.id)}
                style={{
                  backgroundColor: mentor.isFollowing ? 'var(--green-accent)' : 'transparent',
                  color: mentor.isFollowing ? '#FFFFFF' : 'var(--green-accent)'
                }}
              >
                {mentor.isFollowing ? 'Đang Theo dõi' : 'Theo dõi'}
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
