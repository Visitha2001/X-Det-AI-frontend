'use client';

import Link from 'next/link';
import { deleteDisease } from '@/services/diseaseService';
import { useRouter } from 'next/navigation';
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
  };
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const router = useRouter();

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
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-white mb-2">{disease.name}</h2>
          <div className="flex space-x-2">
          {disease.id ? (
            <Link
                href={`/admin/disease/${disease.id}`}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
                Edit
            </Link>
            ) : (
                <span className="text-gray-500">Edit</span>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-blue-500 mb-1">Description</h3>
            <div className="prose  text-white prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {disease.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}