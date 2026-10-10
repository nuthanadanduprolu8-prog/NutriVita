import api from './api';

export const symptomService = {
  // Fetch all available symptoms with optional category and search filters
  async getSymptoms({ category = 'all', search = '', lang = 'en' } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    if (lang) params.append('lang', lang);

    const res = await api.get(`/symptoms?${params.toString()}`);
    return res.data;
  },

  // Fetch single symptom details
  async getSymptomById(id) {
    const res = await api.get(`/symptoms/${id}`);
    return res.data;
  },

  // Submit multiple symptoms for educational nutrition assessment
  async assessSymptoms({ symptoms = [], language = 'en', userId } = {}) {
    const res = await api.post('/symptoms/assess', {
      symptoms,
      language,
      userId,
    });
    return res.data;
  },
};

export default symptomService;
