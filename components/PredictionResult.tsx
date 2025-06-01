'use client';
import { DiseasePrediction, PredictionResponse } from '@/services/prediction_service';
import { 
    savePredictionDataToSession, 
    saveDiseaseDetailsToSession,
    fetchDiseaseDetails, 
    savePredictionWithDetails
  } from '@/services/disease_service';

interface PredictionResultsProps {
  imageUrl: string;
  isScanning: boolean;
  scanError: string | null;
  prediction: PredictionResponse;
  onRetry: () => void;
}

export default function PredictionResults({
  imageUrl,
  isScanning,
  scanError,
  prediction,
  onRetry
}: PredictionResultsProps) {
  if (scanError) {
    return (
      <div className="w-full bg-white rounded-lg p-6 mt-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-red-600 mb-2">Error</p>
          <p className="text-gray-600 mb-4">{scanError}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prediction && !isScanning) return null;

  return (
    <div className="w-full p-4 mt-4">
      <div className="relative bg-white rounded-xl p-10 max-w-full mx-auto overflow-hidden">
        {/* Spinner overlay - only shown when scanning */}
        {isScanning && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl flex-col">
            <div className="animate-spin rounded-full h-16 w-16 border-t-8 border-b-8 border-blue-500"></div>
            <p className="text-gray-700 text-xl font-bold mt-2">Analyzing X-Ray image...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait while we analyze your X-Ray image.</p>
          </div>
        )}

        <div className="absolute inset-0 rounded-xl z-[-1]" />

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isScanning ? (
            <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"></div>
          ) : (
            'Scan Results'
          )}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Column */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {isScanning ? (
              <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
            ) : (
              <img
                src={imageUrl}
                alt="Scanned X-ray"
                className="w-full h-auto object-contain max-h-64 lg:max-h-full"
              />
            )}
          </div>

          {/* Predictions Columns */}
          <div className="lg:col-span-2">
            {isScanning ? (
              <>
                <div className="h-6 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse mb-6"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-5 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gray-300 h-2.5 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"></div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Top 5 Predicted Conditions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {prediction.top_5_diseases.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 shadow border border-blue-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{item.disease}</span>
                        <span className="text-blue-600 font-semibold">
                          {(item.probability * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-300 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${item.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                <button
                    onClick={async () => {
                        try {
                            await savePredictionWithDetails(prediction, imageUrl);
                            window.location.href = `/home/results?image=${encodeURIComponent(imageUrl)}`;
                        } catch (err) {
                            console.error('Failed to save results:', err);
                            // Fallback to session storage if DB save fails
                            savePredictionDataToSession(prediction);
                            const topDisease = prediction.top_5_diseases[0].disease;
                            try {
                                const details = await fetchDiseaseDetails(topDisease);
                                saveDiseaseDetailsToSession(details);
                                window.location.href = `/home/results?image=${encodeURIComponent(imageUrl)}`;
                            } catch (err) {
                                console.error('Failed to fetch disease details:', err);
                                // Still redirect but components will handle missing data
                                window.location.href = `/home/results?image=${encodeURIComponent(imageUrl)}`;
                            }
                        }
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                    <span>View Detailed Analysis</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}