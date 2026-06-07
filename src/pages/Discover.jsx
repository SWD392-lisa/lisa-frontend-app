import React, { useState } from 'react';
import { RequireLoginModal } from '../components/ui/RequireLoginModal';
import { LiveNowSection } from '../components/discover/LiveNowSection';
import { TopMentorsSection } from '../components/discover/TopMentorsSection';
import { TrendingPodcastsSection } from '../components/discover/TrendingPodcastsSection';
import { RoadmapSection } from '../components/discover/RoadmapSection';
import './Discover.css';

export const Discover = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequireLogin = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="discover-page">
      {/* Boxed Layout Container */}
      <main className="discover-boxed-container">

        
        {/* Header Hero Section */}
        <div className="discover-hero">
          <div className="aurora-bg">
            <div className="aurora-blob aurora-blob--1"></div>
            <div className="aurora-blob aurora-blob--2"></div>
            <div className="aurora-blob aurora-blob--3"></div>
          </div>
          <h1>Discover the World of LUCY</h1>
          <p>Connecting millions of language learners through audio and live interactive experiences.</p>
        </div>

        {/* Section 1: Live Now */}
        <LiveNowSection onRequireLogin={handleRequireLogin} />
        
        <hr className="section-divider" />
        
        {/* Section 2: Top Mentors */}
        <TopMentorsSection onRequireLogin={handleRequireLogin} />

        <hr className="section-divider" />
        
        {/* Section 3: Trending Podcasts */}
        <TrendingPodcastsSection />
        
        <hr className="section-divider" />

        {/* Section 4: Roadmap */}
        <RoadmapSection />

      </main>

      {/* Shared Modal */}
      <RequireLoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

