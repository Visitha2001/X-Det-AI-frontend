import http from './http_service';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllUsers = async () => {
  try {
    const response = await http.get('/users/all', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserCount = async () => {
  try {
    const response = await http.get('/users/count', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};