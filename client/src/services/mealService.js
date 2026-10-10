import api from './api';

export const mealService = {
  async balanceMeal(items) {
    const res = await api.post('/meals/balance', { items });
    return res.data;
  },

  async generatePlan({ dietaryPreference = 'vegetarian', targetCalories = 2000 } = {}) {
    const res = await api.post('/meals/generate', { dietaryPreference, targetCalories });
    return res.data;
  },

  async savePlan(planData) {
    const res = await api.post('/meals/save', planData);
    return res.data;
  },

  async getSavedPlans() {
    const res = await api.get('/meals/saved');
    return res.data;
  },

  async deletePlan(id) {
    const res = await api.delete(`/meals/saved/${id}`);
    return res.data;
  },
};

export default mealService;
