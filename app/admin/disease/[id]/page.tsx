import DiseaseForm from '@/components/admin/DiseaseForm';
import { getDisease } from '@/services/diseaseService';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditDiseasePage({ params }: PageProps) {
  const { id } = params;
  const disease = await getDisease(id);

  return (
    <div className="container mx-auto py-8">
      <DiseaseForm initialData={{ ...disease, id: disease._id }} />
    </div>
  );  
}