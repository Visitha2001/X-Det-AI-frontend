import http from './http_service';

export const createDisease = async (data: any) => {
  try {
    const response = await http.post('/diseases/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDisease = async (id: string, data: any) => {
    try {
      const response = await http.put(`/diseases/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const getDisease = async (id: string) => {
  try {
    const response = await http.get(`/diseases/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDiseases = async () => {
    try {
      const response = await http.get('/diseases/');
      return response.data;
    } catch (error) {
      throw error;
    }
};
  
export const deleteDisease = async (id: string) => {
    try {
      await http.delete(`/diseases/${id}`);
    } catch (error) {
      throw error;
    }
};