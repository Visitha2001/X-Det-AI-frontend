'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const HeroSlider = () => {
  const slides: Slide[] = [
    {
      id: 1,
      imageUrl: '/assets/slider/1.jpg',
      title: 'Welcome to X-Det-AI',
      description: 'Revolutionizing medical diagnostics through advanced AI technology for accurate and timely detection of diseases',
      ctaText: 'Learn How It Works',
      ctaLink: '/about',
    },
    {
      id: 2,
      imageUrl: '/assets/slider/2.jpg',
      title: 'Instant Support',
      description: 'Our AI-powered chatbot provides 24/7 medical assistance and guidance for your diagnostic needs',
      ctaText: 'Chat Now',
      ctaLink: '/chatbot',
    },
    {
      id: 3,
      imageUrl: '/assets/slider/3.jpg',
      title: 'Medical Education',
      description: 'Comprehensive resources to understand various medical conditions and their treatments',
      ctaText: 'Explore Knowledge',
      ctaLink: '/diseases',
    },
    {
      id: 4,
      imageUrl: '/assets/slider/4.jpg',
      title: 'Our Mission',
      description: 'Democratizing healthcare access through cutting-edge technology and research',
      ctaText: 'Our Vision',
      ctaLink: '/about',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const goToNextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length, isAnimating]);

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoPlaying) {
      intervalId = setInterval(goToNextSlide, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, goToNextSlide]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const getSlideAnimation = (index: number) =>
    index === currentSlide ? 'opacity-100' : 'opacity-0';

  const getContentAnimation = (index: number) =>
    index === currentSlide ? 'animate-fadeInLeft' : 'opacity-0 -translate-x-10';

  return (
    <div className="relative w-full h-[65vh] sm:h-[74vh] overflow-hidden border-black">
      {/* Background Image */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${getSlideAnimation(index)} border-black`}
        >
          <div className="relative w-full h-full overflow-hidden border-black shadow-lg">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />

            {/* This is the key change: a separate div for the blur effect */}
            {/* Dark overlay on the left 50% */}
            <div className="absolute inset-0 w-1/2" style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)', // Adjust gradient for fade within the left 50%
              filter: 'blur(5px)', // Apply blur directly to this overlay
              transform: 'translateX(-50%)', // Shift left to control the blur area
            }}></div>
            
            {/* The primary dark overlay with gradient */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0) 100%)',
            }}></div>

            {/* Full dark overlay for small devices only */}
            <div className="absolute inset-0 bg-black opacity-40 sm:hidden"></div> {/* New overlay */}
          </div>
        </div>
      ))}

      <div className="mx-auto h-full px-4 sm:px-50 relative z-10">
        <div className="relative h-full flex items-center">
          {/* Left-aligned content */}
          <div className="w-full lg:w-1/2 space-y-8 text-white mt-[-250px] flex flex-col items-center lg:items-start text-center lg:text-left">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute transition-all duration-700 ease-out ${getContentAnimation(index)}`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight 
                                  bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 
                                  text-transparent bg-clip-text animate-gradient">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mt-6 mb-8 max-w-lg opacity-90">
                  {slide.description}
                </p>
                <button
                  onClick={() => router.push(slide.ctaLink)}
                  className="bg-white text-blue-800 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {slide.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-26 sm:bottom-12 lg:bottom-9 left-0 right-0 flex justify-center items-center space-x-4 z-20">
        <button
          onClick={goToPrevSlide}
          className="p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-2 mx-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white/80 scale-125' : 'bg-white/50 hover:bg-blue-500 cursor-pointer'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 p-3 rounded-full bg-blue-400/20 hover:bg-blue-400/30 backdrop-blur-sm transition-all z-20"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg className="h-5 w-5 text-blue-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-blue-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default HeroSlider;