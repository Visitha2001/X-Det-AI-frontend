import http from './http_service';

export interface Review {
  _id?: string;
  username: string;
  content: string;
  rating: number;
  created_at?: string;
}

class ReviewService {
  async createReview(content: string, rating: number, username: string) {
    try {
      const response = await http.post('/reviews/', {
        username,
        content,
        rating,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllReviews() {
    try {
      const response = await http.get('/reviews/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByUsername(username: string) {
    try {
      const response = await http.get(`/reviews/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteReviewsByUsername(username: string) {
    try {
      const response = await http.delete(`/reviews/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteReviewById(reviewId: string) {
    try {
      const response = await http.delete(`/reviews/id/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;