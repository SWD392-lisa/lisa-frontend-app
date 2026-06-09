import React from 'react';
import './Team.css';

const TEAM_MEMBERS = [
  // Top Row (2 members)
  {
    name: 'Nguyễn Anh Tuấn',
    role: 'Co-Founder & CEO / Product Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'LUCY ra đời với khát vọng xóa nhòa rào cản sợ hãi giao tiếp của người Việt trẻ.',
    row: 'top'
  },
  {
    name: 'Trần Thanh Vân',
    role: 'Co-Founder & Lead Educator',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    quote: 'Lộ trình 100 cấp độ chính là tâm huyết của chúng tôi để đưa người học từ số không lên thạo nói.',
    row: 'top'
  },
  // Bottom Row (3 members)
  {
    name: 'Phan Minh Hoàng',
    role: 'Backend Engineer - Java Spring',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    quote: 'Đảm bảo hệ thống quản lý học tập LMS và vi dịch vụ hoạt động bền bỉ, mượt mà.',
    row: 'bottom'
  },
  {
    name: 'Lê Quỳnh Chi',
    role: 'Frontend Engineer - React / UX Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    quote: 'Tỉ mỉ thiết kế từng góc Glassmorphism, mang lại cảm giác chạm nói chân thực, tinh tế.',
    row: 'bottom'
  },
  {
    name: 'Vũ Hải Long',
    role: 'Real-time Audio & Infrastructure Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'Node.js Audio Gateway và hạ tầng WebRTC kết nối đàm thoại ẩn danh thời gian thực siêu tốc.',
    row: 'bottom'
  }
];

export const Team = () => {
  const topRow = TEAM_MEMBERS.filter(m => m.row === 'top');
  const bottomRow = TEAM_MEMBERS.filter(m => m.row === 'bottom');

  return (
    <div className="team-page">
      <div className="team-container">
        <h1 className="team-title">Đội Ngũ Kiến Tạo LUCY</h1>
        
        <div className="team-layout">
          {/* Top Row: 2 Members */}
          <div className="team-row-top">
            {topRow.map((member, index) => (
              <div key={index} className="team-card">
                <div className="avatar-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-avatar" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${member.name}`;
                    }}
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <div className="member-quote">
                  "{member.quote}"
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 3 Members */}
          <div className="team-row-bottom">
            {bottomRow.map((member, index) => (
              <div key={index} className="team-card">
                <div className="avatar-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${member.name}`;
                    }}
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <div className="member-quote">
                  "{member.quote}"
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
