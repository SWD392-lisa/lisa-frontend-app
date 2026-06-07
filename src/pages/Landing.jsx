import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import logoPhoenix from '../assets/images/logo_phonenix1.png';
import './Landing.css';

export const Landing = () => {
  return (
    <div className="landing-page" style={{ fontFamily: "'SoDo Sans', 'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Section */}
      <header className="landing-header runic-bg-light">
        <div className="landing-header-inner container">
          <div className="landing-header-left" style={{ marginLeft: '-37px' }}>
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
            <div className="landing-search-box">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Discover your next adventure..." />
            </div>
            <div className="landing-actions">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="dark-outlined" style={{ fontSize: '1.4rem', fontFamily: "'SoDo Sans', 'SodoSans', sans-serif", fontWeight: '700' }}>Sign in</Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary-filled" style={{ backgroundColor: '#000000', borderColor: '#000000', color: '#FFFFFF', fontSize: '1.4rem', fontFamily: "'SoDo Sans', 'SodoSans', sans-serif", fontWeight: '700' }}>
                  Join now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="landing-main-container">
        {/* Section 1: Ribbon Banner */}
        <section className="landing-section" style={{ backgroundColor: '#FFFFFF', padding: '0 24px 16px 24px' }}>
          <div className="unlock-banner" style={{
            backgroundColor: '#354A31',
            margin: '0 -37px',
            width: 'auto',
            padding: '33px 37px 42px 37px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: '700', fontSize: '19px', color: 'var(--white)', whiteSpace: 'nowrap', fontFamily: 'SoDoSans, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              Unlock your true potential today
            </span>
            <Link to="/courses" style={{ textDecoration: 'none' }}>
              <Button variant="outline-dark" style={{ 
                background: 'transparent', 
                borderColor: 'var(--white)', 
                color: 'var(--white)', 
                borderRadius: '50px',
                padding: '8px 16px',
                fontSize: '19px',
                fontFamily: 'SoDoSans, "Helvetica Neue", Helvetica, Arial, sans-serif'
              }}>
                Begin your journey
              </Button>
            </Link>
          </div>
        </section>

        {/* Section 2: Light Green Features */}
        <section className="landing-section celebration-section runic-bg-light" style={{ backgroundColor: '#006242' }}>
          <div className="landing-split split-reverse">
            <div className="split-image image-left">
              <img src="/images/badge_achievement.png" alt="Course Completion Badge" />
            </div>
            <div className="split-content content-right text-center">
              <h2 style={{ fontWeight: '700', fontSize: '3rem', color: '#FFFFFF', marginBottom: '16px' }}>
                Celebrate Achievements!
              </h2>
              <p style={{ fontSize: '1.8rem', lineHeight: 1.6, color: '#FFFFFF', marginBottom: '32px' }}>
                Honor their accomplishments by awarding a prestigious digital course badge.
              </p>
              <div className="action-row">
                <Link to="/courses" style={{ textDecoration: 'none' }}>
                  <Button variant="outline-dark" style={{ borderRadius: '50px', borderColor: '#FFFFFF', color: '#FFFFFF' }}>Send a badge</Button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="dark-filled" style={{ borderRadius: '50px', backgroundColor: '#FFFFFF', color: '#006242' }}>Join now</Button>
                </Link>
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
              <Link to="/courses" style={{ textDecoration: 'none' }}>
                <Button variant="primary-outlined" style={{ borderColor: 'var(--text-black)', color: 'var(--text-black)', borderRadius: '50px' }}>
                  Download App
                </Button>
              </Link>
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
          <div className="paper-texture-overlay"></div>
          <div className="landing-split split-reverse">
            <div className="split-image image-left">
              <img src="/images/cake_pops.png" alt="LUCY Pro Certification" className="badge-glow-effect" />
            </div>
            <div className="split-content content-right text-center">
              <h1>LUCY Pro</h1>
              <h2 style={{ color: 'var(--white)' }}>Professional Certification</h2>
              <p style={{ color: 'var(--text-white-soft)', fontSize: '1.6rem', maxWidth: '400px' }}>
                Earn industry-recognized certificates. Elevate your career with our specialized programs designed by top experts.
              </p>
              <Link to="/courses" style={{ textDecoration: 'none' }}>
                <Button variant="inverted" style={{ borderRadius: '50px', marginTop: '16px' }}>Start Learning</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Section 5: Global Footer */}
      <Footer />
    </div>
  );
};