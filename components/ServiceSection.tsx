'use client';
import { FaClinicMedical, FaXRay, FaUserMd, FaMobileAlt, FaShieldAlt, FaRobot } from 'react-icons/fa';

export default function ServicesSection() {
  const services = [
    {
      icon: <FaClinicMedical className="text-blue-500 text-4xl" />,
      title: "Advanced Diagnostics",
      description: "State-of-the-art AI-powered analysis for accurate disease detection from medical imaging."
    },
    {
      icon: <FaXRay className="text-blue-500 text-4xl" />,
      title: "Rapid X-Ray Analysis",
      description: "Get instant results for your X-ray scans with our cutting-edge deep learning models."
    },
    {
      icon: <FaUserMd className="text-blue-500 text-4xl" />,
      title: "Expert Consultations",
      description: "Connect with medical professionals to discuss your results and next steps."
    },
    {
      icon: <FaRobot className="text-blue-500 text-4xl" />,
      title: "AI Chat Support",
      description: "Get instant responses to your health questions with our AI-powered chatbot."
    },
    {
      icon: <FaMobileAlt className="text-blue-500 text-4xl" />,
      title: "Mobile Access",
      description: "Access your medical reports anytime, anywhere through our secure mobile platform."
    },
    {
      icon: <FaShieldAlt className="text-blue-500 text-4xl" />,
      title: "Data Security",
      description: "Your medical data is protected with bank-level encryption and privacy controls."
    }
  ];

  return (
    <section className="w-full py-8 sm:py-10 bg-black">
      <div className="mx-auto px-8 sm:px-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Services</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered healthcare solutions designed for accuracy and efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gray-900 rounded-4xl p-8 border-2 border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-gray-800 rounded-3xl">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}