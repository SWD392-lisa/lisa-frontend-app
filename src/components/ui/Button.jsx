import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary-filled',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClass = 'sb-button';
  const variantClass = `sb-button--${variant}`;
  const widthClass = fullWidth ? 'sb-button--full-width' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${widthClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
