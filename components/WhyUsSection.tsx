'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function WhyUsSection() {
  return (
    <section className="w-full py-8 sm:py-10 bg-black">
      <div className="mx-auto px-8 sm:px-50">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Content */}
          <div className="lg:w-1/2 p-3 sm:p-0">
            <motion.div
              // initial={{ opacity: 0, x: -50 }}
              // whileInView={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.8 }}
              // viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Why Choose Our AI Healthcare Solutions?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Cutting-Edge Technology</h3>
                    <p className="text-gray-400">Our AI models are trained on millions of medical images for unparalleled accuracy in diagnostics.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Rapid Results</h3>
                    <p className="text-gray-400">Get analysis reports in minutes, not days, accelerating your treatment journey.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Expert Validation</h3>
                    <p className="text-gray-400">All AI findings are reviewed by board-certified radiologists for added reliability.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Continuous Improvement</h3>
                    <p className="text-gray-400">Our algorithms learn from every case, constantly enhancing their diagnostic capabilities.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Image */}
          <div className="lg:w-1/2">
            <motion.div
              // initial={{ opacity: 0, x: 50 }}
              // whileInView={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.4, delay: 0.1 }}
              // viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-gray-800">
                {/* Replace with your actual image */}
                <Image
                  src="/assets/robot-performing-ordinary-human-job.jpg"
                  alt="AI Healthcare Technology"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full mix-blend-screen blur-xl z-0" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full mix-blend-screen blur-xl z-0" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}