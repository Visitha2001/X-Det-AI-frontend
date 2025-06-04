'use client';

import Link from 'next/link';
import { deleteDisease } from '@/services/diseaseService';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

interface DiseaseCardProps {
  disease: {
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
    prevention: string[];
    imageUrl?: string;
  };
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this disease?')) {
      try {
        await deleteDisease(disease.id);
        router.refresh();
      } catch (error) {
        alert('Failed to delete disease');
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
      {disease.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={disease.imageUrl} 
            alt={disease.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-white mb-2">{disease.name}</h2>
          <div className="flex space-x-2">
            {disease.id && (
              <Link
                href={`/admin/disease/${disease.id}`}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
              >
                Edit
              </Link>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-blue-400 mb-1">Description</h3>
            <div className={`prose text-gray-300 prose-invert max-w-none ${!expanded ? 'line-clamp-3' : ''}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {disease.description}
              </ReactMarkdown>
            </div>
          </div>

          {expanded && (
            <>
              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Symptoms</h3>
                <ul className="text-gray-300 list-disc pl-5">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Treatments</h3>
                <ul className="text-gray-300 list-disc pl-5">
                  {disease.treatments.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Prevention</h3>
                <ul className="text-gray-300 list-disc pl-5">
                  {disease.prevention.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-blue-400 rounded-md transition-colors"
          >
            {expanded ? 'Show Less' : 'More Details'}
          </button>
        </div>
      </div>
    </div>
  );
}