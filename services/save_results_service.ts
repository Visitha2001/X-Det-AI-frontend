import http from './http_service';
import { PredictionResponse } from './prediction_service';
import { DiseaseDetails } from './disease_service';

interface SaveResultParams {
  username: string;
  accessToken: string;
  imageUrl: string;
  prediction: PredictionResponse;
  diseaseDetails: DiseaseDetails;
}

export async function saveResultsToDB(params: SaveResultParams): Promise<void> {
  const { username, accessToken, imageUrl, prediction, diseaseDetails } = params;

  try {
    await http.post(
      '/save-results',
      {
        username,
        image_url: imageUrl,
        prediction_data: prediction,
        disease_details: diseaseDetails,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
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
