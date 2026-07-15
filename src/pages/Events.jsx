import React, { useState, useEffect } from 'react';
import { Flame, Award, Medal, Trophy, Calendar, Bell, Play, Mic, Headphones } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getPodcastPlaybackUrl, getPodcasts } from '../services/realtimeService';
import './Events.css';

// Mock Data
const communityChallenges = [
  { id: 1, title: '7-Day Speaking Streak', desc: 'Speak in live rooms for 7 consecutive days.', icon: <Flame size={32} />, progress: 70, daysLeft: 3 },
  { id: 2, title: 'Master of Tones', desc: 'Achieve 95% accuracy in Chinese tone drills.', icon: <Award size={32} />, progress: 45, daysLeft: 5 },
  { id: 3, title: 'Helpful Mentor', desc: 'Receive 50 "Helpful" votes from peers.', icon: <Medal size={32} />, progress: 85, daysLeft: 2 }
];

const scheduleEvents = [
  { id: 1, date: '15', month: 'Aug', title: 'IELTS Speaking Part 3 Tactics', host: 'Mentor Sarah', language: 'English' },
  { id: 2, date: '16', month: 'Aug', title: 'Business Negotiation in Shanghai', host: 'Mentor Wang', language: 'Chinese' },
  { id: 3, date: '18', month: 'Aug', title: 'Keigo (Honorifics) Masterclass', host: 'Mentor Kenji', language: 'Japanese' },
  { id: 4, date: '20', month: 'Aug', title: 'Overcoming Speaking Anxiety', host: 'Dr. Emily', language: 'All' }
];

const filterTabs = ['All', 'English', 'Chinese', 'Japanese'];

export const Events = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [podcasts, setPodcasts] = useState([]);
  const [podcastError, setPodcastError] = useState('');
  const [playingPodcastId, setPlayingPodcastId] = useState(null);
  
  // Real-time Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 30, seconds: 59 });

  useEffect(() => {
    getPodcasts().then(setPodcasts).catch((err) => setPodcastError(err.message || 'Could not load podcasts.'));
  }, []);

  const playPodcast = async (podcast) => {
    try {
      const result = await getPodcastPlaybackUrl(podcast.podcastId);
      const audio = new Audio(result.playbackUrl);
      await audio.play();
      setPlayingPodcastId(podcast.podcastId);
      audio.onended = () => setPlayingPodcastId(null);
    } catch (err) {
      setPodcastError(err.message || 'Could not play podcast.');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const filteredSchedule = activeFilter === 'All' 
    ? scheduleEvents 
    : scheduleEvents.filter(e => e.language === activeFilter || e.language === 'All');

  return (
    <div className="events-page">
      <div className="events-container">
        
        {/* 1. Hero Featured Event */}
        <section className="events-hero">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Flame size={16} /> Upcoming
              </div>
              <h1 className="hero-title">Masterclass: English Reflex Thinking without Translating</h1>
              <p style={{ fontSize: '1.6rem', color: 'var(--text-black-soft)', marginBottom: '32px', lineHeight: '1.6' }}>
                Break the habit of translating in your head. Join our exclusive 2-hour interactive audio workshop to train your brain to think directly in English.
              </p>
              <Button variant="primary-filled" style={{ fontSize: '1.6rem', padding: '14px 32px', borderRadius: '50px' }}>
                Book Now
              </Button>
            </div>
            
            {/* Live Countdown Glass Block */}
            <div className="countdown-block">
              <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.days)}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.hours)}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.minutes)}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="countdown-separator" style={{ opacity: 0.3 }}>:</div>
              <div className="countdown-item" style={{ opacity: 0.5 }}>
                <span className="countdown-value">{formatNumber(timeLeft.seconds)}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Gamification Challenges */}
        <section className="challenges-section">
          <h2 className="section-header">Community Challenges</h2>
          <div className="challenges-grid">
            {communityChallenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-icon">
                  {challenge.icon}
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.desc}</p>
                <div className="progress-wrapper">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${challenge.progress}%` }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="progress-text">{challenge.progress}% Completed</span>
                    <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>{challenge.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Schedule Calendar */}
        <section className="schedule-section">
          <h2 className="section-header">Special Live Room Schedule</h2>
          
          <div className="schedule-filters">
            {filterTabs.map(tab => (
              <button 
                key={tab} 
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="schedule-list">
            {filteredSchedule.map(event => (
              <div key={event.id} className="schedule-card">
                <div className="schedule-date">
                  <span className="date-day">{event.date}</span>
                  <span className="date-month">{event.month}</span>
                </div>
                <div className="schedule-info">
                  <h3>{event.title}</h3>
                  <p><Mic size={16} /> Hosted by {event.host} • {event.language}</p>
                </div>
                <div className="schedule-action">
                  <Button variant="primary-outlined" style={{ borderRadius: '50px', padding: '8px 20px' }}>
                    <Bell size={16} style={{ marginRight: '6px' }} /> Remind Me
                  </Button>
                </div>
              </div>
            ))}
            {filteredSchedule.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '1.6rem' }}>
                No events scheduled for this language yet.
              </div>
            )}
          </div>
        </section>

        {/* 4. Podcast Archives */}
        <section className="podcast-section">
          <h2 className="section-header">Replay Station</h2>
          <div className="podcast-scroll-container">
            {podcastError && <p role="alert">{podcastError}</p>}
            {podcasts.map(podcast => (
              <div key={podcast.podcastId} className="podcast-card">
                <div className="podcast-cover">
                  <div className="podcast-super-badge">Published</div>
                  <Headphones size={48} style={{ color: '#94a3b8', opacity: 0.5 }} />
                  <button className="podcast-play-btn" onClick={() => playPodcast(podcast)} aria-label="Play podcast">
                    <Play size={24} style={{ fill: 'currentColor', marginLeft: '4px' }} />
                  </button>
                </div>
                <h3>{podcast.title}</h3>
                <p>Creator {podcast.creatorUserId} {playingPodcastId === podcast.podcastId ? ' - Playing' : ''}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
