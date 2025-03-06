import axios from 'axios';

const api = {
  // Analyze outfit from image
  analyzeOutfit: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

export default api;