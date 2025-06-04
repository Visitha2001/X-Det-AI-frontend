import React from 'react';

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
    <section className="py-12 bg-black">
      <div className="px-4 sm:px-50 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Detectable Diseases
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our advanced detection system can identify these medical conditions with high accuracy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {diseases.map((disease, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-2 sm:p-4 border-2 border-blue-600 
                         transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-white hover:border-white"
            >
              <div className="text-center transition-colors duration-300">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 group-hover:text-blue-700">
                  {disease}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetectableDiseases;