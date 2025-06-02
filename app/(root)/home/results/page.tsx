'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  getPredictionDataFromSession, 
  getDiseaseDetailsFromSession,
  fetchDiseaseDetails,
} from '@/services/disease_service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaSpinner } from 'react-icons/fa';

interface DiseaseDetails {
  disease: string;
  details: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');
  const [diseaseDetails, setDiseaseDetails] = useState<DiseaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<any>(null);

  useEffect(() => {
    // Get prediction data from sessionStorage
    const storedData = getPredictionDataFromSession();
    const storedDetails = getDiseaseDetailsFromSession();
    
    if (storedData) {
      setPredictionData(storedData);
      if (storedDetails) {
        setDiseaseDetails(storedDetails);
        setLoading(false);
      } else {
        fetchDiseaseDetails(storedData.top_5_diseases[0].disease)
          .then(data => {
            setDiseaseDetails(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setLoading(false);
          });
      }
    } else {
      setError('No prediction data found');
      setLoading(false);
    }
  }, []);

  const handleDiseaseSelect = (diseaseName: string) => {
    setLoading(true);
    fetchDiseaseDetails(diseaseName)
      .then(data => {
        setDiseaseDetails(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      });
  };

  if (error) {
    return (
      <div className="w-full bg-gray-900 rounded-lg p-6 mt-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-red-400 mb-2">Error</p>
          <p className="text-gray-400 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-900 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 max-w-full mx-auto">
        {/* Left Column - 30% width */}
        <div className="w-full lg:w-[30%] space-y-8">
          {/* Image Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">X-Ray Image</h2>
            {imageUrl && (
              <div className="bg-gray-700 rounded-lg overflow-hidden flex">
                <img
                  src={imageUrl}
                  alt="Scanned X-ray"
                  className="max-h-120 w-full"
                />
              </div>
            )}
          </div>

          {/* Predictions Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Predicted Conditions</h2>
            {predictionData && (
              <div className="space-y-4">
                {predictionData.top_5_diseases.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleDiseaseSelect(item.disease)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      diseaseDetails?.disease === item.disease 
                        ? 'border-blue-500 bg-blue-900/50' 
                        : 'border-gray-700 hover:bg-blue-900/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-200">{item.disease}</span>
                      <span className="text-blue-400 font-semibold">
                        {(item.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.probability * 100}%` }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 70% width */}
        <div className="w-full lg:w-[70%] bg-gray-800 rounded-xl px-0 py-5 sm:px-8 sm:py-8 shadow-sm border border-gray-700 relative mb-12 sm:mb-0">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Detailed Analysis</h1>

          <h2 className="text-xl font-semibold mb-2 sm:mb-4 bg-blue-900 p-2 rounded-sm sm:rounded-lg text-blue-300">
            {loading ? '' : "Selected Disease : " + diseaseDetails?.disease || 'Select a condition'}
          </h2>
          
          <div className="flex flex-col border-0 sm:border-2 rounded-xl border-blue-900 px-5">        
            {loading ? (
              <div className="space-y-4 relative mt-20">
                {/* Spinner overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-xl flex-col">
                  <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />
                  <p className="text-blue-300 text-xl font-bold mt-2">Analyzing Medical Data...</p>
                  <p className="text-gray-400 text-sm mt-1">Please wait while we process your information.</p>
                </div>
                
                {/* Keep skeleton loader as fallback */}
                {[...Array(5)].map((_, index) => (
                  <div 
                    key={index} 
                    className="h-4 bg-gray-800 rounded-full animate-pulse" 
                    style={{ width: `${Math.random() * 50 + 50}%` }}
                  ></div>
                ))}
              </div>
            ) : diseaseDetails ? (
              <div className="max-w-none disease-content text-gray-300">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-blue-400" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-blue-300" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-4 mb-2 text-blue-200" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-blue-300" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                  }}
                >
                  {diseaseDetails.details}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg">
                  Select a condition from the list to view detailed information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}