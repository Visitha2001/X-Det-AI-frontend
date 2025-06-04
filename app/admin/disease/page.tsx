import { getAllDiseases } from '@/services/diseaseService';
import DiseaseCard from '@/components/admin/DiseaseCard';
import Link from 'next/link';

export default async function DiseasesPage() {
  const diseases = await getAllDiseases();

  const formattedDiseases = diseases.map((disease: any) => ({
    ...disease,
    id: disease._id,
  }));

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
        <div className="space-y-6">
          {formattedDiseases.map((disease: any) => {
            if (!disease.id) {
              console.warn('Invalid disease object:', disease);
              return null;
            }
            return <DiseaseCard key={disease.id} disease={disease} />;
          })}
        </div>
      )}
    </div>
  );
}