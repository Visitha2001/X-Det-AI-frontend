import http from './http_service';
import { useSession } from 'next-auth/react';

export interface HistoryItem {
  username: string;
  disease_details: {
    disease: string;
    details: string;
  };
  prediction_data: {
    image_url: string;
    top_5_diseases: {
      disease: string;
      probability: number;
    }[];
  };
  image_url: string;
  details: string;
  disease: string;
  timestamp: string;
}

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const username = sessionStorage.getItem('username');
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || !username) {
      throw new Error('No access token found');
    }

    const response = await http.get(`/results/${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const useHistory = () => {
  const { data: session } = useSession();
  const username = session?.user?.email || session?.user?.name;

  const fetchHistory = async () => {
    if (!username) return [];
    return await getHistory();
  };

  return { fetchHistory };
};