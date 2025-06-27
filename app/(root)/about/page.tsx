'use client';
import { FaEye, FaBullseye, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import MakeReviewComponent from '@/components/MakeReviewsComponent';
import AllReviewsComponent from '@/components/AllReviewsComponent';
import { useEffect, useState } from 'react';
import { subscribeUser } from '@/services/subscribe_service';
import toast from 'react-hot-toast';

export default function page() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    if (!username || !email) {
      toast.error('Please enter your name and email');
      return;
    }
    try {
      setLoading(true);
      await subscribeUser(username, email);
      toast.success('Thanks for subscribing!');
      setUsername('');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="py-10 sm:py-20 bg-gradient-to-b from-blue-900/50 to-gray-950">
        <div className="sm:px-50 mx-auto px-8 text-center">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-5xl md:text-4xl font-bold mb-6"
          >
            About <span className="text-blue-500">X-Det-AI</span>
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={{ ...fadeIn, transition: { delay: 0.2 } }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-2"
          >
            Revolutionizing medical diagnostics through artificial intelligence and deep learning.
          </motion.p>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ ...fadeIn, transition: { delay: 0.4 } }}
            className="max-w-md mx-auto"
          >
            <motion.p 
              // initial="hidden"
              // animate="visible"
              // variants={{ ...fadeIn, transition: { delay: 0.8 } }}
              className="text-gray-400 mb-4"
            >
              Subscribe to our newsletter for the latest in AI diagnostics.
            </motion.p>
            <motion.div 
              // initial="hidden"
              // animate="visible"
              // variants={{ ...fadeIn, transition: { delay: 1 } }}
              className="flex flex-col sm:inline md:flex md:flex-row md:space-x-2 space-y-2 md:space-y-0"
            >
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <motion.button
                // initial="hidden"
                // animate="visible"
                // variants={{ ...fadeIn, transition: { delay: 1.2 } }}
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors w-full md:w-auto"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="sm:px-50 mx-auto px-8">
          {/* Vision Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                    <FaEye className="text-blue-500 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  To create a future where AI-assisted diagnostics are accessible to every healthcare provider worldwide, 
                  reducing diagnostic errors and improving patient outcomes through cutting-edge technology.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-300">Global accessibility to advanced diagnostics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-300">Zero diagnostic errors by 2030</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-300">Democratizing healthcare technology</span>
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-full">
                  <img 
                    src={"/assets/slider/4.jpg"} 
                    alt="Medical AI Vision" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scope Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                    <FaBullseye className="text-blue-500 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Scope</h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  X-DetAI specializes in AI-powered analysis of medical imaging including X-rays, CT scans, 
                  and MRIs, with current focus on pulmonary, neurological, and cardiovascular conditions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-blue-500 font-semibold mb-2">Medical Imaging</h3>
                    <p className="text-gray-300 text-sm">X-ray, CT, MRI, Ultrasound analysis</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-blue-500 font-semibold mb-2">Specializations</h3>
                    <p className="text-gray-300 text-sm">Pulmonary, Neurological, Cardiovascular</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-blue-500 font-semibold mb-2">Technologies</h3>
                    <p className="text-gray-300 text-sm">Deep Learning, Computer Vision, NLP</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-blue-500 font-semibold mb-2">Applications</h3>
                    <p className="text-gray-300 text-sm">Hospitals, Clinics, Telemedicine</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-full">
                  <img 
                    src={"/assets/slider/3.jpg"}
                    alt="Medical AI Scope" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Motivation Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                    <FaLightbulb className="text-blue-500 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Motivation</h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  Founded in response to the alarming rate of diagnostic errors in global healthcare, 
                  X-DetAI was born from a personal experience when our founder's family member 
                  experienced a misdiagnosis that nearly cost them their life.
                </p>
                <div className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-500">
                  <p className="italic text-gray-300">
                    "We believe every patient deserves accurate, timely diagnoses regardless of geography 
                    or economic status. AI shouldn't replace doctors, but empower them with superhuman 
                    diagnostic capabilities."
                  </p>
                  <p className="text-blue-500 mt-4 font-medium">— Dr. Sarah Chen, Founder & CEO</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-full">
                  <img 
                    src={"/assets/slider/2.jpg"} 
                    alt="Medical AI Motivation" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Objectives Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                    <FaChartLine className="text-blue-500 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Objectives</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500/10 p-2 rounded-lg mr-4">
                      <span className="text-blue-500 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Reduce Diagnostic Errors</h3>
                      <p className="text-gray-400">Cut misdiagnosis rates by 75% in supported specialties by 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500/10 p-2 rounded-lg mr-4">
                      <span className="text-blue-500 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Increase Accessibility</h3>
                      <p className="text-gray-400">Deploy in 10,000+ clinics across 50+ countries by 2027</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500/10 p-2 rounded-lg mr-4">
                      <span className="text-blue-500 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Speed Up Diagnosis</h3>
                      <p className="text-gray-400">Deliver preliminary results within 5 minutes for 95% of cases</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500/10 p-2 rounded-lg mr-4">
                      <span className="text-blue-500 font-bold">04</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Continuous Improvement</h3>
                      <p className="text-gray-400">Achieve 99.5% accuracy in core detection algorithms by 2028</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-full">
                  <img 
                    src={"/assets/slider/1.jpg"} 
                    alt="Medical AI Objectives" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="sm:px-50 mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Diagnostic Revolution</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you're a healthcare provider, researcher, or investor, we'd love to collaborate.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=visitha2001@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Contact Our Team
            </button>
          </a>
        </div>
      </section>

      <section className='sm:px-50 mx-auto px-8 mb-20' id='review'>
          <MakeReviewComponent />
      </section>
      <AllReviewsComponent />
    </div>
  );
}