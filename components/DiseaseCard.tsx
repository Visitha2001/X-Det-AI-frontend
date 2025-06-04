'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  return (
    <Link href={`/diseases/${disease.id}`}>
      <div className="bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        {disease.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img 
              src={disease.imageUrl} 
              alt={disease.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-white mb-3">{disease.name}</h2>
          
          <div className="prose text-gray-300 prose-invert max-w-none line-clamp-3 mb-4 flex-grow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {disease.description}
            </ReactMarkdown>
          </div>
          
          <div className="mt-auto">
            <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium rounded-2xl shadow-md hover:from-blue-700 hover:to-blue-800 duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}