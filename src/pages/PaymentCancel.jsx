import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './PaymentSuccess.css';
import './PaymentCancel.css';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="payment-status-container">
      <div className="status-card cancel-card">
        <div className="status-accent cancel-accent" />

        <div className="icon-wrapper cancel-icon">
          <X size={40} strokeWidth={3} />
        </div>

        <h1 className="status-title cancel-title">Da huy thanh toan</h1>
        <p className="status-subtitle">
          Ban da huy bo yeu cau thanh toan tren trang SePay Checkout.
        </p>

        <div className="info-table info-table--cancel">
          <p className="cancel-detail">
            Khong co khoan phi nao duoc tru tu vi hoac tai khoan ngan hang cua ban.
          </p>
          <p className="cancel-detail">
            Ban co the nap lai coin hoac nang cap tai khoan bat cu luc nao tu man hinh vi.
          </p>
        </div>

        <div className="action-buttons">
          <Button
            variant="primary-filled"
            style={{ backgroundColor: 'var(--gold)', borderColor: 'var(--gold)' }}
            onClick={() => navigate('/wallet')}
          >
            Quay lai Vi
          </Button>
          <Button variant="primary-outlined" onClick={() => navigate('/dashboard')}>
            Vao Trang chu
          </Button>
        </div>
      </div>
    </div>
  );
}
