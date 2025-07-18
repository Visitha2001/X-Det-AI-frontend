import http from './http_service';
import { PredictionResponse } from './prediction_service';
import { getAccessTokenFromLocalStorage, getUsernameFromSession, saveResultsToDB } from './save_results_service';

export interface DiseaseDetails {
  disease: string;
  details: string;
  language: string;
}

export async function fetchDiseaseDetails(diseaseName: string, language: string = 'en'): Promise<DiseaseDetails> {
  try {
    const response = await http.get<DiseaseDetails>(
      `/disease-details/${encodeURIComponent(diseaseName)}?language=${language}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching disease details:', error);
    throw new Error('Failed to fetch disease details. Please try again later.');
  }
}

// Session storage helpers
export function savePredictionDataToSession(prediction: PredictionResponse): void {
  try {
    sessionStorage.setItem('predictionData', JSON.stringify(prediction));
  } catch (error) {
    console.error('Error saving prediction to session storage:', error);
  }
}

export function saveDiseaseDetailsToSession(details: DiseaseDetails): void {
  try {
    sessionStorage.setItem('diseaseDetails', JSON.stringify(details));
  } catch (error) {
    console.error('Error saving disease details to session storage:', error);
  }
}

export function getPredictionDataFromSession(): PredictionResponse | null {
  try {
    const data = sessionStorage.getItem('predictionData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading prediction from session storage:', error);
    return null;
  }
}

export function getDiseaseDetailsFromSession(): DiseaseDetails | null {
  try {
    const data = sessionStorage.getItem('diseaseDetails');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading disease details from session storage:', error);
    return null;
  }
}

export async function savePredictionWithDetails(
  prediction: PredictionResponse,
  imageUrl: string
): Promise<void> {
  try {
    const username = getUsernameFromSession();
    const accessToken = getAccessTokenFromLocalStorage();
    
    if (!username || !accessToken) {
      throw new Error('User authentication data not found. Please log in again.');
    }

    const topDisease = prediction.top_5_diseases[0].disease;
    const diseaseDetails = await fetchDiseaseDetails(topDisease);

    // Save to DB
    await saveResultsToDB({
      username,
      accessToken,
      imageUrl,
      prediction,
      diseaseDetails,
      disease: topDisease,
      details: diseaseDetails.details
    });

    // Save to session storage
    savePredictionDataToSession(prediction);
    saveDiseaseDetailsToSession(diseaseDetails);
    
  } catch (error) {
    console.error('Error in savePredictionWithDetails:', error);
    throw error;
  }
}
