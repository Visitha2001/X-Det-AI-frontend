'use client';

import { useEffect, useState } from 'react';
import reviewService from '@/services/review_service';
import { useRouter } from 'next/navigation';
import { Review } from '@/services/review_service';
import { FaBook, FaList, FaStar, FaThermometerEmpty } from 'react-icons/fa';

interface ManageReviewsProps {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  username: string;
}

export default function ManageReviewsComponent({ reviews, setReviews, username }: ManageReviewsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!username) return;

    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviewsByUsername(username);
        setReviews(data);
      } catch (err: any) {
        setError(err.message || '');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [username, setReviews]);

  const handleDelete = async () => {
    if (!username) return;

    if (!confirm('Are you sure you want to delete all your reviews?')) return;

    try {
      await reviewService.deleteReviewsByUsername(username);
      setReviews([]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete reviews');
    }
  };

  if (!username) {
    return (
      <div className='sm:w-[40%] w-full text-center bg-red-900/50 p-10 sm:h-[470] h-[220] rounded-4xl justify-center flex flex-col sm:ml-6 ml-0 mt-3 sm:mt-0 items-center'>
        <div className='bg-red-900 p-5 rounded-full inline-block'>
          <FaStar className='text-red-300 text-2xl'/>
        </div>
        <p className="text-red-400 mt-4">Please log in to manage your reviews</p>
      </div>
    );
  }

  if (loading && reviews.length === 0) {
    return <div className="text-blue-400">Loading your reviews...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="sm:w-[40%] w-full sm:pl-6 pl-0  space-y-6 sm:mt-0 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-400">Your Reviews</h2>
        {reviews.length > 0 && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition duration-200"
          >
            Delete All
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className='bg-gray-800/60 text-center p-10 sm:h-[375] h-[220] rounded-4xl justify-center flex flex-col items-center'>
            <div className='p-5 bg-blue-800/60 rounded-full inline-block'>
                <FaStar className='text-blue-400 text-2xl'/>
            </div>
            <p className="text-gray-400 mt-4">You haven't submitted any reviews yet.</p> 
        </div>
      ) : (
        <div className={`space-y-4 custom-scrollbar ${reviews.length > 3 ? 'max-h-[380px] overflow-y-auto pr-2' : ''}`}>
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gray-800/60 p-4 rounded-2xl shadow"
            >
              
              <h3 className="text-blue-300 sm:text-md text-sm">{review.username}</h3>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={`${review._id}-star-${i}`}
                      className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at || '').toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}