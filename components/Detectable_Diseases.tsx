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
    <section className="py-8 sm:py-12 bg-gray-900">
      <div className="px-4 sm:px-50 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Detectable Diseases
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our advanced detection system can identify these medical conditions with high accuracy.
          </p>
        </div>

        <div className="flex flex-wrap justify-center -mx-2">
          {diseases.map((disease, index) => (
            <Link
              key={index}
              href={`/diseases?search=${encodeURIComponent(disease)}`}
              className="bg-white dark:bg-gray-950 rounded-lg shadow-md px-8 py-2 mx-2 my-2 border-2 border-blue-600 
                         transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-white hover:border-white"
            >
              <div className="text-center transition-colors duration-300">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300">
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