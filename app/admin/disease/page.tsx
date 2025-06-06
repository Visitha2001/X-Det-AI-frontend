'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllDiseases } from '@/services/diseaseService';
import DiseaseCard from '@/components/admin/DiseaseCard';
import Link from 'next/link';

export default function DiseasesPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/admin/login');
    } else {
      getAllDiseases()
        .then((data) => {
          const formatted = data.map((disease: any) => ({
            ...disease,
            id: disease._id,
          }));
          setDiseases(formatted);
        })
        .catch((error) => {
          console.error('Error fetching diseases:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isAdmin, router]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Diseases</h1>
        <Link
          href="/admin/disease/add"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          Add New Disease
        </Link>
      </div>

      {diseases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No diseases found. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-6 grid grid-cols-3 gap-3">
          {diseases.map((disease) => (
            disease.id ? (
              <DiseaseCard key={disease.id} disease={disease} />
            ) : (
              <div key={Math.random()}>Invalid disease data</div>
            )
          ))}
        </div>
      )}
    </div>
  );
}