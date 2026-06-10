import React, { useState } from 'react';
import { Bell, Mic } from 'lucide-react';
import './UpcomingEvents.css';

const EVENT_LIST = [
  {
    id: 1,
    day: '15',
    month: 'Aug',
    title: 'Masterclass: IELTS Speaking Part 3 Tactics & Flow',
    host: 'Sarah Jenkins (Pro Mentor)',
    lang: 'Tiếng Anh',
    langKey: 'english'
  },
  {
    id: 2,
    day: '16',
    month: 'Aug',
    title: 'Đàm thoại Thương lượng & Ứng xử với đối tác Trung Quốc',
    host: 'Wang Wei (Pro Mentor)',
    lang: 'Tiếng Trung',
    langKey: 'chinese'
  },
  {
    id: 3,
    day: '18',
    month: 'Aug',
    title: 'Kính ngữ Keigo: Chinh phục môi trường doanh nghiệp Nhật Bản',
    host: 'Kenji Sato (Pro Mentor)',
    lang: 'Tiếng Nhật',
    langKey: 'japanese'
  },
  {
    id: 4,
    day: '20',
    month: 'Aug',
    title: 'Vượt qua nỗi sợ nói tiếng Anh trước đám đông',
    host: 'LUCY Team Sáng lập',
    lang: 'Tiếng Anh',
    langKey: 'english'
  },
  {
    id: 5,
    day: '22',
    month: 'Aug',
    title: 'Luyện phản xạ phát âm chuẩn giọng Kansai cơ bản',
    host: 'Mentor Haru (Guest Host)',
    lang: 'Tiếng Nhật',
    langKey: 'japanese'
  }
];

export const UpcomingEvents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [remindedEvents, setRemindedEvents] = useState({});

  const handleRemindToggle = (id) => {
    setRemindedEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredEvents = activeTab === 'all' 
    ? EVENT_LIST
    : EVENT_LIST.filter(e => e.langKey === activeTab);

  return (
    <div className="upcoming-events-page">
      <div className="upcoming-events-container">
        
        <div className="events-header-section">
          <h1 className="events-main-title">Lịch trình Sự kiện Âm thanh tuần này</h1>
          <p className="events-subtitle-text">
            Tham gia các lớp chuyên sâu (Masterclasses) hoàn toàn trực tiếp và miễn phí để chuẩn hóa khả năng phát âm.
          </p>
        </div>

        {/* Filter bar */}
        <div className="events-filter-bar">
          <button 
            className={`event-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button 
            className={`event-filter-btn ${activeTab === 'english' ? 'active' : ''}`}
            onClick={() => setActiveTab('english')}
          >
            Tiếng Anh
          </button>
          <button 
            className={`event-filter-btn ${activeTab === 'chinese' ? 'active' : ''}`}
            onClick={() => setActiveTab('chinese')}
          >
            Tiếng Trung
          </button>
          <button 
            className={`event-filter-btn ${activeTab === 'japanese' ? 'active' : ''}`}
            onClick={() => setActiveTab('japanese')}
          >
            Tiếng Nhật
          </button>
        </div>

        {/* Horizontal Event Cards List */}
        <div className="events-list-wrapper">
          {filteredEvents.map((event) => {
            const isReminded = remindedEvents[event.id];
            return (
              <div key={event.id} className="event-row-card glass-card">
                
                {/* Left Date block */}
                <div className="event-date-badge">
                  <span className="event-date-day">{event.day}</span>
                  <span className="event-date-month">{event.month}</span>
                </div>

                {/* Middle info block */}
                <div className="event-details-middle">
                  <h3 className="event-title-text">{event.title}</h3>
                  <div className="event-host-row">
                    <Mic size={14} style={{ color: 'var(--green-accent)' }} />
                    <span>Hosted by {event.host}</span>
                    <span className="event-lang-badge">{event.lang}</span>
                  </div>
                </div>

                {/* Right action button */}
                <div className="event-remind-action">
                  <button 
                    className="event-remind-btn"
                    onClick={() => handleRemindToggle(event.id)}
                    style={{
                      backgroundColor: isReminded ? 'var(--green-accent)' : 'transparent',
                      color: isReminded ? '#FFFFFF' : 'var(--green-accent)'
                    }}
                  >
                    <Bell size={14} style={{ fill: isReminded ? '#FFFFFF' : 'none' }} />
                    {isReminded ? 'Đã Nhắc tôi' : 'Nhắc tôi'}
                  </button>
                </div>

              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-black-soft)', fontSize: '1.6rem' }}>
              Hiện chưa có sự kiện âm thanh nào sắp diễn ra cho ngôn ngữ này.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
