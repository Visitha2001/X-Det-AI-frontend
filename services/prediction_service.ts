// services/prediction_service.ts
import http from './http_service';

export interface DiseasePrediction {
  disease: string;
  probability: number;
}

export interface PredictionResponse {
  image_url: string;
  top_5_diseases: DiseasePrediction[];
}

export interface PredictionError {
  message: string;
  status?: number;
  data?: any;
}

export const predictImage = async (imageUrl: string): Promise<PredictionResponse> => {
  try {
    const response = await http.post<PredictionResponse>('/predict-image', {
      image_url: imageUrl
    });
    
    if (!response.data?.top_5_diseases) {
      throw {
        message: 'Invalid prediction response format',
        status: 500,
        data: response.data
      };
    }

    return response.data;
  } catch (error: any) {
    console.error('Prediction failed:', error);
    
    const normalizedError: PredictionError = {
      message: error.response?.data?.message || 
              error.message || 
              'Failed to process image prediction',
      status: error.response?.status,
      data: error.response?.data
    };

    throw normalizedError;
  }
};

export const getPredictionResult = async (predictionId: string): Promise<PredictionResponse> => {
  try {
    const response = await http.get<PredictionResponse>(`/predict-image/${predictionId}`);
    
    if (!response.data?.image_url) {
      throw {
        message: 'Invalid prediction result format',
        status: 500,
        data: response.data
      };
    }

    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch prediction result:', error);
    
    const normalizedError: PredictionError = {
      message: error.response?.data?.message || 
              error.message || 
              'Failed to fetch prediction results',
      status: error.response?.status,
      data: error.response?.data
    };

    throw normalizedError;
  }
};