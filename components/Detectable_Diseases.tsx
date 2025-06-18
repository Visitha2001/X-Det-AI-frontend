'use client';

import React from 'react';
import Link from 'next/link';

const DetectableDiseases = () => {
  const diseases = [
    "Hernia",
    "Pneumonia",
    "Fibrosis",
    "Edema",
    "Emphysema",
    "Cardiomegaly",
    "Pleural Thickening",
    "Consolidation",
    "Pneumothorax",
    "Mass",
    "Nodule",
    "Atelectasis",
    "Effusion",
    "Infiltration"
  ];

  return (
    <section className="relative py-8 sm:py-12 bg-gray-900 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-90"
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            if (video.currentTime > 15) {
              video.currentTime = 3;
            }
          }}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            video.currentTime = 3;
          }}
        >
          <source src="https://res.cloudinary.com/dqmeeveij/video/upload/v1750228566/vecteezy_two-people-in-white-lab-coats-looking-at-a-x-ray_56373634_e0dqd7.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-50 sm:py-8 mx-auto">
        <div className="text-center mb-12">
          <h2 className="sm:text-5xl text-4xl font-bold text-gray-200 mb-4">
            Detectable Diseases
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our advanced detection system can identify these medical conditions with high accuracy.
          </p>
        </div>

        <div className="flex flex-wrap justify-center -mx-2">
          {diseases.map((disease, index) => (
            <Link
              key={index}
              href={`/diseases?search=${encodeURIComponent(disease)}`}
              className="bg-black/30 rounded-lg shadow-md px-8 py-2 sm:px-15 sm:py-3 mx-2 my-2
                        backdrop-blur-sm transform transition-all duration-300 ease-in-out
                        hover:scale-105 border
                        hover:border-gray-300"
            >
              <div className="text-center transition-colors duration-300">
                <h3 className="text-lg font-medium text-white">
                  {disease}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetectableDiseases;