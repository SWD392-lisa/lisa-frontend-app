import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Phone, 
  XCircle, 
  CheckCircle2, 
  User, 
  BookOpen, 
  Mic, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers 
} from 'lucide-react';
import './Introduction.css';

export const Introduction = () => {
  return (
    <div className="intro-page">
      <div className="intro-container">
        
        {/* 1. Hero Section */}
        <section className="intro-hero">
          <div className="intro-hero-badge">Giới thiệu dự án</div>
          <h1>LUCY - Mạng Xã Hội Âm Thanh & EdTech Thế Hệ Mới</h1>
          <p>
            Phá bỏ hoàn toàn rào cản tâm lý sợ sai khi giao tiếp tiếng Anh bằng cơ chế Ẩn danh đột phá, 
            kết hợp cùng lộ trình chuẩn hóa và phòng học trực tiếp thời gian thực.
          </p>
          <div className="intro-hero-actions">
            <Link to="/discover" className="intro-btn-primary">
              Khám phá thế giới ẩn danh <ArrowRight size={20} />
            </Link>
            <a href="#download" className="intro-btn-secondary">
              <Phone size={18} /> Tải ứng dụng
            </a>
          </div>
        </section>

        {/* 2. Core Philosophy */}
        <section className="intro-philosophy">
          <div className="philo-left">
            <h2>Triết Lý Cốt Lõi</h2>
            <p className="philo-left-desc">
              Phần lớn người học ngoại ngữ thất bại không phải vì thiếu tài liệu, 
              mà vì sự e ngại, sợ sai và tâm lý tự ti khi mở lời. LUCY giải quyết tận gốc rễ nỗi sợ này.
            </p>
            
            <div className="problem-list">
              <div className="problem-item">
                <div className="problem-icon">
                  <XCircle size={20} />
                </div>
                <div className="problem-text">
                  <h4>Sợ bị phán xét</h4>
                  <p>Ngượng ngùng khi phát âm chưa chuẩn trước mặt bạn bè hay người lạ.</p>
                </div>
              </div>

              <div className="problem-item">
                <div className="problem-icon">
                  <XCircle size={20} />
                </div>
                <div className="problem-text">
                  <h4>Thiếu môi trường luyện tập</h4>
                  <p>Không có cơ hội thực hành giao tiếp thường xuyên với người thật.</p>
                </div>
              </div>

              <div className="problem-item">
                <div className="problem-icon">
                  <XCircle size={20} />
                </div>
                <div className="problem-text">
                  <h4>Áp lực diện mạo</h4>
                  <p>Cuộc gọi video khiến người học căng thẳng về ngoại hình hoặc không gian xung quanh.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="philo-right glass-card">
            <div className="solution-card">
              <h3>Giải Pháp Từ LUCY</h3>
              <p>
                Chúng tôi kiến tạo môi trường nói 100% Ẩn danh và tương tác Âm thanh thời gian thực (Real-time Audio). 
                Tại đây, bạn được là chính mình, tập trung duy nhất vào phát âm và phản xạ ngôn ngữ.
              </p>
              
              <div className="solution-pill-group">
                <div className="solution-pill">100% Ẩn danh</div>
                <div className="solution-pill">Real-time Audio</div>
                <div className="solution-pill">Không phán xét</div>
              </div>

              <div className="solution-feature">
                <div className="solution-feature-dot"></div>
                <span className="solution-feature-text">Tự do kết nối không lo sợ</span>
              </div>
              <div className="solution-feature">
                <div className="solution-feature-dot"></div>
                <span className="solution-feature-text">Phòng thảo luận âm thanh chất lượng cao</span>
              </div>
              <div className="solution-feature">
                <div className="solution-feature-dot"></div>
                <span className="solution-feature-text">Tập trung tuyệt đối vào kỹ năng nói</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 100-Level Roadmap */}
        <section className="intro-roadmap-sec">
          <h2>Lộ Trình Chuẩn Hóa 100 Cấp Độ</h2>
          <div className="roadmap-flow">
            <div className="roadmap-node">
              <div className="roadmap-step-num">1</div>
              <h3>Sơ Cấp (Level 1-30)</h3>
              <p>Xây dựng nền tảng phát âm cơ bản, làm quen với phản xạ từ vựng qua phòng audio mini.</p>
              <div className="roadmap-badges">
                <span className="roadmap-badge">AI Support</span>
                <span className="roadmap-badge">Vocabulary Game</span>
              </div>
            </div>

            <div className="roadmap-node">
              <div className="roadmap-step-num">2</div>
              <h3>Trung Cấp (Level 31-70)</h3>
              <p>Luyện tập phản biện, thảo luận các chủ đề đời sống và công việc trong phòng Live 60 phút.</p>
              <div className="roadmap-badges">
                <span className="roadmap-badge">Phòng Live 60p</span>
                <span className="roadmap-badge">Featured Mentors</span>
              </div>
            </div>

            <div className="roadmap-node">
              <div className="roadmap-step-num">3</div>
              <h3>Cao Cấp (Level 71-100)</h3>
              <p>Làm chủ ngữ điệu, hùng biện chuyên sâu, thuyết trình trước đám đông hoàn toàn bằng tiếng Anh.</p>
              <div className="roadmap-badges">
                <span className="roadmap-badge">Exclusive Podcast</span>
                <span className="roadmap-badge">LMS Advanced</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Ecosystem */}
        <section className="intro-ecosystem">
          <h2 className="intro-ecosystem-title">Phân Tầng Hệ Sinh Thái</h2>
          <div className="ecosystem-grid">
            <div className="eco-card glass-card">
              <div className="eco-icon-wrapper">
                <User size={30} />
              </div>
              <h3>LUCY</h3>
              <div className="eco-card-subtitle">Thành viên ẩn danh</div>
              <p>Bắt đầu luyện giao tiếp hoàn toàn ẩn danh, miễn phí tham gia các phòng thảo luận nhóm.</p>
              <ul>
                <li><CheckCircle2 size={16} /> Ẩn danh hoàn toàn</li>
                <li><CheckCircle2 size={16} /> Nghe & nói trong phòng Live</li>
                <li><CheckCircle2 size={16} /> Truy cập lộ trình cơ bản</li>
              </ul>
            </div>

            <div className="eco-card glass-card">
              <div className="eco-icon-wrapper">
                <BookOpen size={30} />
              </div>
              <h3>LUCY Pro</h3>
              <div className="eco-card-subtitle">Học viên hiện danh</div>
              <p>Dành cho người dùng học tập bài bản, mở khóa tính năng tạo phòng học và quản lý học tập LMS.</p>
              <ul>
                <li><CheckCircle2 size={16} /> Học tập cùng Mentor</li>
                <li><CheckCircle2 size={16} /> Tự tạo phòng đàm thoại</li>
                <li><CheckCircle2 size={16} /> Lưu trữ nhật ký học tập</li>
              </ul>
            </div>

            <div className="eco-card glass-card">
              <div className="eco-icon-wrapper">
                <Mic size={30} />
              </div>
              <h3>LUCY Super</h3>
              <div className="eco-card-subtitle">Creator & Podcast</div>
              <p>Cơ hội kiếm thu nhập cho các nhà sáng tạo nội dung qua tính năng phát sóng podcast thu phí.</p>
              <ul>
                <li><CheckCircle2 size={16} /> Thu âm & bán Podcast</li>
                <li><CheckCircle2 size={16} /> Được chứng nhận Creator</li>
                <li><CheckCircle2 size={16} /> Tương tác Fan độc quyền</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Technical Stack */}
        <section className="tech-stack-sec">
          <h2>Kiến Trúc Bảo Mật & Vận Hành</h2>
          <p className="section-subtitle">
            Hệ thống vi dịch vụ (Microservices) tối tân được vận hành ổn định trên đám mây, 
            đảm bảo tính bảo mật danh tính tuyệt đối và âm thanh real-time mượt mà nhất.
          </p>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-name">
                <ShieldCheck size={20} /> .NET Core
              </div>
              <div className="tech-role">Security & Wallet</div>
              <p className="tech-desc">Đảm nhiệm xác thực danh tính mã hóa một chiều, quản lý ví điện tử của Creator an toàn.</p>
            </div>

            <div className="tech-card">
              <div className="tech-name">
                <Cpu size={20} /> Java Spring
              </div>
              <div className="tech-role">LMS & Content Core</div>
              <p className="tech-desc">Hệ thống quản lý học tập mạnh mẽ, phân phối tài liệu và lưu trữ lịch sử lộ trình 100 cấp độ.</p>
            </div>

            <div className="tech-card">
              <div className="tech-name">
                <Zap size={20} /> Node.js
              </div>
              <div className="tech-role">Real-time Audio Gateway</div>
              <p className="tech-desc">Kết nối phòng đàm thoại âm thanh trực tiếp với độ trễ siêu thấp dưới 150ms.</p>
            </div>

            <div className="tech-card">
              <div className="tech-name">
                <Layers size={20} /> Flutter
              </div>
              <div className="tech-role">Mobile Client</div>
              <p className="tech-desc">Ứng dụng di động đa nền tảng tối ưu trải nghiệm đàm thoại và thao tác học tập mọi lúc.</p>
            </div>
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="intro-final-cta" id="download">
          <h2>Bắt đầu hành trình 10 tuần thay đổi ngôn ngữ của bạn</h2>
          <p>Gia nhập thế giới âm thanh của LUCY để xóa tan hoàn toàn nỗi sợ nói tiếng Anh ngay hôm nay.</p>
          <Link to="/register" className="intro-final-btn">
            Tham gia LUCY ngay <ArrowRight size={20} />
          </Link>
        </section>

      </div>
    </div>
  );
};
