'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import reviewService, { Review } from '@/services/review_service';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

const ManageReviews: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/admin/login');
    } else {
      fetchReviews();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getAllReviews();
      const formattedReviews = data.map((review: any) => ({
        _id: review.id,
        username: review.username,
        content: review.content,
        rating: review.rating,
        created_at: review.created_at,
      }));
      setReviews(formattedReviews);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.deleteReviewById(reviewId);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      setSuccessMessage('Review deleted successfully');
      setError(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
      setSuccessMessage(null);
      console.error('Error deleting review:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      {/* Success Message Bar */}
      {successMessage && (
        <div className="fixed top-0 left-0 right-0 bg-green-600 text-white py-3 px-4 shadow-lg z-50 animate-slideDown">
          <div className="container mx-auto flex justify-between items-center">
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)} 
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Error Message Bar */}
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 shadow-lg z-50 animate-slideDown">
          <div className="container mx-auto flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Reviews</h1>
        
        {reviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300 text-center">No reviews found.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Username</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Content</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-300">{review._id}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-300">{review.username}</td>
                      <td className="py-4 px-6 text-sm text-gray-300 max-w-xs truncate">{review.content}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-300">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white">
                          {review.rating}/5
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-300">
                        {review.created_at
                          ? format(new Date(review.created_at), 'PPp')
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleDeleteReview(review._id!)}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;