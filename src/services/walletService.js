// src/services/walletService.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5149';

const parseResponse = async (response) => {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
};

/**
 * Get the authenticated user's wallet balance.
 * Returns { balance: number, currency: string }
 */
export async function getBalance() {
  const token = localStorage.getItem('lucy_token');

  const response = await fetch(`${API_BASE}/api/wallet/balance`, {
    method: 'GET',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    credentials: 'include'
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể lấy số dư ví');
  }

  // The backend returns a wrapped Result: { status, message, data: { balance, currency } }
  return data?.data || { balance: 0, currency: 'VND' };
}
