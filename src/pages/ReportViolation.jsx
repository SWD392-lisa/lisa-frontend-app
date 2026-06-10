import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import './ReportViolation.css';

export const ReportViolation = () => {
  const [reportData, setReportData] = useState({
    violationType: 'harassment',
    targetId: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportData.targetId || !reportData.description) return;
    
    console.log('Violation report submitted:', reportData);
    setSubmitted(true);
    setReportData({
      violationType: 'harassment',
      targetId: '',
      description: ''
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-glass-card">
          
          <div className="report-header">
            <h1 className="report-title">Báo Cáo Vi Phạm An Toàn</h1>
            <p className="report-subtitle">
              Giúp giữ gìn môi trường học tập lành mạnh. Mọi thông tin báo cáo đều được ẩn danh tuyệt đối.
            </p>
          </div>

          {submitted && (
            <div className="report-success-alert">
              <ShieldCheck size={20} />
              <span>Báo cáo đã gửi thành công. Đội ngũ kiểm duyệt LUCY đang xử lý!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form">
            
            <div className="report-form-group">
              <label htmlFor="violationType">Loại vi phạm</label>
              <select 
                id="violationType"
                name="violationType"
                value={reportData.violationType}
                onChange={handleChange}
                className="report-input-field"
              >
                <option value="harassment">Quấy rối âm thanh (Mắng chửi, Toxic)</option>
                <option value="spam">Spam (Quảng cáo, Spam link)</option>
                <option value="leak">Lộ thông tin (Đào bới danh tính thật)</option>
                <option value="other">Vi phạm quy tắc ứng xử khác</option>
              </select>
            </div>

            <div className="report-form-group">
              <label htmlFor="targetId">User ID / Room ID của đối tượng vi phạm</label>
              <input 
                type="text" 
                id="targetId"
                name="targetId"
                value={reportData.targetId}
                onChange={handleChange}
                placeholder="Ví dụ: #USER-12849 hoặc #ROOM-992" 
                className="report-input-field"
                required
              />
            </div>

            <div className="report-form-group">
              <label htmlFor="description">Mô tả chi tiết hành vi vi phạm</label>
              <textarea 
                id="description"
                name="description"
                value={reportData.description}
                onChange={handleChange}
                placeholder="Cung cấp thời gian, câu nói vi phạm hoặc bối cảnh diễn ra sự việc..." 
                className="report-input-field"
                required
              ></textarea>
            </div>

            <button type="submit" className="report-submit-btn">
              <AlertTriangle size={18} /> Gửi Báo Cáo
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};
