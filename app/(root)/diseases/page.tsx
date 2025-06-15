'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllDiseases } from '@/services/diseaseService';
import DiseaseCard from '@/components/DiseaseCard';
import { FaSpinner, FaSearch } from 'react-icons/fa';

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  imageUrl?: string;
}

export default function DiseasesPage() {
  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get('search') || '';

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const data = await getAllDiseases();
        const formattedData = data.map((disease: any) => ({
          ...disease,
          id: disease._id,
        }));
        setDiseases(formattedData);
      } catch (err) {
        setError('Failed to load diseases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = searchQuery
    ? diseases
        .filter(disease =>
          disease.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10 rounded-xl flex-col">
        <FaSpinner className="animate-spin text-blue-400 text-5xl mb-4" />
        <div className="text-center text-blue-400">Loading diseases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 sm:p-8 p-1">
      <div className="sm:px-50 px-2 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Diseases Information</h1>

          <div className="relative w-full sm:w-1/3">
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>

            <input
              type="text"
              placeholder="Search diseases..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full rounded-xl pl-12 pr-10 py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-gray-800 border custom-scrollbar border-gray-700 rounded-xl max-h-48 overflow-y-auto z-20">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="px-4 py-2 text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.name)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {filteredDiseases.length === 0 ? (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center">
            <div className="mb-4 rounded-full p-8 bg-blue-900">
              <FaSearch className="text-blue-400 text-5xl" />
            </div>
            <p>No diseases found for "<span className="font-semibold">{searchQuery}</span>".</p>
            <p className="text-sm mt-2">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
            {filteredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}