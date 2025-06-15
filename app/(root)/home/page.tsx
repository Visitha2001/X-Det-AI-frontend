'use client';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload'; 
import PredictionResult from '@/components/PredictionResult';
import http from '@/services/http_service';
import XRaySlider from '@/components/XRaySlider';
import ServicesSection from '@/components/ServiceSection';
import WhyUsSection from '@/components/WhyUsSection';
import DetectableDiseases from '@/components/Detectable_Diseases';
import HowItWorks from '@/components/HowItWorks';
import AllReviewsComponent from '@/components/AllReviewsComponent';
import ManageReviewsComponent from '@/components/ManageReviewsComponent';

export default function HomePage() {
  const [uploadResult, setUploadResult] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  const handleUploadSuccess = (result) => {
    setUploadResult(result);
    setPrediction(null);
    setScanError(null);
  };

  const handleScan = async () => {
    if (!uploadResult?.url) return;
    
    setIsScanning(true);
    setScanError(null);
    
    try {
      const response = await http.post('/predict-image', {
        image_url: uploadResult.url
      });
      setPrediction(response.data);
    } catch (err) {
      console.error('Scan failed:', err);
      setScanError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="mx-auto mt-2">
        <ImageUpload
          onUploadSuccess={handleUploadSuccess}
          onScanClick={handleScan}
          isScanning={isScanning}
          uploadResult={uploadResult}
        />
        
        {uploadResult && (
          <PredictionResult
            imageUrl={uploadResult.url}
            isScanning={isScanning}
            scanError={scanError}
            prediction={prediction}
            onRetry={handleScan}
          />
        )}
      </div>
      <XRaySlider />
      <DetectableDiseases />
      <WhyUsSection />
      <HowItWorks />
      <ServicesSection />
      <AllReviewsComponent/>
    </div>
  );
}