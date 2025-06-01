'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  getPredictionDataFromSession, 
  getDiseaseDetailsFromSession,
  fetchDiseaseDetails 
} from '@/services/disease_service';

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
      <div className="w-full bg-white rounded-lg p-6 mt-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-red-600 mb-2">Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const renderDiseaseDetails = () => {
    if (!diseaseDetails) return null;

    return diseaseDetails.details.split('\n\n').map((paragraph, index) => {
      // Check for main headers (##)
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-800">
            {paragraph.replace(/^##\s/, '')}
          </h2>
        );
      }
      
      // Check for subheaders (###)
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-700">
            {paragraph.replace(/^###\s/, '')}
          </h3>
        );
      }
      
      // Check for numbered list items
      if (/^\d+\.\s/.test(paragraph)) {
        return (
          <ol key={index} className="list-decimal pl-6 mb-4 space-y-2">
            {paragraph.split('\n').filter(item => item.trim()).map((item, i) => (
              <li key={i} className="text-gray-700">
                {item.replace(/^\d+\.\s/, '')}
              </li>
            ))}
          </ol>
        );
      }
      
      // Check for bullet points (lines starting with *)
      if (paragraph.startsWith('* ')) {
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
            {paragraph.split('\n').filter(item => item.trim()).map((item, i) => (
              <li key={i} className="text-gray-700">
                {item.replace(/^\*\s/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Check for bold text (**text**)
      if (paragraph.includes('**')) {
        return (
          <p key={index} className="text-gray-700 mb-4" dangerouslySetInnerHTML={{
            __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-full mx-auto">
        {/* Left Column - 30% width */}
        <div className="w-full lg:w-[30%] space-y-8">
          {/* Image Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">X-Ray Image</h2>
            {imageUrl && (
              <div className="bg-gray-100 rounded-lg overflow-hidden flex">
                <img
                  src={imageUrl}
                  alt="Scanned X-ray"
                  className="max-h-120 w-full"
                />
              </div>
            )}
          </div>

          {/* Predictions Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Predicted Conditions</h2>
            {predictionData && (
              <div className="space-y-4">
                {predictionData.top_5_diseases.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleDiseaseSelect(item.disease)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      diseaseDetails?.disease === item.disease 
                        ? 'border-blue-500 bg-blue-100' 
                        : 'border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.disease}</span>
                      <span className="text-blue-600 font-semibold">
                        {(item.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
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
        <div className="w-full lg:w-[70%] bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Detailed Analysis</h1>
          
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            {loading ? 'Loading...' : "Selected Disease : " + diseaseDetails?.disease || 'Select a condition'}
          </h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-4 bg-gray-200 rounded-full animate-pulse" 
                  style={{ width: `${Math.random() * 50 + 50}%` }}
                ></div>
              ))}
            </div>
          ) : diseaseDetails ? (
            <div className="max-w-none">
              {renderDiseaseDetails()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">
                Select a condition from the list to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}