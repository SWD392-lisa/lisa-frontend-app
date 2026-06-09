import React from 'react';
import { Globe, Shield, Mic } from 'lucide-react';
import './Vision.css';

export const Vision = () => {
  return (
    <div className="vision-page">
      
      {/* 1. Hero Manifesto */}
      <section className="vision-hero">
        <div className="vision-waves"></div>
        <div className="vision-manifesto-content">
          <div className="vision-manifesto-badge">Tầm Nhìn & Sứ Mệnh</div>
          <h1>Kiến Tạo Thế Giới Giao Tiếp Tự Do</h1>
          <p>
            Chúng tôi tin rằng rào cản lớn nhất của ngôn ngữ không nằm ở trí tuệ, 
            mà nằm ở tâm lý. Khi sự e sợ phán xét được gỡ bỏ, khả năng ngôn ngữ trong mỗi người sẽ được đánh thức.
          </p>
        </div>
      </section>

      {/* 2. The 3 Pillars */}
      <section className="vision-pillars-section">
        <div className="vision-container">
          <h2 className="vision-pillars-title">Ba Trụ Cột Phát Triển</h2>

          {/* Pillar 1: Globe */}
          <div className="pillar-story">
            <div className="pillar-media">
              <div className="pillar-bg-icon">
                <Globe size={280} strokeWidth={0.5} />
              </div>
              <div className="pillar-icon-card">
                <Globe size={48} />
              </div>
            </div>
            <div className="pillar-content">
              <div className="pillar-num">Trụ cột 01</div>
              <h3>Kết Nối Toàn Cầu</h3>
              <p>
                Phá bỏ mọi giới hạn địa lý thông qua không gian âm thanh đa quốc gia. 
                Người dùng ở bất kỳ đâu trên thế giới đều có thể tham gia trò chuyện trực tiếp, 
                học hỏi văn hóa lẫn nhau và cùng thực hành tiếng Anh một cách tự nhiên nhất.
              </p>
            </div>
          </div>

          {/* Pillar 2: Shield (Mask / Anonymity) */}
          <div className="pillar-story alternate">
            <div className="pillar-media">
              <div className="pillar-bg-icon">
                <Shield size={280} strokeWidth={0.5} />
              </div>
              <div className="pillar-icon-card">
                <Shield size={48} />
              </div>
            </div>
            <div className="pillar-content">
              <div className="pillar-num">Trụ cột 02</div>
              <h3>Ẩn Danh Bảo Mật</h3>
              <p>
                Tại LUCY, bạn hoàn toàn tự do khám phá và mắc sai lầm. 
                Thông tin cá nhân và diện mạo của bạn được bảo mật tuyệt đối qua cơ chế ẩn danh. 
                Không có camera, không có phán xét, chỉ có âm thanh thuần khiết kết nối tâm hồn.
              </p>
            </div>
          </div>

          {/* Pillar 3: Mic */}
          <div className="pillar-story">
            <div className="pillar-media">
              <div className="pillar-bg-icon">
                <Mic size={280} strokeWidth={0.5} />
              </div>
              <div className="pillar-icon-card">
                <Mic size={48} />
              </div>
            </div>
            <div className="pillar-content">
              <div className="pillar-num">Trụ cột 03</div>
              <h3>Sáng Tạo Nội Dung</h3>
              <p>
                Không chỉ là một môi trường học tập, LUCY là sân khấu cho các nhà sáng tạo âm thanh. 
                Bạn có thể ghi âm các chia sẻ, chia sẻ kiến thức hữu ích, xuất bản các bài giảng audio 
                và xây dựng nguồn thu nhập thụ động bền vững cho chính mình.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Founder Quote */}
      <section className="founder-quote-section">
        <div className="vision-container">
          <div className="quote-card">
            <div className="giant-quote-mark">“</div>
            <p className="quote-text">
              Ý tưởng về LUCY nảy sinh khi tôi quan sát thấy hàng triệu người học tiếng Anh ngoài kia, 
              dù đã nắm rất vững ngữ pháp trên sách vở, nhưng lại không thể mở miệng nói được một câu trôi chảy. 
              Nỗi e sợ nói sai đã giam cầm họ. Chúng tôi tạo ra LUCY để mang lại một chiếc chìa khóa giải thoát: 
              hãy nói một cách tự do dưới lớp mặt nạ ẩn danh cho đến khi bạn đủ tự tin tháo nó xuống.
            </p>
            <div className="quote-author">
              <div className="quote-name">LUCY EdTech Founder</div>
              <div className="quote-title">Đội ngũ sáng lập LUCY</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
