import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  VideoOff, 
  UserCheck, 
  Wallet, 
  Bug, 
  ChevronDown, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import './HelpCenter.css';

const FAQ_DATA = {
  'Sự cố Phòng Live': [
    { id: 'a1', question: 'Làm sao để sửa lỗi tiếng vọng (echo) mic khi đang gọi?', answer: 'Bạn hãy sử dụng tai nghe để khử nhiễu hoàn toàn. Nếu vẫn bị, hãy tắt mic khi không nói hoặc tinh chỉnh độ nhạy micro trong phần cài đặt.' },
    { id: 'a2', question: 'Tại sao người khác không nghe thấy giọng của tôi?', answer: 'Hãy kiểm tra quyền truy cập micro trong trình duyệt web của bạn và đảm bảo đã chọn đúng thiết bị micro đầu vào.' }
  ],
  'Tài khoản & Ẩn danh': [
    { id: 'l1', question: 'Danh tính thật của tôi có bị lộ không?', answer: 'Tuyệt đối không. LUCY cam kết bảo mật danh tính 100%. Mọi người dùng chỉ nhìn thấy biệt danh ẩn danh ngẫu nhiên của bạn.' },
    { id: 'l2', question: 'Làm thế nào để thay đổi biệt danh ẩn danh?', answer: 'Bạn có thể vào trang Cá nhân (Profile) và chọn làm mới biệt danh ẩn danh để hệ thống cấp một tên mới ngẫu nhiên.' }
  ],
  'Thanh toán & Ví': [
    { id: 'w1', question: 'Stars là gì và làm sao để kiếm thêm Stars?', answer: 'Stars là đơn vị trong LUCY dùng để tặng quà cho các Creator hoặc Mentor. Bạn có thể kiếm qua việc hoàn thành nhiệm vụ nói hàng ngày hoặc mua trong trang Ví.' },
    { id: 'w2', question: 'Giao dịch rút tiền của Creator có an toàn không?', answer: 'Chúng tôi sử dụng cổng thanh toán mã hóa đạt chuẩn bảo mật để bảo vệ mọi giao dịch chuyển tiền về ví tài khoản ngân hàng của bạn.' }
  ],
  'Kỹ thuật & Lỗi App': [
    { id: 't1', question: 'LUCY có ứng dụng trên điện thoại di động không?', answer: 'Có, ứng dụng hiện có sẵn trên cả cửa hàng App Store và Google Play Store. Bạn có thể quét mã QR ở chân trang để tải.' },
    { id: 't2', question: 'Tại sao trang web load chậm hoặc bị đơ phòng?', answer: 'Hãy kiểm tra lại đường truyền internet của bạn, hoặc thử tải lại trang (F5). Nếu vẫn bị lỗi, hãy gửi yêu cầu hỗ trợ kỹ thuật.' }
  ]
};

const TABS = Object.keys(FAQ_DATA);

export const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal) return;
    alert(`LUCY AI Copilot đang tìm kiếm câu trả lời cho: "${searchVal}"...`);
  };

  return (
    <div className="help-page">
      <div className="help-container">
        
        {/* 1. Hero Search Section */}
        <section className="help-hero">
          <h1>Chúng tôi có thể giúp gì cho bạn?</h1>
          <form onSubmit={handleSearchSubmit} className="help-search-wrapper">
            <input 
              type="text" 
              className="search-input-field" 
              placeholder="Hỏi LUCY AI hoặc tìm kiếm sự cố..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <div className="search-actions-box">
              <div className="ai-sparkle-btn" title="Hỏi AI Copilot" onClick={() => alert('LUCY AI Copilot đang khởi chạy...')}>
                <Sparkles size={22} />
              </div>
              <button type="submit" className="search-submit-btn">
                <Search size={20} />
              </button>
            </div>
          </form>
        </section>

        {/* 2. Category Grid */}
        <h2 className="help-grid-title">Danh mục hỗ trợ phổ biến</h2>
        <section className="help-categories-grid">
          
          <div className="help-cat-card glass-card" onClick={() => setActiveTab('Sự cố Phòng Live')}>
            <div className="help-cat-icon">
              <VideoOff size={28} />
            </div>
            <h3>Sự cố Phòng Live</h3>
            <p>Khắc phục lỗi mic, âm thanh, kết nối phòng đàm thoại.</p>
          </div>

          <div className="help-cat-card glass-card" onClick={() => setActiveTab('Tài khoản & Ẩn danh')}>
            <div className="help-cat-icon">
              <UserCheck size={28} />
            </div>
            <h3>Tài khoản & Ẩn danh</h3>
            <p>Chính sách bảo mật danh tính, đổi tên ẩn danh, hồ sơ cá nhân.</p>
          </div>

          <div className="help-cat-card glass-card" onClick={() => setActiveTab('Thanh toán & Ví')}>
            <div className="help-cat-icon">
              <Wallet size={28} />
            </div>
            <h3>Thanh toán & Ví</h3>
            <p>Nạp rút Stars, mua gói Pro, tặng quà Super Creator.</p>
          </div>

          <div className="help-cat-card glass-card" onClick={() => setActiveTab('Kỹ thuật & Lỗi App')}>
            <div className="help-cat-icon">
              <Bug size={28} />
            </div>
            <h3>Kỹ thuật & Lỗi App</h3>
            <p>Sự cố ứng dụng di động, cập nhật phiên bản, gửi phản hồi lỗi.</p>
          </div>

        </section>

        {/* 3. FAQ Accordion section (Preserved from old code, upgraded styles) */}
        <section className="faq-section" style={{ padding: '48px 0', borderTop: '1px solid #edebe9' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.8rem', fontWeight: 700, marginBottom: '40px', color: '#1E3932' }}>
            Câu hỏi thường gặp (FAQs)
          </h2>
          
          <div className="faq-layout" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setExpandedFaq(null);
                  }}
                  style={{
                    backgroundColor: activeTab === tab ? 'var(--green-accent)' : '#FFFFFF',
                    color: activeTab === tab ? '#FFFFFF' : '#4b5563',
                    border: '1px solid #edebe9',
                    padding: '10px 24px',
                    borderRadius: '50px',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content List */}
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
              {FAQ_DATA[activeTab].map(faq => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #edebe9', 
                      borderRadius: '16px', 
                      marginBottom: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                    }}
                  >
                    <button 
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        padding: '20px 24px',
                        textAlign: 'left',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: 'var(--text-black)',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HelpCircle size={18} style={{ color: 'var(--green-accent)' }} />
                        {faq.question}
                      </span>
                      <ChevronDown 
                        size={20} 
                        style={{ 
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                          transition: 'transform 0.2s',
                          color: 'var(--text-black-soft)'
                        }} 
                      />
                    </button>
                    {isOpen && (
                      <div 
                        style={{ 
                          padding: '0 24px 20px 54px', 
                          fontSize: '1.5rem', 
                          lineHeight: '1.6', 
                          color: 'var(--text-black-soft)' 
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
