import React, { useState } from 'react';
import './Input.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  success,
  ...props
}) => {
  const inputClass = `sb-input ${error ? 'sb-input--error' : ''} ${success ? 'sb-input--success' : ''}`;

  return (
    <div className="sb-input-wrapper">
      <input
        type={type}
        className={inputClass}
        value={value}
        onChange={onChange}
        placeholder=" " /* Empty space placeholder required for :placeholder-shown pseudo-class */
        {...props}
      />
      <label className="sb-input-label">{label}</label>
    </div>
  );
};
