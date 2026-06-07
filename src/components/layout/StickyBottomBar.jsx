import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './StickyBottomBar.css';

// Minimalist Download SVG Icon
const DownloadAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const StickyBottomBar = () => {
  return (
    <div className="sticky-bottom-bar">
      <div className="sticky-bottom-container">
        
        {/* Left Side: Text and Action */}
        <div className="sticky-bottom-left">
          <div className="sticky-bottom-subtitle">Ready to conquer new languages?</div>
          <button className="sticky-bottom-title">
            Start Placement Test <ChevronDown size={18} />
          </button>
        </div>
        
        {/* Right Side: Download Button */}
        <div className="sticky-bottom-right">
          <Link to="/app" className="sticky-bottom-action">
            <DownloadAppIcon /> 
            <span>Download App</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
