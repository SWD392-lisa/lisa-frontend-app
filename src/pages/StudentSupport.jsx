import React, { useState } from 'react';
import { Zap, Shield, Flag, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './StudentSupport.css';

const faqData = {
  'Audio & Mic': [
    { id: 'a1', question: 'How do I fix microphone echo during a live room?', answer: 'Please ensure you are using headphones. If the issue persists, try muting your microphone when not speaking, or adjust the noise cancellation settings in your profile.' },
    { id: 'a2', question: 'Why can\'t others hear me?', answer: 'Check your browser permissions to ensure LUCY has access to your microphone. Also, verify that the correct audio input device is selected in the room settings.' }
  ],
  'Learning Path': [
    { id: 'l1', question: 'How is my starting level determined?', answer: 'Our AI Copilot analyzes your pronunciation, vocabulary, and grammar during the Placement Test to place you in the most appropriate level on the 100-Level journey.' },
    { id: 'l2', question: 'Can I skip a level if it\'s too easy?', answer: 'Yes! If you consistently score high marks in live sessions, the AI Copilot may recommend an accelerated path and unlock higher levels early.' }
  ],
  'Wallet & Billing': [
    { id: 'w1', question: 'How do I earn more Stars?', answer: 'You can earn Stars by completing daily speaking challenges, assisting other learners in live rooms, or purchasing them directly from the Wallet page.' },
    { id: 'w2', question: 'Are my transactions secure?', answer: 'Absolutely. We use industry-standard encryption for all transactions. Your financial information is never stored directly on our servers.' }
  ]
};

const tabs = Object.keys(faqData);

export const StudentSupport = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="support-page">
      <div className="support-container">
        
        {/* 1. Hero Search Desk */}
        <section className="support-hero">
          <h1>Student Support Center</h1>
          <div className="support-search-capsule">
            <Zap className="support-search-icon" size={24} />
            <input 
              type="text" 
              className="support-search-input" 
              placeholder="Type your issue or ask AI Copilot..." 
            />
            <button className="support-search-btn">Search</button>
          </div>
        </section>

        {/* 2. Trust & Safety Section */}
        <section className="trust-safety-section">
          <div className="trust-safety-grid">
            
            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <Shield size={32} />
              </div>
              <h3>Live Room Guidelines</h3>
              <p>Fostering a culture of respect and empathy. Learn how to communicate constructively in our anonymous audio rooms.</p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <Flag size={32} />
              </div>
              <h3>Report Violations</h3>
              <p>Guidelines on how to block and report inappropriate users to keep our community safe and welcoming.</p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <Lock size={32} />
              </div>
              <h3>Identity Protection</h3>
              <p>Our 100% commitment to anonymous learning. Your real identity is securely protected from other users.</p>
            </div>

          </div>
        </section>

        {/* 3. FAQ Accordion */}
        <section className="faq-section">
          <div className="faq-layout">
            
            {/* Sidebar Tabs */}
            <div className="faq-sidebar">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  className={`faq-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setExpandedFaq(null); // Reset open accordion on tab switch
                  }}
                >
                  {tab}
                  <ChevronRight size={20} style={{ opacity: activeTab === tab ? 1 : 0.4 }} />
                </button>
              ))}
            </div>

            {/* Accordion Content */}
            <div className="faq-content">
              {faqData[activeTab].map(faq => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="faq-accordion-item">
                    <button 
                      className="faq-accordion-header"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      {faq.question}
                      <div className={`faq-icon-wrapper ${isOpen ? 'rotated' : ''}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>
                    <div className={`faq-accordion-body ${isOpen ? 'open' : ''}`}>
                      <div className="faq-accordion-content">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 4. Contact Banner */}
        <section className="support-contact-banner">
          <h2>Can't find what you're looking for? Let us help you directly.</h2>
          <div className="banner-actions">
            <Button variant="primary-outlined" style={{ borderRadius: '50px', padding: '12px 28px', backgroundColor: 'transparent' }}>
              Submit a Ticket
            </Button>
            <Button variant="primary-filled" style={{ borderRadius: '50px', padding: '12px 28px' }}>
              Live Chat
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};
