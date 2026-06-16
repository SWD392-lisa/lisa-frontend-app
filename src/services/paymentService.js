// src/services/paymentService.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5149';

// Helper to parse JSON safely
const parseResponse = async (response) => {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
};

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
    credentials: 'include'
  });

  const data = await parseResponse(response);
  
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tạo đơn hàng thanh toán');
  }

  return data;
  // Trả về: { orderAmount, merchant, currency, operation, orderDescription,
  //           orderInvoiceNumber, successUrl, errorUrl, cancelUrl, signature, isSandbox }
}
