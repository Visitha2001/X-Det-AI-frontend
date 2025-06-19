'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllDiseases } from '@/services/diseaseService';
import DiseaseCard from '@/components/DiseaseCard';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import AllReviewsComponent from '@/components/AllReviewsComponent';
import Image from 'next/image';

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
        {/* <FaSpinner className="animate-spin text-blue-400 text-5xl mb-4" /> */}
        <Image
           src='/assets/Loader.gif'
           alt='loader'
           width={100}
           height={100}
        />
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
    <div className="min-h-screen bg-gray-900">
      {/* Video Header Section */}
      <div className="relative h-[380px] w-full overflow-hidden -mt-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-top z-0 
            [mask-image:linear-gradient(to_bottom,white_100%,transparent_100%)]
            [-webkit-mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]"
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            if (video.currentTime > 15) {
              video.currentTime = 3;
            }
          }}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            video.currentTime = 3;
          }}
        >
          <source src="https://res.cloudinary.com/dqmeeveij/video/upload/v1750220499/supawork-11b0029d044448f7895d49e4193f40da_lc3i86.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <h1 className="text-5xl font-bold text-gray-300 text-center">Diseases Information</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="sm:px-50 px-6 sm:py-8 py-2 mx-auto -mt-6">
        <div className="flex flex-col sm:flex-row justify-end items-center mb-8 gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 sm:mb-0">
            {filteredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </div>

      <AllReviewsComponent />
    </div>
  );
}
