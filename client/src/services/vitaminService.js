import api from './api';

export const vitaminService = {
  async getVitamins({ type = 'all', search = '' } = {}) {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (search) params.append('search', search);

    const res = await api.get(`/vitamins?${params.toString()}`);
    return res.data;
  },

  async getVitaminById(id) {
    const res = await api.get(`/vitamins/${id}`);
    return res.data;
  }
};

export default vitaminService;
