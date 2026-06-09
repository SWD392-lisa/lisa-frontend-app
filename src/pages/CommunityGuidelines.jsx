import React, { useState } from 'react';
import { Heart, ShieldAlert, XOctagon } from 'lucide-react';
import './CommunityGuidelines.css';

export const CommunityGuidelines = () => {
  const [activeSection, setActiveSection] = useState('respect');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="guidelines-page">
      <div className="guidelines-container">
        
        <h1 className="guidelines-title">Hiến Pháp Cộng Đồng LUCY</h1>

        <div className="guidelines-layout">
          
          {/* Left Sticky Sidebar */}
          <div className="guidelines-sidebar">
            <button 
              className={`sidebar-link ${activeSection === 'respect' ? 'active' : ''}`}
              onClick={() => scrollToSection('respect')}
            >
              1. Tôn trọng & Lắng nghe
            </button>
            <button 
              className={`sidebar-link ${activeSection === 'anonymity' ? 'active' : ''}`}
              onClick={() => scrollToSection('anonymity')}
            >
              2. Bảo vệ Danh tính
            </button>
            <button 
              className={`sidebar-link ${activeSection === 'toxic' ? 'active' : ''}`}
              onClick={() => scrollToSection('toxic')}
            >
              3. Không khoan nhượng Toxic
            </button>
          </div>

          {/* Right Main Content */}
          <div className="guidelines-content">
            
            <div id="respect" className="guidelines-card">
              <div className="guidelines-card-header">
                <div className="guidelines-card-icon icon-hug">
                  <Heart size={24} />
                </div>
                <h3>Tôn trọng & Lắng nghe</h3>
              </div>
              <p>
                Tại cộng đồng nói tiếng Anh ẩn danh LUCY, mọi học viên đều xuất phát từ những trình độ khác nhau. 
                Sự cảm thông và tôn trọng chính là chìa khóa mở lối. Hãy kiên nhẫn nghe người khác nói hết câu, 
                đóng góp ý kiến phát âm một cách nhẹ nhàng và tích cực, và không bao giờ chế giễu lỗi sai của người khác.
              </p>
            </div>

            <div id="anonymity" className="guidelines-card">
              <div className="guidelines-card-header">
                <div className="guidelines-card-icon icon-shield">
                  <ShieldAlert size={24} />
                </div>
                <h3>Bảo vệ Danh tính</h3>
              </div>
              <p>
                Linh hồn của LUCY là sự ẩn danh an toàn. Không yêu cầu chia sẻ thông tin cá nhân như số điện thoại, 
                facebook cá nhân hay địa chỉ nhà trong các phòng Live. Bạn được quyền từ chối trả lời bất kỳ câu hỏi đào sâu 
                thông tin riêng tư nào của người dùng khác để bảo vệ an toàn cho bản thân.
              </p>
            </div>

            <div id="toxic" className="guidelines-card">
              <div className="guidelines-card-header">
                <div className="guidelines-card-icon icon-toxic">
                  <XOctagon size={24} />
                </div>
                <h3>Không khoan nhượng với Toxic</h3>
              </div>
              <p>
                LUCY thực thi chính sách không khoan nhượng đối với các hành vi xúc phạm, quấy rối, ngôn từ thù hận, 
                phát ngôn thô tục hoặc quảng cáo spam trong các phòng đàm thoại. Mọi vi phạm được báo cáo qua nút Report 
                sẽ được hệ thống kiểm duyệt ghi âm tự động quét và xử lý khóa tài khoản vĩnh viễn lập tức.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
