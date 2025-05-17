import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { searchMovies, getUserMovieById, createMovie, Movie, CreateMovieRequest } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const UserMoviePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 화면 진입 시 자동 검색
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 실행
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchMovies(query);
      setMovies(data);
    } catch (e) {
      alert('영화 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 영화 선택 시 상세 페이지로 이동
  const handleSelectMovie = (movie: Movie) => {
    navigate(`/user-movie/${movie.movieId}`);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #181c24 0%, #232a34 100%)',
            p: 4,
            borderRadius: 4,
            mb: 6
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={900} 
            mb={4} 
            sx={{ 
              color: 'primary.main', 
              letterSpacing: -1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            영화 검색
          </Typography>
          <Box 
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={1}
            mb={4}
            sx={{
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }
                }
              }
            }}
          >
            <TextField
              fullWidth
              placeholder="영화 이름으로 검색"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              InputProps={{
                sx: { 
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.5)'
                  }
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch} 
              sx={{ 
                fontWeight: 700,
                minWidth: 80,
                height: 56,
                ml: 1,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                }
              }}
            >
              검색
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" 
            gap={4} 
            alignItems="stretch" 
            width="100%" 
            minWidth={0} 
            boxSizing="border-box"
          >
            {movies.map((movie) => (
              <Paper
                key={movie.movieId}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 0,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px 0 rgba(0,0,0,0.3)',
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'stretch',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <MovieCard movie={movie} onClick={() => handleSelectMovie(movie)} />
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default UserMoviePage; 