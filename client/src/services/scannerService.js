import api from './api';

export const scannerService = {
  async identifyFood(formData) {
    const res = await api.post('/scanner/identify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async searchFallback(query) {
    const res = await api.get(`/scanner/search?q=${encodeURIComponent(query || '')}`);
    return res.data;
  },

  async correctOrRecalculate(params) {
    const res = await api.post('/scanner/correct', params);
    return res.data;
  },
};

export default scannerService;
