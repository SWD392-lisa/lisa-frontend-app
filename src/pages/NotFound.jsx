import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';
import logoPhoenix from '../assets/images/logo_phonenix1.png';
import './NotFound.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="container not-found-container">
        <div className="not-found-content">
          <Link to="/" className="not-found-logo">
            <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" /> Lucy
          </Link>
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Trang không tìm thấy</h1>
          <p className="not-found-description">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="not-found-actions">
            <Button variant="primary-filled" onClick={() => navigate(-1)}>
              Quay lại trang trước
            </Button>
            <Button variant="primary-outlined" onClick={() => navigate('/')}>
              <Home size={20} style={{ marginRight: '8px' }} /> Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
