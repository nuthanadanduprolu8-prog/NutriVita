import api from './api';

export const scannerService = {
  // Identify food from uploaded image or text hint using genuine Vision AI
  async identifyFood(formData) {
    const res = await api.post('/scanner/identify', formData);
    return res.data;
  },

  // Extract printed nutrition label facts from uploaded food package image
  async analyzeLabel(formData) {
    const res = await api.post('/scanner/analyze-label', formData);
    return res.data;
  },

  // Get scanner AI configuration and provider health status
  async getStatus() {
    const res = await api.get('/scanner/status');
    return res.data;
  },

  // Get popular whole foods for quick selection chips
  async getPopularFoods() {
    const res = await api.get('/scanner/popular-foods');
    return res.data;
  },

  // Search verified whole foods in database
  async searchFallback(query) {
    const res = await api.get(`/scanner/search?q=${encodeURIComponent(query || '')}`);
    return res.data;
  },

  // Correct food name or recalculate nutrition based on portion size
  async correctOrRecalculate(params) {
    const res = await api.post('/scanner/correct', params);
    return res.data;
  },
};

export default scannerService;

