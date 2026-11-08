import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData, { timeout: 120000 });
    if (response.data.token) {
      localStorage.setItem('nutrivita_token', response.data.token);
      localStorage.setItem('nutrivita_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials, { timeout: 120000 });
    if (response.data.token) {
      localStorage.setItem('nutrivita_token', response.data.token);
      localStorage.setItem('nutrivita_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('nutrivita_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    try {
      localStorage.removeItem('nutrivita_token');
      localStorage.removeItem('nutrivita_user');
    } catch {
      // Ignore storage errors
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('nutrivita_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    try {
      return localStorage.getItem('nutrivita_token');
    } catch {
      return null;
    }
  }
};

export default authService;
