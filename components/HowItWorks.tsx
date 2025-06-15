'use client';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useEffect, useRef, useState } from 'react';

export default function HowItWorks() {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (playerRef.current) {
        setIsPlaying(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if component is in viewport
  const handlePlay = () => {
    const section = sectionRef.current;
    if (section) {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
      setIsPlaying(isInView);
    }
  };

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 bg-gray-900">
      <div className="mx-auto px-8 sm:px-50">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Video */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              className="relative rounded-4xl overflow-hidden border-2 border-gray-700"
            >
              <div className="aspect-video w-full">
                <ReactPlayer
                  ref={playerRef}
                  url="https://res.cloudinary.com/dqmeeveij/video/upload/v1749280266/0607_lgujuy.mp4"
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={isPlaying}
                  onPlay={handlePlay}
                  onPause={() => setIsPlaying(false)}
                  light="/assets/Thumb.png"
                  style={{ backgroundColor: '#111827' }}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                      },
                    },
                  }}
                />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full mix-blend-screen blur-xl z-0" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full mix-blend-screen blur-xl z-0" />
            </motion.div>
          </div>

          {/* Right side - Steps */}
          <div className="lg:w-1/2 w-full">
            <motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                How Our <span className="text-blue-400">AI Detection</span> Works
              </h2>
              
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-500/20 py-2 px-4 rounded-lg">
                      <span className="text-blue-400 font-bold text-xl">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Your Data</h3>
                    <p className="text-gray-400">
                      Easily upload medical images or enter symptoms through our secure platform. 
                      We support DICOM, JPEG, and PNG formats.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-500/20 py-2 px-4 rounded-lg">
                      <span className="text-blue-400 font-bold text-xl">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                    <p className="text-gray-400">
                      Our deep learning models process your data in real-time, 
                      comparing against millions of clinical cases for accurate pattern recognition.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-500/20 py-2 px-4 rounded-lg">
                      <span className="text-blue-400 font-bold text-xl">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Get Results</h3>
                    <p className="text-gray-400">
                      Receive a comprehensive report within minutes, highlighting potential 
                      conditions with confidence scores and recommended next steps.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}