'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllDiseases } from '@/services/diseaseService';
import DiseaseCard from '@/components/DiseaseCard';
import { FaSpinner } from 'react-icons/fa';

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
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const data = await getAllDiseases();
        const formattedData = data.map((disease: any) => ({
          ...disease,
          id: disease._id, // Convert MongoDB's _id to id
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Diseases Information</h1>
        </div>

        {diseases.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No diseases found. Add a new disease to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}