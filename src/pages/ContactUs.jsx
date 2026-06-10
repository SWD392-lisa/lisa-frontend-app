import React, { useState } from 'react';
import { MapPin, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import './ContactUs.css';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API call
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Reset success banner after 5s
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Kết Nối Với LUCY</h1>

        <div className="contact-split-layout">
          
          {/* Left Column: Contact info */}
          <div className="contact-info-col">
            
            <div className="contact-info-block">
              <div className="contact-icon-box">
                <MapPin size={24} />
              </div>
              <div className="contact-info-details">
                <h3>Văn phòng dự án</h3>
                <p>Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam</p>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-icon-box">
                <Mail size={24} />
              </div>
              <div className="contact-info-details">
                <h3>Email tuyển sinh & Hợp tác</h3>
                <a href="mailto:hello@lucy.edu">hello@lucy.edu</a>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-icon-box">
                <MessageSquare size={24} />
              </div>
              <div className="contact-info-details">
                <h3>Hỗ trợ kỹ thuật</h3>
                <a href="mailto:support@lucy.edu">support@lucy.edu</a>
                <p style={{ marginTop: '4px', fontSize: '1.3rem' }}>Giải đáp thắc mắc tài khoản & lỗi phòng học</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact form */}
          <div className="contact-form-col">
            <div className="glass-form-card">
              
              {isSubmitted && (
                <div className="form-success-alert">
                  <CheckCircle2 size={20} />
                  <span>Cảm ơn bạn đã gửi thông điệp! LUCY sẽ phản hồi sớm nhất có thể.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                
                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label htmlFor="name">Họ và Tên</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A" 
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group form-group-half">
                    <label htmlFor="email">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com" 
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Chủ đề</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Góp ý sản phẩm, Hợp tác kinh doanh..." 
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Nội dung thông điệp</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập lời nhắn của bạn gửi tới đội ngũ LUCY..." 
                    className="form-input"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Gửi thông điệp <Send size={16} />
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
