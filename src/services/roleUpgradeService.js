const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5149';

const parseResponse = async (response) => {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
};

const authHeader = () => {
    const token = localStorage.getItem('lucy_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function getUpgradePackages() {
    const response = await fetch(`${API_BASE}/api/role-upgrade/packages`, {
        method: 'GET',
        headers: { ...authHeader() },
        credentials: 'include'
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data?.message || 'Cannot load upgrade packages');
    return data?.data || [];
}

export async function upgradeUsingWallet(rolePriceId) {
    const response = await fetch(`${API_BASE}/api/role-upgrade/upgrade`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ rolePriceId }),
        credentials: 'include'
    });

    const data = await parseResponse(response);
    if (!response.ok) throw { status: response.status, message: data?.message || 'Upgrade failed', data };
    return data?.data || data;
}

export async function createUpgradePayment({ rolePriceId, paymentMethod }) {
    const response = await fetch(`${API_BASE}/api/role-upgrade/create-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ rolePriceId, paymentMethod }),
        credentials: 'include'
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data?.message || 'Cannot create upgrade payment');
    return data?.data || data;
}

export async function confirmUpgradePayment({ orderInvoiceNumber, transactionId, amount, status }) {
    const response = await fetch(`${API_BASE}/api/role-upgrade/confirm-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ orderInvoiceNumber, transactionId, amount, status }),
        credentials: 'include'
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data?.message || 'Cannot confirm upgrade payment');
    return data?.data || data;
}
