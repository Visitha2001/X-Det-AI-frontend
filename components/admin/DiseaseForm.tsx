'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { createDisease, updateDisease } from '@/services/diseaseService';
import { uploadImage } from '@/services/image_upload_service';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface DiseaseFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
    prevention: string[];
    imageUrl?: string;
  };
}

export default function DiseaseForm({ initialData }: DiseaseFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [symptoms, setSymptoms] = useState<string[]>(initialData?.symptoms || ['']);
  const [treatments, setTreatments] = useState<string[]>(initialData?.treatments || ['']);
  const [prevention, setPrevention] = useState<string[]>(initialData?.prevention || ['']);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsSubmitting(true);
      const response = await uploadImage(file);
      setImageUrl(response.secure_url);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image');
      setImagePreview('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = {
        name,
        description,
        symptoms: symptoms.filter(s => s.trim() !== ''),
        treatments: treatments.filter(t => t.trim() !== ''),
        prevention: prevention.filter(p => p.trim() !== ''),
        imageUrl
      };

      if (initialData?.id) {
        await updateDisease(initialData.id, data);
      } else {
        await createDisease(data);
      }
      
      // Redirect or show success message
      window.location.href = '/admin/disease';
    } catch (err: any) {
      setError(err.message || 'Failed to save disease');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const handleItemChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string | undefined
  ) => {
    setter(prev => prev.map((item, i) => (i === index ? value || '' : item)));
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg" data-color-mode="dark">
      <h1 className="text-2xl font-bold mb-6">
        {initialData?.id ? 'Edit Disease' : 'Add New Disease'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Disease Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <div className="bg-gray-800 rounded overflow-hidden">
            <MDEditor
              value={description}
              onChange={(value) => setDescription(value || '')}
              height={300}
              previewOptions={{
                className: 'bg-gray-900 text-gray-100'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Symptoms</label>
          {symptoms.map((symptom, index) => (
            <div key={index} className="mb-3 flex items-start">
              <div className="flex-1 bg-gray-800 rounded overflow-hidden">
                <MDEditor
                  value={symptom}
                  onChange={(value) => handleItemChange(setSymptoms, index, value)}
                  height={150}
                  previewOptions={{
                    className: 'bg-gray-900 text-gray-100'
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(setSymptoms, index)}
                className="ml-2 p-2 text-red-400 hover:text-red-300"
                aria-label="Remove symptom"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setSymptoms)}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Add Symptom
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium">Treatments</label>
          {treatments.map((treatment, index) => (
            <div key={index} className="mb-3 flex items-start">
              <div className="flex-1 bg-gray-800 rounded overflow-hidden">
                <MDEditor
                  value={treatment}
                  onChange={(value) => handleItemChange(setTreatments, index, value)}
                  height={150}
                  previewOptions={{
                    className: 'bg-gray-900 text-gray-100'
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(setTreatments, index)}
                className="ml-2 p-2 text-red-400 hover:text-red-300"
                aria-label="Remove treatment"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setTreatments)}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Add Treatment
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium">Prevention</label>
          {prevention.map((prev, index) => (
            <div key={index} className="mb-3 flex items-start">
              <div className="flex-1 bg-gray-800 rounded overflow-hidden">
                <MDEditor
                  value={prev}
                  onChange={(value) => handleItemChange(setPrevention, index, value)}
                  height={150}
                  previewOptions={{
                    className: 'bg-gray-900 text-gray-100'
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(setPrevention, index)}
                className="ml-2 p-2 text-red-400 hover:text-red-300"
                aria-label="Remove prevention"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setPrevention)}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Add Prevention Method
          </button>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block mb-2 font-medium">Disease Image</label>
          <div className="flex items-center space-x-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="image-upload"
                className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
              >
                {isSubmitting ? 'Uploading...' : 'Upload Image'}
              </label>
              <p className="mt-1 text-sm text-gray-400">JPG, PNG (Max 5MB)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Disease'}
          </button>
        </div>
      </form>
    </div>
  );
}