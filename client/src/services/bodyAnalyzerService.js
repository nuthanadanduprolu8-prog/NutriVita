import api from './api';

export const bodyAnalyzerService = {
  // Get body change analyzer health status and active modes
  async getStatus() {
    const res = await api.get('/body-analyzer/status');
    return res.data;
  },

  // Get curated body areas and observable physical changes
  async getAreas(language = 'en') {
    const res = await api.get(`/body-analyzer/areas?language=${encodeURIComponent(language)}`);
    return res.data;
  },

  // Assess physical signs with optional photo upload
  async assess(formData) {
    const res = await api.post('/body-analyzer/assess', formData);
    return res.data;
  },
};

export default bodyAnalyzerService;
