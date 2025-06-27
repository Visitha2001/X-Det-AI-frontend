'use client';

import { useState } from 'react';
import reviewService from '@/services/review_service';
import { useRouter } from 'next/navigation';
import ManageReviewsComponent from './ManageReviewsComponent';
import { Review } from '@/services/review_service';

export default function MakeReviewComponent() {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();

  const username = typeof window !== 'undefined' ? sessionStorage.getItem('username') : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('You must be logged in to submit a review');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newReview = await reviewService.createReview(content, rating, username);
      setContent('');
      setRating(0);
      setHoverRating(0);
      // Update the reviews state with the new review
      setReviews([newReview, ...reviews]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='sm:flex flex-col-2'>
      <div className="w-full sm:w-[60%] bg-gray-800/60 p-6 rounded-4xl shadow-lg">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Write a Review</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-3xl focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {star <= (hoverRating || rating) ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-gray-500">☆</span>
                  )}
                </button>
              ))}
              <span className="ml-2 text-gray-400">
                {rating === 0 ? ' ' : `${rating} ${rating === 1 ? 'star' : 'stars'}`}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
      <ManageReviewsComponent 
        reviews={reviews} 
        setReviews={setReviews} 
        username={username || ''}
      />
    </div>
  );
}