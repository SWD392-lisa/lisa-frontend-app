import React, { useState } from 'react';
import { Wallet, Sparkles, Star, CheckCircle, Send } from 'lucide-react';
import './ForMentors.css';

export const ForMentors = () => {
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    language: 'english',
    certificate: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.email || !applyForm.certificate) return;

    console.log('Mentor Application Submitted:', applyForm);
    setSuccess(true);
    setApplyForm({
      fullName: '',
      email: '',
      language: 'english',
      certificate: ''
    });

    setTimeout(() => {
      setSuccess(false);
    }, 6000);
  };

  return (
    <div className="mentors-apply-page">
      <div className="mentors-apply-container">
        
        {/* Hero Headline */}
        <section className="apply-hero">
          <h1>Trở thành Mentor tại LUCY - Chia sẻ tri thức, kiến tạo thu nhập</h1>
          <p>
            Đồng hành cùng hàng triệu học viên ngôn ngữ, tận dụng công nghệ đàm thoại ẩn danh 
            và AI hỗ trợ để tối ưu bài giảng của bạn.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="benefits-grid">
          
          <div className="benefit-card glass-card">
            <div className="benefit-icon-box">
              <Wallet size={28} />
            </div>
            <h3>Thu nhập bền vững</h3>
            <p>Nhận quà tặng ảo (Stars) theo thời gian thực từ học viên và đổi thành thu nhập thật một cách nhanh chóng.</p>
          </div>

          <div className="benefit-card glass-card">
            <div className="benefit-icon-box">
              <Sparkles size={28} />
            </div>
            <h3>Tối giản vận hành</h3>
            <p>Công cụ AI Copilot tự động phân tích phản xạ học viên và đề xuất tài liệu nói phù hợp, giảm 90% thời gian soạn bài.</p>
          </div>

          <div className="benefit-card glass-card">
            <div className="benefit-icon-box">
              <Star size={28} />
            </div>
            <h3>Xây dựng thương hiệu</h3>
            <p>Tích lũy đánh giá năm sao từ học viên để lọt top Bảng xếp hạng Mentor tuần, tiếp cận hàng ngàn người học mới.</p>
          </div>

        </section>

        {/* Registration Form */}
        <section className="apply-form-section">
          <h2>Đăng ký ứng tuyển Mentor</h2>
          
          <div className="apply-glass-card">
            
            {success && (
              <div className="apply-success-alert">
                <CheckCircle size={20} />
                <span>Hồ sơ đã gửi thành công! Hội đồng chuyên môn của LUCY sẽ liên hệ với bạn qua Email trong vòng 3 ngày làm việc.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="apply-form">
              
              <div className="apply-form-row">
                <div className="apply-form-half apply-form-group">
                  <label htmlFor="fullName">Họ và Tên</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    value={applyForm.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A" 
                    className="apply-input-field"
                    required
                  />
                </div>

                <div className="apply-form-half apply-form-group">
                  <label htmlFor="email">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={applyForm.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com" 
                    className="apply-input-field"
                    required
                  />
                </div>
              </div>

              <div className="apply-form-row">
                <div className="apply-form-half apply-form-group">
                  <label htmlFor="language">Ngôn ngữ giảng dạy</label>
                  <select 
                    id="language"
                    name="language"
                    value={applyForm.language}
                    onChange={handleChange}
                    className="apply-input-field"
                    style={{
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '16px',
                      paddingRight: '48px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="english">Tiếng Anh (English)</option>
                    <option value="chinese">Tiếng Trung (Chinese)</option>
                    <option value="japanese">Tiếng Nhật (Japanese)</option>
                    <option value="korean">Tiếng Hàn (Korean)</option>
                  </select>
                </div>

                <div className="apply-form-half apply-form-group">
                  <label htmlFor="certificate">Chứng chỉ hiện có & Điểm số</label>
                  <input 
                    type="text" 
                    id="certificate"
                    name="certificate"
                    value={applyForm.certificate}
                    onChange={handleChange}
                    placeholder="Ví dụ: IELTS 8.0, JLPT N1, HSK 6..." 
                    className="apply-input-field"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="apply-submit-btn">
                Gửi hồ sơ xét duyệt <Send size={16} />
              </button>

            </form>
          </div>
        </section>

      </div>
    </div>
  );
};
