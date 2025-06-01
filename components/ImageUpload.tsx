'use client';
import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import http from '@/services/http_service';

interface ImageUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

interface ImageUploadRowProps {
  onUploadSuccess: (result: ImageUploadResponse) => void;
  onScanClick: () => void;
  isScanning: boolean;
  uploadResult: ImageUploadResponse | null;
}

export default function ImageUploadRow({
  onUploadSuccess,
  onScanClick,
  isScanning,
  uploadResult
}: ImageUploadRowProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onUploadSuccess(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !fileInputRef.current?.files?.[0]) return;
    
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      
      const response = await http.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      onUploadSuccess(response.data);
    } catch (err: any) {
      console.error('Upload failed:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        router.push('/signin');
      } else {
        setError(err.message || 'Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[25vh] sm:min-h-[17vh] text-black relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient bg-[length:400%_400%]" />
      </div>

      {/* Upload Container */}
      <div className="relative z-10 w-[80%] max-w-3xl">
        <div className={`
          flex flex-col sm:flex-row items-center gap-4 
          bg-white bg-opacity-20 backdrop-blur-lg 
          rounded-4xl shadow-2xl border border-white border-opacity-30 
          transition-all 
          ${selectedImage ? 'h-[22vh] sm:h-[13vh] px-2 py-2' : 'h-[10vh] sm:h-[7vh] px-4 py-2'}
        `}>
          <div className="flex flex-row w-full items-center mt-5 sm:mt-0">
            {/* Upload Button */}
            <button
              onClick={triggerFileInput}
              disabled={isUploading || isScanning}
              className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-30 hover:bg-opacity-40 transition-all mr-2 disabled:opacity-50"
            >
              <Image src="/assets/ai.png" alt="AI Icon" width={50} height={50} />
            </button>

            {/* Preview */}
            <div 
              onClick={!isUploading && !isScanning ? triggerFileInput : undefined} 
              className={`flex-grow ${!isUploading && !isScanning ? 'cursor-pointer' : ''}`}
            >
              {selectedImage ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="h-25 w-25 mt-[-8px] sm:mt-[0px] sm:h-22 sm:w-22  object-cover rounded-2xl border border-white"
                    />
                    {!isUploading && !isScanning && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-600 border border-red-600 rounded-full h-5 w-5 flex items-center justify-center text-xs shadow-md"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <span className="text-black truncate">
                    {uploadResult ? 'Upload successful!' : 'Ready to upload'}
                  </span>
                </div>
              ) : (
                <p className="text-black text-opacity-80 truncate">
                  {error || 'Select an image to upload'}
                </p>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading || isScanning}
            />

            {/* Desktop Buttons */}
            <div className="hidden sm:flex">
              {selectedImage && !uploadResult && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-3 mr-2 text-white text-sm font-medium rounded-full transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient bg-[length:400%_400%] hover:brightness-110 shadow-lg disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
              {uploadResult && (
                <button
                  onClick={onScanClick}
                  disabled={isScanning}
                  className="px-6 py-3 mr-2 text-white text-sm font-medium rounded-full transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient bg-[length:400%_400%] hover:brightness-110 shadow-lg disabled:opacity-50"
                >
                  {isScanning ? 'Scanning...' : 'Scan'}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="sm:hidden w-full px-4">
            {selectedImage && !uploadResult && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full px-6 py-3 text-white text-sm font-medium rounded-full transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient bg-[length:400%_400%] hover:brightness-110 shadow-lg disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
            {uploadResult && (
              <button
                onClick={onScanClick}
                disabled={isScanning}
                className="w-full px-6 py-3 text-white text-sm font-medium rounded-full transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient bg-[length:400%_400%] hover:brightness-110 shadow-lg disabled:opacity-50"
              >
                {isScanning ? 'Scanning...' : 'Scan'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}