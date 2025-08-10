'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { createDisease, updateDisease } from '@/services/diseaseService';
import { uploadImage } from '@/services/image_upload_service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    value: string
  ) => {
    setter(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
          />
          <div className="mt-2 p-4 bg-gray-800 rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-blue-400 border-b border-blue-300 pb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-blue-300 border-b border-blue-200 pb-1" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-medium mt-4 mb-2 text-blue-200" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-gray-200" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-blue-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-blue-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 leading-snug" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-blue-300" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-300 my-4" {...props} />
                ),
                hr: ({ node, ...props }) => <hr className="my-6 border-blue-300/50" {...props} />,
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Symptoms</label>
          {symptoms.map((symptom, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-start gap-2">
                <textarea
                  value={symptom}
                  onChange={(e) => handleItemChange(setSymptoms, index, e.target.value)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setSymptoms, index)}
                  className="p-2 text-red-400 hover:text-red-300"
                  aria-label="Remove symptom"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-4 mb-2 text-blue-400" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-lg font-semibold mt-3 mb-1 text-blue-300" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2 leading-relaxed text-gray-200" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 leading-snug" {...props} />
                    ),
                  }}
                >
                  {symptom}
                </ReactMarkdown>
              </div>
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
            <div key={index} className="mb-3">
              <div className="flex items-start gap-2">
                <textarea
                  value={treatment}
                  onChange={(e) => handleItemChange(setTreatments, index, e.target.value)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setTreatments, index)}
                  className="p-2 text-red-400 hover:text-red-300"
                  aria-label="Remove treatment"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-4 mb-2 text-blue-400" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-lg font-semibold mt-3 mb-1 text-blue-300" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2 leading-relaxed text-gray-200" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 leading-snug" {...props} />
                    ),
                  }}
                >
                  {treatment}
                </ReactMarkdown>
              </div>
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
            <div key={index} className="mb-3">
              <div className="flex items-start gap-2">
                <textarea
                  value={prev}
                  onChange={(e) => handleItemChange(setPrevention, index, e.target.value)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setPrevention, index)}
                  className="p-2 text-red-400 hover:text-red-300"
                  aria-label="Remove prevention"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-4 mb-2 text-blue-400" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-lg font-semibold mt-3 mb-1 text-blue-300" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2 leading-relaxed text-gray-200" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-blue-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 leading-snug" {...props} />
                    ),
                  }}
                >
                  {prev}
                </ReactMarkdown>
              </div>
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