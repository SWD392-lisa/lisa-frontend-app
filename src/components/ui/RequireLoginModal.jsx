import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RequireLoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <div className="modal-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '32px', height: '32px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h3 className="modal-title">Login Required</h3>
        <p className="modal-message">You need to log in or create a Persona to access this feature on LUCY.</p>
        
        <div className="modal-actions">
          <Link to="/register" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <button 
              className="sb-button sb-button--primary-filled sb-button--full-width"
              style={{ padding: '12px 24px', fontSize: '1.6rem' }}
            >
              Create Persona Now
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <button 
              className="sb-button sb-button--dark-outlined sb-button--full-width"
              style={{ padding: '12px 24px', fontSize: '1.6rem' }}
            >
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

