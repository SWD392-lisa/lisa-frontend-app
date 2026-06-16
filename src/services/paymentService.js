// src/services/paymentService.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Gọi .NET backend để tạo form data có signature.
 * Backend sẽ không trả về checkout URL — chỉ trả dữ liệu để React tự submit.
 */
export async function createPayment({ orderInvoiceNumber, orderAmount, orderDescription, customerId }) {
  const token = localStorage.getItem('lucy_token');
  const response = await fetch(`${API_BASE}/api/payment/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      orderInvoiceNumber,
      orderAmount,
      orderDescription,
      customerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tạo đơn hàng thanh toán');
  }

  return response.json();
  // Trả về: { orderAmount, merchant, currency, operation, orderDescription,
  //           orderInvoiceNumber, successUrl, errorUrl, cancelUrl, signature, isSandbox }
}
