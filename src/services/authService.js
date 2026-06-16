const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/Auth`;

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Include if backend sets HttpOnly cookies
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0] || 'Login failed');
        }
        return data;
    },

    register: async (userData) => {
        // userData expects: fullName, email, password, confirmPassword, birthday, phoneNumber
        // Remove accountType since backend doesn't use it (default is LUCY)
        const { accountType, ...dataToSend } = userData;
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0] || 'Registration failed');
        }
        return data;
    },

    logout: async (refreshToken = null) => {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include' // To clear HttpOnly cookie
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Logout failed');
        }
        return data;
    },

    refreshToken: async (refreshToken = null) => {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include' // To send HttpOnly cookie
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Refresh token failed');
        }
        return data;
    }
};
