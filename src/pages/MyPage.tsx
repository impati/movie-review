import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, Rating, CircularProgress, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { getWatchlist, getMovieById, removeFromWatchlist, Movie } from '../services/movieService';
import { isTokenExpired } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';

interface MyReview {
  movieId: string;
  movieName: string;
  moviePoster: string;
  reviewId: string;
  cinematography: number;
  acting: number;
  originality: number;
  entertainment: number;
  story: number;
  rating: number;
  title: string;
  description: string;
  hasSpoiler: boolean;
  createdAt: string;
}

const MyPage: React.FC = () => {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { handleTokenExpiration } = useAuth();

  useEffect(() => {
    if (!token) {
      handleTokenExpiration();
      return;
    }
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiUrl()}/v1/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store',
        });
        const data = await res.json();
        setReviews(data);
      } catch (error: any) {
        if (isTokenExpired(error)) {
          handleTokenExpiration();
        } else {
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    fetchWatchlist();
  }, [token, navigate]);

  const fetchWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      const ids = await getWatchlist(token!);
      const movies = await Promise.all(ids.map(async (item) => {
        try {
          return await getMovieById(item.movieId);
        } catch {
          return null;
        }
      }));
      setWatchlist(movies.filter(Boolean) as Movie[]);
    } catch (error: any) {
      if (isTokenExpired(error)) {
        handleTokenExpiration();
      } else {
        setWatchlist([]);
      }
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId: string) => {
    if (!token) return;
    try {
      await removeFromWatchlist(movieId, token);
      fetchWatchlist();
    } catch (error: any) {
      if (isTokenExpired(error)) {
        handleTokenExpiration();
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #181c24 0%, #232a34 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={800} mb={4} color="primary.main">마이페이지</Typography>
        <Typography variant="h6" fontWeight={600} mb={3}>내가 작성한 리뷰</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography color="text.secondary">아직 작성한 리뷰가 없습니다.</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={3} mb={8}>
            {reviews.map((review) => (
              <Paper 
                key={review.reviewId}
                elevation={3}
                sx={{ display: 'flex', alignItems: 'flex-start', p: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', cursor: 'pointer' }}
                onClick={() => navigate(`/user-movie/${review.movieId}`)}
              >
                <CardMedia
                  component="img"
                  image={review.moviePoster}
                  alt={review.movieName}
                  sx={{ width: 100, height: 140, borderRadius: 2, objectFit: 'cover', mr: 3, boxShadow: 2 }}
                />
                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">{review.movieName}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{new Date(review.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="h6" fontWeight={700} mb={1}>{review.title}</Typography>
                  <Typography variant="body1" mb={1} sx={{ whiteSpace: 'pre-line' }}>{review.description}</Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Rating value={review.rating} max={5} readOnly size="small" />
                    <Typography color="text.secondary" fontSize={14}>연기: {review.acting}</Typography>
                    <Typography color="text.secondary" fontSize={14}>연출: {review.cinematography}</Typography>
                    <Typography color="text.secondary" fontSize={14}>신선도: {review.originality}</Typography>
                    <Typography color="text.secondary" fontSize={14}>재미: {review.entertainment}</Typography>
                    <Typography color="text.secondary" fontSize={14}>스토리: {review.story}</Typography>
                  </Box>
                </CardContent>
              </Paper>
            ))}
          </Box>
        )}
        <Typography variant="h6" fontWeight={600} mb={3}>내가 볼 영화 목록</Typography>
        {watchlistLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : watchlist.length === 0 ? (
          <Typography color="text.secondary">아직 볼 영화가 없습니다.</Typography>
        ) : (
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={3} mb={8}>
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.movieId}
                movie={movie}
                onClick={() => navigate(`/user-movie/${movie.movieId}`)}
                isInWatchlist={true}
                isLoggedIn={true}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyPage; 