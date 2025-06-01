import http from './http_service';

interface ImageUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await http.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export const getImageUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/dqmeeveij/image/upload/${publicId}`;
};