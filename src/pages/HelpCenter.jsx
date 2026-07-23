import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bug, ChevronDown, HelpCircle, Search, Sparkles, UserCheck, VideoOff, Wallet } from 'lucide-react';
import { askSupportAi } from '../services/lmsApi';
import { useAuth } from '../context/AuthContext';
import './HelpCenter.css';

const FAQ_DATA = {
  'Sự cố Phòng Live': [
    { id: 'a1', question: 'Làm sao giảm tiếng vọng khi dùng micro?', answer: 'Hãy dùng tai nghe, tắt micro khi không nói và kiểm tra đúng thiết bị đầu vào trong quyền của trình duyệt.' },
    { id: 'a2', question: 'Tại sao người khác không nghe thấy tôi?', answer: 'Bạn cần giơ tay, chờ Mentor duyệt quyền phát biểu, sau đó cho phép trình duyệt truy cập micro và bật micro trong phòng.' },
  ],
  'Tài khoản & Ẩn danh': [
    { id: 'l1', question: 'Người khác có thấy danh tính thật của tôi không?', answer: 'Trong phòng live, learner được cấp Persona và biệt danh riêng theo từng phòng. Realtime, người tham gia khác và recording không nhận tên, email hoặc mã tài khoản thật của learner.' },
    { id: 'l2', question: 'Persona được chọn như thế nào?', answer: 'Hệ thống tự chọn ngẫu nhiên một Persona động vật khi bạn vào phòng. Khi kết nối lại cùng phòng, bạn tiếp tục dùng Persona đó.' },
  ],
  'Thanh toán & Ví': [
    { id: 'w1', question: 'Làm sao nạp tiền vào Ví?', answer: 'Vào trang Ví, chọn số tiền cần nạp và hoàn tất thanh toán. Số dư được cập nhật sau khi giao dịch được xác nhận.' },
    { id: 'w2', question: 'Làm sao tặng quà cho Mentor?', answer: 'Trong phòng live, bấm Tặng quà, chọn quà và số lượng rồi xác nhận. Nếu số dư không đủ, hệ thống sẽ dẫn bạn về trang Ví.' },
  ],
  'Kỹ thuật & Ứng dụng': [
    { id: 't1', question: 'LUCY hiện dùng được ở đâu?', answer: 'Phiên bản hiện tại là web app. Thông tin phát hành App Store hoặc Google Play chưa được xác nhận.' },
    { id: 't2', question: 'Trang web hoặc phòng bị chậm thì làm gì?', answer: 'Kiểm tra kết nối mạng, đóng ứng dụng đang chiếm micro, tải lại trang và thử vào phòng lại. Nếu vẫn lỗi, gửi báo cáo tại trang Hỗ trợ.' },
  ],
};

const TABS = Object.keys(FAQ_DATA);
const categories = [
  ['Sự cố Phòng Live', VideoOff, 'Khắc phục lỗi micro, âm thanh và kết nối phòng.'],
  ['Tài khoản & Ẩn danh', UserCheck, 'Persona, biệt danh theo phòng và bảo vệ danh tính.'],
  ['Thanh toán & Ví', Wallet, 'Nạp tiền, kiểm tra số dư và tặng quà cho Mentor.'],
  ['Kỹ thuật & Ứng dụng', Bug, 'Sự cố trình duyệt, kết nối và gửi phản hồi.'],
];

export const HelpCenter = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAi = async (event) => {
    event.preventDefault();
    const normalized = question.trim();
    if (!normalized || loading || !currentUser) return;
    setLoading(true); setError(''); setAnswer(null);
    try { setAnswer(await askSupportAi(normalized)); }
    catch (aiError) { setError(aiError.message || 'AI Support đang tạm thời không khả dụng.'); }
    finally { setLoading(false); }
  };

  return <div className="help-page"><div className="help-container">
    <section className="help-hero">
      <h1>Chúng tôi có thể giúp gì cho bạn?</h1>
      <form onSubmit={askAi} className="help-search-wrapper">
        <input className="search-input-field" maxLength={500} placeholder="Hỏi LUCY AI cách sử dụng sản phẩm..." value={question} onChange={(event) => setQuestion(event.target.value)} />
        <div className="search-actions-box"><Sparkles size={22} className="ai-sparkle-btn" /><button type="submit" className="search-submit-btn" disabled={loading || !question.trim()}><Search size={20} /></button></div>
      </form>
      {!currentUser && <div className="support-ai-login"><span>Đăng nhập để sử dụng LUCY AI Support.</span><Link to="/login" state={{ from: '/support' }}>Đăng nhập</Link></div>}
      {loading && <div className="support-ai-result is-loading"><Sparkles size={20} /> AI đang tìm hướng dẫn phù hợp...</div>}
      {error && <div className="support-ai-result is-error" role="alert"><strong>Chưa thể trả lời</strong><p>{error}</p><button onClick={askAi}>Thử lại</button></div>}
      {answer && <div className="support-ai-result" aria-live="polite"><div className="support-ai-result__title"><Sparkles size={20} /> LUCY AI</div><p>{answer.answer}</p>{answer.suggestedLinks?.length > 0 && <div className="support-ai-links">{answer.suggestedLinks.map((link) => <Link key={link.path} to={link.path}>{link.label}</Link>)}</div>}<small>{answer.provider} · {answer.model}</small></div>}
    </section>

    <h2 className="help-grid-title">Danh mục hỗ trợ phổ biến</h2>
    <section className="help-categories-grid">{categories.map(([title, Icon, description]) => <button type="button" className="help-cat-card glass-card" key={title} onClick={() => { setActiveTab(title); setExpandedFaq(null); }}><div className="help-cat-icon"><Icon size={28} /></div><h3>{title}</h3><p>{description}</p></button>)}</section>

    <section className="faq-section"><h2>Câu hỏi thường gặp</h2><div className="faq-tabs">{TABS.map((tab) => <button className={activeTab === tab ? 'is-active' : ''} key={tab} onClick={() => { setActiveTab(tab); setExpandedFaq(null); }}>{tab}</button>)}</div><div className="faq-list">{FAQ_DATA[activeTab].map((faq) => { const open = expandedFaq === faq.id; return <article key={faq.id}><button onClick={() => setExpandedFaq(open ? null : faq.id)}><span><HelpCircle size={18} />{faq.question}</span><ChevronDown size={20} className={open ? 'is-open' : ''} /></button>{open && <p>{faq.answer}</p>}</article>; })}</div></section>
  </div></div>;
};
