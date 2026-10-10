import api from './api';

export const aiService = {
  // Send message to VitaMate AI
  async sendMessage({ message, history = [], language = 'en', userProfile = {} }) {
    const res = await api.post('/ai/chat', {
      message,
      history,
      language,
      userProfile,
    });
    return res.data;
  },

  // Get suggested prompt chips
  async getPrompts(language = 'en') {
    const res = await api.get(`/ai/prompts?lang=${language}`);
    return res.data;
  },
};

export default aiService;
