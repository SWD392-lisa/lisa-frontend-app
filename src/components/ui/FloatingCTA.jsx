import React from 'react';
import './FloatingCTA.css';

export const FloatingCTA = ({ icon, onClick, ariaLabel }) => {
  return (
    <button 
      className="sb-floating-cta"
      onClick={onClick}
      aria-label={ariaLabel || "Floating Action Button"}
    >
      {icon}
    </button>
  );
};
