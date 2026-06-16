import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './PaymentSuccess.css';
import './PaymentError.css';

export default function PaymentError() {
  const navigate = useNavigate();

  return (
    <div className="payment-status-container">
      <div className="status-card error-card">
        <div className="status-accent error-accent" />

        <div className="icon-wrapper error-icon">
          <AlertTriangle size={40} strokeWidth={2} />
        </div>

        <h1 className="status-title error-title">Thanh toan that bai!</h1>
        <p className="status-subtitle">
          Giao dich thanh toan da gap loi. Tai khoan ngan hang cua ban chua bi tru tien cho hoa don nay.
        </p>

        <div className="info-table info-table--error">
          <p className="error-detail">
            Yeu cau thanh toan khong the hoan thanh do loi ket noi, qua gio giao dich,
            hoac thong tin chu ky khong hop le.
          </p>
          <p className="error-detail">
            Vui long thu lai hoac lien he bo phan ho tro khach hang cua LUCY.
          </p>
        </div>

        <div className="action-buttons">
          <Button
            variant="primary-filled"
            style={{ backgroundColor: 'var(--red)', borderColor: 'var(--red)' }}
            onClick={() => navigate('/wallet')}
          >
            Thu lai
          </Button>
          <Button variant="primary-outlined" onClick={() => navigate('/support')}>
            Lien he Ho tro
          </Button>
        </div>
      </div>
    </div>
  );
}
