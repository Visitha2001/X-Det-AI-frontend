'use client';

import { useEffect, useState, useRef, useCallback } from 'react'; // Import useRef and useCallback
import reviewService from '@/services/review_service';
import { motion } from 'framer-motion'; // For potential slide animations
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'; // For navigation arrows
import Link from 'next/link';

interface Review {
  _id: string;
  username: string;
  content: string;
  rating: number;
  created_at: string;
}

// Function to generate a consistent random color based on a string
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

  // Slider state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1); // Default for small screens

  // Determine items per page based on screen size (for conceptual slider)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setItemsPerPage(4);
      } else if (window.innerWidth >= 768) { // md breakpoint (optional, but good for transition)
        setItemsPerPage(2);
      } else { // sm and below
        setItemsPerPage(1);
      }
    };

    updateItemsPerPage(); // Set initial value
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
  const totalSlides = reviews.length; // Each review is a "slide" for now
  const maxIndex = Math.ceil(totalSlides / itemsPerPage) - 1;


  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  }, [maxIndex]);


  // Effect to scroll the slider
  useEffect(() => {
    if (sliderRef.current) {
      // Calculate scroll position based on current index and item width
      // This is a simplified calculation; a real slider library handles this precisely
      const itemWidth = sliderRef.current.children[0]?.clientWidth || 0;
      sliderRef.current.scrollLeft = currentIndex * itemWidth * itemsPerPage;
    }
  }, [currentIndex, itemsPerPage, reviews]); // Re-run if reviews change too

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-blue-400">
        Loading reviews...
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
    <div className="space-y-8 bg-blue-800 px-8 py-8 sm:py-12 sm:px-50">
      <h2 className="text-3xl font-bold text-white mb-2">All Reviews</h2>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">Hear what our users are saying!</h3>
      <p className="text-gray-400 text-sm mb-6">Add your honest feedback and experiences in our about section.</p>

      {reviews.length === 0 ? (
        <Link href="/about#review">
          <div className="bg-gray-800/50 p-8 rounded-4xl border border-blue-700 text-center">
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
            className="absolute left-[-15px] top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-3 rounded-full text-white z-20 transition-colors disabled:opacity-30 border-1 border-gray-500"
            disabled={currentIndex === 0}
            aria-label="Previous review"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-15px] top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-3 rounded-full text-white z-20 transition-colors disabled:opacity-30 border-1 border-gray-500"
            disabled={currentIndex >= maxIndex}
            aria-label="Next review"
          >
            <FaArrowRight className="h-5 w-5" />
          </button>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth "
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 snap-center p-2`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/50 hover:bg-blue-950 p-6 rounded-4xl shadow-lg border-2 border-gray-700 transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/80 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className='flex items-center'>
                        <div
                          className='px-3 py-1 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg min-w-[40px] min-h-[40px]'
                          style={{ backgroundColor: generateColorFromString(review.username) }}
                        >
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div className='mt-[-4px]'>
                          <h3 className="font-bold text-blue-300 sm:text-lg text-sm">{review.username}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-600/50 px-2 py-1 rounded-full">
                      <span className="text-yellow-400 mr-1">{review.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-4 flex-grow">{review.content}</p>

                  <div className="flex items-center space-x-1 mt-auto">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={`star-${i}-${review._id}`}  // Add unique key combining index and review ID
                        className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}