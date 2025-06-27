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
    <section className="w-full py-8 sm:py-12 bg-gray-900">
      <div className="mx-auto px-8 sm:px-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Services</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered healthcare solutions designed for accuracy and efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:mb-8 mb-0">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative bg-gray-800/40 rounded-4xl p-8 border-2 border-gray-800/30 transition-all duration-300 hover:shadow-lg backdrop-blur-lg overflow-hidden group"
              // style={{
              //   background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.4) 0%, rgba(31, 41, 55, 0.1) 100%)',
              // }}
            >
              {/* Darker reflection effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent"></div>
              </div>
              
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="mb-6 p-4 bg-gray-800/30 rounded-3xl backdrop-blur-md border border-gray-700/50">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300/80">{service.description}</p>
              </div>
              
              {/* Darker shine effect on hover */}
              <div className="absolute inset-0 overflow-hidden rounded-4xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shine"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}