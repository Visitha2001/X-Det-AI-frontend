'use client';
import { useState } from 'react';
import { DiseasePrediction, PredictionResponse } from '@/services/prediction_service';
import { 
    savePredictionDataToSession, 
    saveDiseaseDetailsToSession,
    fetchDiseaseDetails, 
    savePredictionWithDetails
} from '@/services/disease_service';
import { FaSpinner } from 'react-icons/fa';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleViewDetails = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      await savePredictionWithDetails(prediction, imageUrl);
      window.location.href = `/home/results?image=${encodeURIComponent(imageUrl)}`;
    } catch (err) {
      console.error('Failed to save results:', err);
      // Fallback to session storage if DB save fails
      try {
        savePredictionDataToSession(prediction);
        const topDisease = prediction.top_5_diseases[0].disease;
        const details = await fetchDiseaseDetails(topDisease);
        saveDiseaseDetailsToSession(details);
        window.location.href = `/home/results?image=${encodeURIComponent(imageUrl)}`;
      } catch (fallbackErr) {
        console.error('Failed in fallback:', fallbackErr);
        setProcessingError('Failed to process results. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (scanError) {
    return (
      <div className="w-full bg-gray-900 rounded-lg p-6 mt-4 max-w-3xl mx-auto border border-gray-700">
        <div className="flex flex-col items-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-red-400 mb-2">Error</p>
          <p className="text-gray-300 mb-4">{scanError}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prediction && !isScanning) return null;

  return (
    <div className="w-full p-2 border-2 border-gray-800 bg-black">
      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-4xl p-8 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-blue-400 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-gray-100 mb-2">Processing Results</h3>
              <p className="text-gray-400 text-center mb-4">
                Please wait while we save your scan results and prepare the detailed analysis.
              </p>
              {processingError && (
                <p className="text-red-400 text-sm mb-4">{processingError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gray-800 rounded-4xl p-6 sm:p-10 max-w-full mx-auto overflow-hidden border border-gray-700">
        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10 rounded-xl flex-col">
            <FaSpinner className="animate-spin text-blue-400 text-5xl mb-4" />
            <p className="text-gray-100 text-xl font-bold mt-2">Analyzing X-Ray image...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we analyze your X-Ray image.</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-100 mb-6">
          {isScanning ? (
            <div className="h-8 w-48 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full animate-pulse"></div>
          ) : (
            'Scan Results'
          )}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Column */}
          <div className="bg-gray-700 rounded-2xl overflow-hidden">
            {isScanning ? (
              <div className="w-full h-50 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
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
                <div className="h-6 w-64 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full animate-pulse mb-6"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <div className="h-5 w-32 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full animate-pulse"></div>
                        <div className="h-5 w-12 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-gray-500 h-2.5 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-5 w-40 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full animate-pulse"></div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Top 5 Predicted Conditions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {prediction.top_5_diseases.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded-2xl p-4 border border-blue-500/50 shadow-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-100">{item.disease}</span>
                        <span className="text-blue-400 font-semibold">
                          {(item.probability * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-600 rounded-full h-2.5">
                        <div
                          className="bg-blue-300 h-2.5 rounded-full"
                          style={{ width: `${item.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleViewDetails}
                    disabled={isProcessing}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-2xl shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>View Detailed Analysis</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </>
                    )}
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