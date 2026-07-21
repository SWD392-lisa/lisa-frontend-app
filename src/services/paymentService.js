// src/services/paymentService.js

const API_BASE = (
  import.meta.env.FRONTEND_VITE_API_BASE_URL
  || import.meta.env.VITE_API_BASE_URL
  || 'http://localhost:5000'
).replace(/\/$/, '');

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
export async function createPayment({ orderInvoiceNumber, orderAmount, orderDescription, customerId, paymentMethod, transactionTypeCode }) {
  const token = localStorage.getItem('lucy_token');
  console.log('📤 Sending payment request:', { orderInvoiceNumber, orderAmount, orderDescription, customerId, paymentMethod, transactionTypeCode });
  
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
      paymentMethod,
      transactionTypeCode,
    }),
    credentials: 'include'
  });

  const data = await parseResponse(response);
  console.log('📥 Payment response from backend:', data);
  
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tạo đơn hàng thanh toán');
  }

  // Handle both wrapped Result<SePayFormData> and direct SePayFormData
  const formData = data?.data || data;
  console.log('🧾 Extracted form data:', formData);
  return formData;
  // Trả về: { orderAmount, merchant, currency, operation, orderDescription,
  //           orderInvoiceNumber, successUrl, errorUrl, cancelUrl, signature, isSandbox }
}

/**
 * Gọi backend để xác nhận thanh toán sau khi SePay redirect về.
 * Được gọi từ trang PaymentSuccess / PaymentError / PaymentCancel.
 */
export async function confirmPayment({ orderInvoiceNumber, transactionId, amount, status }) {
  const token = localStorage.getItem('lucy_token');
  console.log('📤 Sending payment confirmation:', { orderInvoiceNumber, transactionId, amount, status });

  const response = await fetch(`${API_BASE}/api/payment/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      orderInvoiceNumber,
      transactionId,
      amount,
      status,
    }),
    credentials: 'include'
  });

  const data = await parseResponse(response);
  console.log('📥 Confirm payment response:', data);

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể xác nhận thanh toán');
  }

  return data;
}
