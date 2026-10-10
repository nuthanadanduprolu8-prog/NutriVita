import api from './api';

export const foodService = {
  async getFoods({ search = '', category = 'all', sort = '', richIn = '', limit = 50, page = 1 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    if (sort) params.append('sort', sort);
    if (richIn) params.append('richIn', richIn);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);

    const res = await api.get(`/foods?${params.toString()}`);
    return res.data;
  },

  async getFoodById(id) {
    const res = await api.get(`/foods/${id}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/foods/meta/categories');
    return res.data;
  },

  async addFood(foodData) {
    const res = await api.post('/foods', foodData);
    return res.data;
  }
};

export default foodService;
