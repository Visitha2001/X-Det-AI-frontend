import http from './http_service';
import { PredictionResponse } from './prediction_service';
import { DiseaseDetails } from './disease_service';

interface SaveResultParams {
  username: string;
  accessToken: string;
  imageUrl: string;
  prediction: PredictionResponse;
  diseaseDetails: DiseaseDetails;
  disease: string;
  details: string;
}

export async function saveResultsToDB(params: SaveResultParams): Promise<void> {
  const { username, accessToken, imageUrl, prediction, diseaseDetails, disease, details } = params;

  try {
    await http.post(
      '/save-result',
      {
        username,
        image_url: imageUrl,
        prediction_data: {
          image_url: prediction.image_url,
          top_5_diseases: prediction.top_5_diseases.map(d => ({
            disease: d.disease,
            probability: d.probability
          }))
        },
        disease_details: {
          disease: diseaseDetails.disease,
          details: diseaseDetails.details
        },
        disease,
        details,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  } catch (error) {
    console.error('Error saving results to DB:', error);
    throw new Error('Failed to save results to database. Please try again.');
  }
}

export function getUsernameFromSession(): string | null {
  try {
    return sessionStorage.getItem('username');
  } catch (error) {
    console.error('Error getting username from session storage:', error);
    return null;
  }
}

export function getAccessTokenFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting access token from local storage:', error);
    return null;
  }
}