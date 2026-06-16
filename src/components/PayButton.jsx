import { useState } from 'react';
import { Button } from './ui/Button';
import { createPayment } from '../services/paymentService';
import { submitToSePay } from '../utils/sePayForm';

export default function PayButton({ order, variant = 'primary-filled', fullWidth = true, children }) {
  // order = { invoiceNumber, amount, description, customerId }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!order.amount || order.amount <= 0) {
      setError('Số tiền thanh toán phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = await createPayment({
        orderInvoiceNumber: order.invoiceNumber,
        orderAmount: order.amount,
        orderDescription: order.description,
        customerId: order.customerId,
      });

      // Submit sang SePay — trang sẽ redirect, không return về đây
      submitToSePay(formData);
    } catch (err) {
      console.error('Lỗi khi khởi tạo thanh toán SePay:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo giao dịch. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Button
        variant={variant}
        fullWidth={fullWidth}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Đang xử lý...' : (children || `Thanh toán ${order.amount.toLocaleString('vi-VN')} ₫`)}
      </Button>
      {error && (
        <p style={{ 
          color: 'var(--red, #c82014)', 
          fontSize: '1.4rem', 
          marginTop: '8px', 
          textAlign: 'center',
          fontWeight: 500
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
