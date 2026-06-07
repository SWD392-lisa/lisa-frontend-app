import React from 'react';

export const PhoenixLogo = ({ size = 56, className = "" }) => {
  const color = "#00754A";
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer wings forming a perfect upper circular arc */}
      <path d="M 15 60 A 38 38 0 1 1 85 60" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      
      {/* Inner wing details */}
      <path d="M 25 55 Q 35 30 50 20 Q 65 30 75 55" stroke={color} strokeWidth="3" strokeLinecap="round" />
      
      {/* Phoenix Head */}
      <path d="M 50 8 L 44 18 Q 50 24 50 28 Q 50 24 56 18 Z" fill={color} />

      {/* The brand name enclosed inside the arc */}
      <text x="50" y="50" fontFamily="'SoDo Sans', sans-serif" fontWeight="800" fontSize="18" fill={color} textAnchor="middle" letterSpacing="0.05em">LUCY</text>

      {/* The Open Book forming the base */}
      <path d="M 15 66 Q 32.5 83 50 72 Q 67.5 83 85 66" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 25 74 Q 37.5 88 50 78 Q 62.5 88 75 74" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="50" y1="72" x2="50" y2="78" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
};
