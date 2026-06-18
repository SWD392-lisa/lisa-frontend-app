import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { confirmPayment } from '../services/paymentService';
import { confirmUpgradePayment } from '../services/roleUpgradeService';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true);
  const [confirmError, setConfirmError] = useState(null);
  const [result, setResult] = useState(null);

  const invoiceNumber = searchParams.get('order_invoice_number') || searchParams.get('orderInvoiceNumber') || 'N/A';
  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId') || 'N/A';
  const amountStr = searchParams.get('order_amount') || searchParams.get('amount') || searchParams.get('orderAmount') || '';
  const paymentType = searchParams.get('type') || 'deposit';

  const amount = amountStr ? parseInt(amountStr, 10) : null;

  useEffect(() => {
    if (invoiceNumber === 'N/A') {
      setConfirming(false);
      return;
    }

    const confirm = paymentType === 'upgrade'
      ? confirmUpgradePayment({
          orderInvoiceNumber: invoiceNumber,
          transactionId,
          amount: amountStr,
          status: 'success',
        })
      : confirmPayment({
          orderInvoiceNumber: invoiceNumber,
          transactionId,
          amount: amountStr,
          status: 'success',
        });

    confirm
      .then((res) => {
        // If upgrade response contains new token, update localStorage
        if (res?.newAccessToken && res?.user) {
          localStorage.setItem('lucy_token', res.newAccessToken);
          localStorage.setItem('lucy_user', JSON.stringify(res.user));
          // Dispatch a storage event so AuthContext picks up the change
          window.dispatchEvent(new Event('storage'));
        }
        setResult(res);
        setConfirming(false);
      })
      .catch((err) => {
        console.error('Confirm payment failed:', err);
        setConfirmError(err.message);
        setConfirming(false);
      });
  }, []);

  const isUpgrade = paymentType === 'upgrade';

  return (
    <div className="payment-status-container">
      <div className="status-card">
        <div className="status-accent success-accent" />

        <div className="icon-wrapper success-icon">
          <Check size={40} strokeWidth={3} />
        </div>

        <h1 className="status-title">
          {isUpgrade ? 'Nang cap tai khoan thanh cong!' : 'Thanh toan thanh cong!'}
        </h1>
        <p className="status-subtitle">
          {confirming
            ? 'Dang xac nhan giao dich...'
            : confirmError
              ? 'Giao dich da duoc xu ly, nhung co loi khi cap nhat du lieu.'
              : isUpgrade
                ? 'Chuc mung! Tai khoan cua ban da duoc nang cap. Vui long dang nhap lai de cap nhat quyen truy cap.'
                : 'Cam on ban. Don hang cua ban da duoc xu ly tu dong va hoan tat.'}
        </p>

        {confirmError && (
          <div className="info-table info-table--error" style={{ marginBottom: '16px' }}>
            <p className="error-detail">{confirmError}</p>
          </div>
        )}

        <div className="info-table">
          <div className="info-row">
            <span className="info-label">Ma hoa don</span>
            <span className="info-value info-value--code">{invoiceNumber}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Ma giao dich SePay</span>
            <span className="info-value info-value--code">{transactionId}</span>
          </div>

          {amount && (
            <div className="info-row">
              <span className="info-label">So tien</span>
              <span className="info-value info-value--amount">
                {amount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          )}

          <div className="info-row">
            <span className="info-label">Trang thai</span>
            <span className="info-value info-value--status">
              {isUpgrade ? 'Da nang cap' : 'Da nhan tien'}
            </span>
          </div>
        </div>

        <div className="action-buttons">
          <Button variant="primary-filled" onClick={() => navigate('/wallet')}>
            Ve trang Vi
          </Button>
          <Button variant="primary-outlined" onClick={() => navigate('/dashboard')}>
            Vao Trang chu
          </Button>
        </div>
      </div>
    </div>
  );
}
