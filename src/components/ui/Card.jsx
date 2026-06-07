import React from 'react';
import './Card.css';

export const Card = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const isDark = variant === 'dark';
  
  return (
    <div 
      className={`sb-card ${isDark ? 'sb-card--dark' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => (
  <div className={`sb-card-body ${className}`}>
    {children}
  </div>
);
