'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import reviewService from '@/services/review_service';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface Review {
  _id: string;
  username: string;
  content: string;
  rating: number;
  created_at: string;
}

const generateColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export default function AllReviewsComponent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setItemsPerPage(4);
      } else if (window.innerWidth >= 1024) { // lg breakpoint
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) { // md breakpoint
        setItemsPerPage(2);
      } else { // sm and below
        setItemsPerPage(1);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getAllReviews();
        setReviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Navigation functions
  const totalSlides = sortedReviews.length;
  const maxIndex = Math.ceil(totalSlides / itemsPerPage) - 1;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.children[0]?.clientWidth || 0;
      sliderRef.current.scrollTo({
        left: currentIndex * itemWidth * itemsPerPage,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-blue-900 to-blue-950 px-4 py-8 sm:py-12 sm:px-40">
      <div className="mb-8 ml-10">
        <h2 className="text-3xl font-bold text-white mb-2">User Reviews</h2>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Hear what our users are saying!</h3>
        <p className="text-gray-400 mx-auto">
          Read honest feedback from our community. Newest reviews appear first.
        </p>
      </div>

      {sortedReviews.length === 0 ? (
        <Link href="/about#review">
          <div className="bg-gray-800/50 p-8 rounded-4xl border border-blue-700 text-center max-w-md mx-auto cursor-pointer hover:bg-blue-900/50 transition-colors">
            <div className="inline-block p-3 rounded-full bg-blue-900">
              <FaStar className="text-blue-400 text-2xl" />
            </div>
            <p className="text-gray-400 text-lg mt-4">No reviews yet. Be the first to review!</p>
          </div>
        </Link>
      ) : (
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600 p-3 rounded-full text-white z-20 transition-all disabled:opacity-30 shadow-lg hover:scale-110"
            disabled={currentIndex === 0}
            aria-label="Previous review"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600 p-3 rounded-full text-white z-20 transition-all disabled:opacity-30 shadow-lg hover:scale-110"
            disabled={currentIndex >= maxIndex}
            aria-label="Next review"
          >
            <FaArrowRight className="h-5 w-5" />
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth px-4"
          >
            {sortedReviews.map((review) => (
              <div
                key={review._id}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1 snap-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/50 hover:bg-blue-950/50 p-6 rounded-4xl shadow-lg border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 border-2 hover:border-blue-500/80 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div
                        className='w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg'
                        style={{ backgroundColor: generateColorFromString(review.username) }}
                      >
                        {review.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-300">{review.username}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-600/50 px-2 py-1 rounded-full">
                      <span className="text-yellow-400 mr-1">{review.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-5 flex-grow">{review.content}</p>

                  <div className="flex space-x-1 mt-auto pt-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={`star-${i}-${review._id}`}
                        className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-blue-400' : 'bg-gray-600'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}