const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5149';
const API_URL = `${API_BASE_URL}/api/Auth`;

// Helper to parse JSON safely
const parseResponse = async (response) => {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
};

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Include if backend sets HttpOnly cookies
        });
        const data = await parseResponse(response);
        if (!response.ok) {
            throw new Error(data?.message || data?.errors?.[0] || 'Login failed');
        }
        return data;
    },

    // register: async (userData) => {
    //     // userData expects: fullName, email, password, confirmPassword, birthday, phoneNumber
    //     const response = await fetch(`${API_URL}/register`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(userData)
    //     });
    //     const data = await parseResponse(response);
    //     if (!response.ok) {
    //         throw new Error(data?.message || data?.errors?.[0] || 'Registration failed');
    //     }
    //     return data;
    // },

    // logout: async (refreshToken = null) => {
    //     const response = await fetch(`${API_URL}/logout`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ refreshToken }),
    //         credentials: 'include' // To clear HttpOnly cookie
    //     });
    //     const data = await parseResponse(response);
    //     if (!response.ok) {
    //         throw new Error(data?.message || 'Logout failed');
    //     }
    //     return data;
    // },

    // refreshToken: async (refreshToken = null) => {
    //     const response = await fetch(`${API_URL}/refresh-token`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ refreshToken }),
    //         credentials: 'include' // To send HttpOnly cookie
    //     });
    //     const data = await parseResponse(response);
    //     if (!response.ok) {
    //         throw new Error(data?.message || 'Refresh token failed');
    //     }
    //     return data;
    //     return response.json();
    // },

  register: async (userData) => {
    // userData expects: fullName, email, password, confirmPassword, birthday, phoneNumber
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      let message = 'Registration failed';
      try {
        const body = await response.json();
        // Backend wraps errors in { message, errors: [...] }
        if (body?.errors && Array.isArray(body.errors) && body.errors.length > 0) {
          message = body.errors.join('\n');
        } else if (body?.message) {
          message = body.message;
        }
      } catch {
        // response body was not JSON — use status text
        message = `Registration failed (${response.status})`;
      }
      throw new Error(message);
    }
    return response.json();
  },

  logout: async (refreshToken = null) => {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include' // To clear HttpOnly cookie
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    return response.json();
  },

  refreshToken: async (refreshToken = null) => {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include' // To send HttpOnly cookie
    });
    if (!response.ok) {
      throw new Error('Refresh token failed');
    }
    return response.json();
  }
};
