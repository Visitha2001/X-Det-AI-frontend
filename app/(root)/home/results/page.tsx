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
import ChatbotComponent from '@/components/ChatbotComponent';

interface DiseaseDetails {
  disease: string;
  details: string;
  language: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');
  const [diseaseDetails, setDiseaseDetails] = useState<DiseaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'si'>('en');
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  useEffect(() => {
    const storedData = getPredictionDataFromSession();
    const storedDetails = getDiseaseDetailsFromSession();
    
    if (storedData) {
      setPredictionData(storedData);
      if (storedDetails) {
        setDiseaseDetails(storedDetails);
        setSelectedDisease(storedDetails.disease);
        setLoading(false);
      } else {
        const initialDisease = storedData.top_5_diseases[0].disease;
        setSelectedDisease(initialDisease);
        fetchDiseaseDetails(initialDisease, language)
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

  useEffect(() => {
    // When language changes, refetch details for the currently selected disease
    if (selectedDisease) {
      setLoading(true);
      fetchDiseaseDetails(selectedDisease, language)
        .then(data => {
          setDiseaseDetails(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          setLoading(false);
        });
    }
  }, [language, selectedDisease]);

  const handleDiseaseSelect = (diseaseName: string) => {
    setSelectedDisease(diseaseName);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'si' : 'en');
  };

  if (error) {
    return (
      <div className="w-full bg-gray-900 rounded-xl p-6 mt-4 max-w-3xl mx-auto">
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
      <div className="flex flex-col lg:flex-row gap-4 max-w-full mx-auto">
        {/* Left Column - 40% width */}
        <div className="w-full sm:w-[40%] space-y-4">

          <div className="sm:flex sm:flex-col-2 gap-4 flex-col-1 w-auto">
            {/* Image Section */}
            <div className="bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-800/30 mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-blue-400 mb-3">X-Ray Image</h2>
              {imageUrl && (
                <div className="bg-gray-700 rounded-lg overflow-hidden sm:w-80 w-full flex">
                  <img
                    src={imageUrl}
                    alt="Scanned X-ray"
                    className="max-h-120 w-full"
                  />
                </div>
              )}
            </div>

            {/* Predictions Section */}
            <div className="relative bg-gray-800/50 rounded-xl p-6 shadow-sm border-2 border-gray-800/30 backdrop-blur-lg overflow-hidden">
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Predicted Conditions</h2>
              {predictionData && (
                <div className="space-y-4 relative z-10">
                  {predictionData.top_5_diseases.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleDiseaseSelect(item.disease)}
                      className={`relative w-full text-left p-4 rounded-xl border-2 transition-all group ${
                        selectedDisease === item.disease 
                          ? 'border-blue-500/50 bg-blue-900/40' 
                          : 'border-gray-700/30 hover:bg-blue-900/20 hover:border-blue-500/30'
                      } backdrop-blur-md overflow-hidden`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.3) 0%, rgba(31, 41, 55, 0.15) 100%)'
                      }}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shine"></div>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-200">{item.disease}</span>
                          <span className="text-blue-400 font-semibold">
                            {(item.probability * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Section - Sticky */}
          <div className="sticky top-25">
            <ChatbotComponent disease={selectedDisease || ''} />
          </div>
        </div>

        {/* Right Column - 60% width */}
        <div className="w-full sm:w-[60%] bg-gray-800/50 rounded-xl px-0 py-5 sm:px-8 sm:py-8 shadow-sm border border-gray-800/30 relative mb-12 sm:mb-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-blue-400 mb-4 md:mb-0">Detailed Analysis</h1>

            {/* Language Controls Wrapper */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none overflow-hidden
                  ${language === 'si' ? 'bg-blue-500/30' : 'bg-gray-800/30'}
                  backdrop-blur-sm border border-white/10`}
                aria-label={language === 'si' ? 'Switch to English' : 'Switch to Sinhala'}
              >
                <span
                  className={`absolute left-0 inline-flex text-[12px] items-center justify-center h-8 w-10 transition-all duration-300 transform rounded-full
                    ${language === 'si'
                      ? 'translate-x-6 bg-white/80 text-blue-900 font-bold'
                      : 'translate-x-0 bg-white/80 text-gray-900 font-bold'
                    }
                    backdrop-blur-sm`}
                >
                  {language === 'si' ? 'සිං' : 'ENG'}
                </span>
              </button>

              {/* Current Language Display (adjusted for dark theme) */}
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-gray-700 text-gray-200">
                {language === 'en' ? 'English' : 'සිංහල'}
              </span>
            </div>
          </div>

          <h2 
            className="relative text-xl font-semibold mb-2 sm:mb-4 p-2 rounded-sm sm:rounded-lg overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(9, 49, 119, 0.6) 0%, rgba(6, 33, 82, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(100, 149, 237, 0.2)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shine"></div>
              </div>
            </div>
            
            <span className="relative z-10 text-blue-300">
              {loading ? '' : selectedDisease ? "Selected Disease: " + selectedDisease : 'Select a condition'}
            </span>
          </h2>
          
          <div className="flex flex-col border-0 sm:border-2 rounded-xl border-blue-800/30 p-5">        
            {loading ? (
              <div className="space-y-4 relative p-15">
                <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-xl flex-col">
                  <Image
                    src='/assets/Loader.gif'
                    alt='loader'
                    width={100}
                    height={100}
                  />
                  <p className="text-blue-300 text-xl font-bold mt-2">Analyzing Medical Data...</p>
                  <p className="text-gray-400 text-sm mt-1">Please wait while we process your information.</p>
                </div>
                
                {[...Array(5)].map((_, index) => (
                  <div 
                    key={index} 
                    className="h-4 bg-gray-800 rounded-full animate-pulse" 
                    style={{ width: `${Math.random() * 50 + 50}%` }}
                  ></div>
                ))}
              </div>
            ) : diseaseDetails && selectedDisease ? (
            <div className="max-w-none disease-content text-gray-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-blue-400" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-blue-300" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-blue-200" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-blue-300" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,

                  // --- Table-specific components ---
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-4"> 
                      <table className="w-full text-left border-collapse border border-gray-400 rounded-lg overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-gray-700 text-gray-100" {...props} />,
                  tbody: ({ node, ...props }) => <tbody className="bg-gray-800" {...props} />,
                  th: ({ node, ...props }) => <th className="px-4 py-2 border-b border-gray-600 font-semibold text-blue-200" {...props} />,
                  td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-r border-gray-700 last:border-r-0" {...props} />,
                  // You might also consider adding styles for `tr` if needed, e.g., hover effects.
                  tr: ({node, ...props}) => <tr className="hover:bg-gray-700 transition-colors duration-200" {...props} />,
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