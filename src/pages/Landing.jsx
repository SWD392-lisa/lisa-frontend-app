import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import logoPhoenix from '../assets/images/logo_phonenix1.png';
import './Landing.css';

export const Landing = () => {
  return (
    <div className="landing-page" style={{ fontFamily: "'SoDo Sans', 'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Section */}
      <header className="landing-header runic-bg-light">
        <div className="landing-header-inner container">
          <div className="landing-header-left">
            <Link to="/" className="landing-logo">
              <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" /> LUCY
            </Link>
            <nav className="landing-nav">
              <Link to="/discover">DISCOVER</Link>
              <Link to="/courses">COURSES</Link>
              <Link to="/support">STUDENT SUPPORT</Link>
              <Link to="/events">EVENTS</Link>
            </nav>
          </div>
          <div className="landing-header-right">
            <Link to="/search" className="landing-find-store">
              <Search size={20} />
              <span>Search courses</span>
            </Link>
            <div className="landing-actions">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="dark-outlined">SIGN IN</Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary-filled" style={{ backgroundColor: 'var(--starbucks-green)', borderColor: 'var(--starbucks-green)' }}>
                  JOIN NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="landing-main-container">
        {/* Section 1: Ribbon Banner */}
        <section className="landing-section" style={{ backgroundColor: '#1E3932', padding: '16px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', fontSize: '1.6rem', color: 'var(--white)', whiteSpace: 'nowrap' }}>
              Unlock your true potential today.
            </span>
            <Button variant="outline-dark" style={{ 
              background: 'transparent', 
              borderColor: 'var(--white)', 
              color: 'var(--white)', 
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '1.4rem',
              fontWeight: '600'
            }}>
              Begin your journey.
            </Button>
          </div>
        </section>

        {/* Section 2: Light Green Features */}
        <section className="landing-section celebration-section runic-bg-light" style={{ backgroundColor: '#D9EAD3' }}>
          <div className="landing-split split-reverse">
            <div className="split-image image-left">
              <img src="/images/badge_achievement.png" alt="Course Completion Badge" />
            </div>
            <div className="split-content content-right text-center">
              <h2 style={{ fontWeight: '700', fontSize: '3rem', color: 'var(--starbucks-green)', marginBottom: '16px' }}>
                Celebrate Achievements!
              </h2>
              <p style={{ fontSize: '1.8rem', lineHeight: 1.6, color: 'var(--text-black)', marginBottom: '32px' }}>
                Honor their accomplishments by awarding a prestigious digital course badge.
              </p>
              <div className="action-row">
                <Button variant="outline-dark" style={{ borderRadius: '50px' }}>Send a badge</Button>
                <Button variant="dark-filled" style={{ borderRadius: '50px' }}>Join now</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Cream Mobile App */}
        <section className="landing-section app-section">
          <div className="landing-split">
            <div className="split-content content-left text-center">
              <h2 style={{ color: 'var(--starbucks-green)' }}>Learn Anywhere, Anytime.</h2>
              <p style={{ color: 'var(--text-black)' }}>
                Access your courses on the go. Download the LUCY® app to watch offline, join live rooms, and interact with your mentors from anywhere.
              </p>
              <Button variant="primary-outlined" style={{ borderColor: 'var(--text-black)', color: 'var(--text-black)', borderRadius: '50px' }}>
                Download App
              </Button>
            </div>
            <div className="split-image image-right app-mockup-wrapper">
              <img src="/images/app_mockup.png" alt="LUCY App Mockup" className="app-mockup-img" />
              
              <div className="app-overlay-ui">
                <div className="app-card">
                  <div className="app-card-title">My Learning Path</div>
                  <div className="app-card-detail">Course: Advanced Web Development</div>
                  <div className="app-card-detail">Format: Live Cohort</div>
                  <div className="app-card-dropdown">
                    Next Session: 4:45 PM <ChevronDown size={16} />
                  </div>
                </div>
                <div className="app-handwritten">See you in class!</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Dark Green Pro */}
        <section className="landing-section treats-section" style={{ backgroundColor: 'var(--house-green)' }}>
          <div className="landing-split split-reverse">
            <div className="split-image image-left">
              <img src="/images/cake_pops.png" alt="LUCY Pro Certification" />
            </div>
            <div className="split-content content-right text-center">
              <h1>LUCY Pro</h1>
              <h2 style={{ color: 'var(--white)' }}>Professional Certification</h2>
              <p style={{ color: 'var(--text-white-soft)', fontSize: '1.6rem', maxWidth: '400px' }}>
                Earn industry-recognized certificates. Elevate your career with our specialized programs designed by top experts.
              </p>
              <Button variant="inverted" style={{ borderRadius: '50px', marginTop: '16px' }}>Start Learning</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Section 5: Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>About Us</h3>
              <Link to="#">Our Story</Link>
              <Link to="#">Vision & Mission</Link>
              <Link to="#">Our Team</Link>
            </div>
            <div className="footer-col">
              <h3>Academic Programs</h3>
              <Link to="#">Information Technology</Link>
              <Link to="#">Graphic Design</Link>
              <Link to="#">Personal Development</Link>
            </div>
            <div className="footer-col">
              <h3>Student Support</h3>
              <Link to="#">Help Center</Link>
              <Link to="#">Community</Link>
              <Link to="#">FAQs</Link>
            </div>
            <div className="footer-col">
              <h3>Contact</h3>
              <Link to="#">Partnerships</Link>
              <Link to="#">Careers</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="language-selector">
              <span>EN</span> <ChevronDown size={16} />
            </div>
            <div className="footer-legal">
              <Link to="#">Terms of Use</Link> | <Link to="#">Privacy Policy</Link> | <Link to="#">Cookie Policy</Link>
            </div>
            <div className="footer-copyright">
              © 2026 LUCY Education. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};