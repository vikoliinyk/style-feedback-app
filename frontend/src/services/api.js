import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const api = {
  // Analyze outfit from image
  analyzeOutfit: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

export default api;