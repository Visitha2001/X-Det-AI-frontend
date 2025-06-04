'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDisease } from '@/services/diseaseService';
import { FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export default function DiseaseDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const data = await getDisease(id);
        setDisease({
          ...data,
          id: data._id
        });
      } catch (err) {
        setError('Failed to load disease details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDisease();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10 rounded-xl flex-col">
        <FaSpinner className="animate-spin text-blue-400 text-5xl mb-4" />
        <div className="text-center text-blue-400">Loading disease details...</div>
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

  if (!disease) {
    return notFound();
  }

  // Helper function to properly format markdown lists with spacing
  const arrayToMarkdown = (items: string[]) => {
    return items.map(item => `- ${item.trim()}`).join('\n\n');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="container w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-500 mb-10">{disease.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            {disease.imageUrl && (
              <div className="w-full h-150 bg-gray-800 rounded-lg mb-6 overflow-hidden">
                <img 
                  src={disease.imageUrl} 
                  alt={disease.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">Description</h2>
            <div className="prose prose-invert text-white max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {disease.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">Symptoms</h2>
            <div className="prose text-white prose-invert max-w-none 
                          prose-ul:list-disc prose-ul:pl-5
                          prose-li:my-2 prose-li:marker:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {arrayToMarkdown(disease.symptoms)}
              </ReactMarkdown>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">Treatments</h2>
            <div className="prose text-white prose-invert max-w-none
                          prose-ul:list-disc prose-ul:pl-5
                          prose-li:my-2 prose-li:marker:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {arrayToMarkdown(disease.treatments)}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Prevention</h2>
          <div className="prose text-white prose-invert max-w-none
                        prose-ul:list-disc prose-ul:pl-5
                        prose-li:my-2 prose-li:marker:text-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {arrayToMarkdown(disease.prevention)}
            </ReactMarkdown>
          </div>
        </div>

        <div className="text-gray-400 text-sm mt-8">
          {disease.created_at && (
            <p>Created: {new Date(disease.created_at).toLocaleDateString()}</p>
          )}
          {disease.updated_at && (
            <p>Last updated: {new Date(disease.updated_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}