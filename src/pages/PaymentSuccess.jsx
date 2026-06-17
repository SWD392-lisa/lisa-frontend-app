import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { confirmPayment } from '../services/paymentService';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true);
  const [confirmError, setConfirmError] = useState(null);

  const invoiceNumber = searchParams.get('order_invoice_number') || 'N/A';
  const transactionId = searchParams.get('transaction_id') || 'N/A';
  const amountStr = searchParams.get('order_amount') || searchParams.get('amount') || '';

  const amount = amountStr ? parseInt(amountStr, 10) : null;

  useEffect(() => {
    if (invoiceNumber === 'N/A') {
      setConfirming(false);
      return;
    }

    confirmPayment({
      orderInvoiceNumber: invoiceNumber,
      transactionId,
      amount: amountStr,
      status: 'success',
    })
      .then(() => {
        setConfirming(false);
      })
      .catch((err) => {
        console.error('Confirm payment failed:', err);
        setConfirmError(err.message);
        setConfirming(false);
      });
  }, []);

  return (
    <div className="payment-status-container">
      <div className="status-card">
        {/* Decorative top accent */}
        <div className="status-accent success-accent" />

        <div className="icon-wrapper success-icon">
          <Check size={40} strokeWidth={3} />
        </div>

        <h1 className="status-title">Thanh toan thanh cong!</h1>
        <p className="status-subtitle">
          {confirming
            ? 'Dang xac nhan giao dich...'
            : confirmError
              ? 'Giao dich da duoc xu ly, nhung co loi khi cap nhat du lieu.'
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
            <span className="info-value info-value--status">Da nhan tien</span>
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
