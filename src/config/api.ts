const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getApiUrl = () => API_URL;

export const endpoints = {
  movies: {
    getById: (movieId: string) => `${API_URL}/v1/movies/${movieId}`,
    getReviews: (movieId: string) => `${API_URL}/v1/movies/${movieId}/reviews`,
    createReview: (movieId: string) => `${API_URL}/v1/movies/${movieId}/reviews`,
    getReviewReactions: (movieId: string) => `${API_URL}/v1/movies/${movieId}/review-reaction`,
  },
  reviews: {
    getReaction: (reviewId: string) => `${API_URL}/v1/reviews/${reviewId}/reaction`,
    updateReaction: (reviewId: string, reactionType: string) => 
      `${API_URL}/v1/reviews/${reviewId}/reaction?reactionType=${reactionType}`,
  },
}; 