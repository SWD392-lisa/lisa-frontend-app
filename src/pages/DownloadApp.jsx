import React from 'react';
import { Play, Mic, Headphones, X, Volume2, Shield } from 'lucide-react';
import './DownloadApp.css';

export const DownloadApp = () => {
  return (
    <div className="download-page">
      <div className="download-container">
        <div className="download-layout">
          
          {/* Left Column: Smart Phone device frame */}
          <div className="download-mockup-col">
            <div className="phone-device-frame">
              <div className="phone-screen-content">
                
                {/* Room Header */}
                <div className="phone-room-header">
                  <div className="phone-room-title">Room #48: Speak Fearlessly</div>
                  <div className="phone-room-status">● Live Room</div>
                </div>

                {/* 6 Grid Avatars representing anonymous users */}
                <div className="phone-room-avatars">
                  <div className="phone-avatar-bubble speaking">
                    <div className="phone-avatar-circle">🐱</div>
                    <span className="phone-avatar-name">Lazy Cat</span>
                  </div>

                  <div className="phone-avatar-bubble">
                    <div className="phone-avatar-circle">🦊</div>
                    <span className="phone-avatar-name">Wise Fox</span>
                  </div>

                  <div className="phone-avatar-bubble speaking">
                    <div className="phone-avatar-circle">🦉</div>
                    <span className="phone-avatar-name">Night Owl</span>
                  </div>

                  <div className="phone-avatar-bubble">
                    <div className="phone-avatar-circle">🐼</div>
                    <span className="phone-avatar-name">Cuddly Panda</span>
                  </div>

                  <div className="phone-avatar-bubble">
                    <div className="phone-avatar-circle">🐨</div>
                    <span className="phone-avatar-name">Sleepy Koala</span>
                  </div>

                  <div className="phone-avatar-bubble">
                    <div className="phone-avatar-circle">🦁</div>
                    <span className="phone-avatar-name">Brave Lion</span>
                  </div>
                </div>

                {/* Sound wave animation */}
                <div className="phone-wave-wrapper">
                  <div className="phone-wave-bar"></div>
                  <div className="phone-wave-bar"></div>
                  <div className="phone-wave-bar"></div>
                  <div className="phone-wave-bar"></div>
                  <div className="phone-wave-bar"></div>
                  <div className="phone-wave-bar"></div>
                </div>

                {/* Room controls footer */}
                <div className="phone-room-footer">
                  <div className="phone-action-btn">
                    <Mic size={18} />
                  </div>
                  <div className="phone-action-btn">
                    <Headphones size={18} />
                  </div>
                  <div className="phone-action-btn leave">
                    <X size={18} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Download Center details */}
          <div className="download-center-col">
            <h2>Trải nghiệm giao tiếp ẩn danh mượt mà trên Mobile App</h2>
            
            {/* QR code card */}
            <div className="qr-glass-box">
              <div className="qr-code-image-wrapper">
                {/* SVG representing a QR code mock */}
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer corners */}
                  <rect x="5" y="5" width="25" height="25" stroke="#1E3932" strokeWidth="6" rx="2" />
                  <rect x="12" y="12" width="11" height="11" fill="#1E3932" />

                  <rect x="70" y="5" width="25" height="25" stroke="#1E3932" strokeWidth="6" rx="2" />
                  <rect x="77" y="12" width="11" height="11" fill="#1E3932" />

                  <rect x="5" y="70" width="25" height="25" stroke="#1E3932" strokeWidth="6" rx="2" />
                  <rect x="12" y="77" width="11" height="11" fill="#1E3932" />

                  {/* Tiny mock pixels */}
                  <rect x="40" y="5" width="6" height="6" fill="#1E3932" />
                  <rect x="50" y="15" width="6" height="6" fill="#1E3932" />
                  <rect x="40" y="25" width="6" height="6" fill="#1E3932" />
                  <rect x="60" y="10" width="6" height="6" fill="#1E3932" />

                  <rect x="5" y="45" width="6" height="6" fill="#1E3932" />
                  <rect x="15" y="55" width="6" height="6" fill="#1E3932" />
                  <rect x="25" y="45" width="6" height="6" fill="#1E3932" />

                  <rect x="45" y="45" width="16" height="16" fill="#00754A" />
                  <rect x="70" y="45" width="6" height="6" fill="#1E3932" />
                  <rect x="80" y="55" width="6" height="6" fill="#1E3932" />
                  <rect x="90" y="45" width="6" height="6" fill="#1E3932" />

                  <rect x="45" y="70" width="6" height="6" fill="#1E3932" />
                  <rect x="55" y="80" width="6" height="6" fill="#1E3932" />
                  <rect x="45" y="90" width="6" height="6" fill="#1E3932" />

                  <rect x="75" y="75" width="16" height="16" fill="#1E3932" />
                </svg>
              </div>
              <div className="qr-box-details">
                <h3>Quét mã để tải ngay</h3>
                <p>Mở camera điện thoại của bạn quét nhanh mã QR bên cạnh để cài đặt trực tiếp app LUCY di động.</p>
              </div>
            </div>

            {/* App stores link rows */}
            <div className="store-buttons-row">
              <a href="https://apple.com" target="_blank" rel="noopener noreferrer" className="app-store-btn">
                <Headphones size={24} />
                <span className="btn-store-text">
                  <span className="btn-store-small">Download on the</span>
                  <span className="btn-store-large">App Store</span>
                </span>
              </a>

              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="app-store-btn">
                <Volume2 size={24} />
                <span className="btn-store-text">
                  <span className="btn-store-small">Get it on</span>
                  <span className="btn-store-large">Google Play</span>
                </span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
