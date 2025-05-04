import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, Movie } from '../services/movieService';
import { Container, Box, Typography, Chip, Stack, Button, CircularProgress, Paper, Fade } from '@mui/material';

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
      } catch (e) {
        alert('영화 정보를 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId, navigate]);

  if (loading) {
    return (
      <Container sx={{ mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }
  if (!movie) return null;

  return (
    <Fade in timeout={500}>
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: -1, color: 'primary.main' }}>
          {movie.movieName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          {movie.detail.open}
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={5}>
          {/* 포스터 */}
          <Paper elevation={4} sx={{ borderRadius: 4, p: 2, bgcolor: 'background.paper', minWidth: 280, maxWidth: 320, alignSelf: 'flex-start' }}>
            <Box
              sx={{
                width: { xs: 220, sm: 260 },
                height: { xs: 300, sm: 340 },
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'grey.900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: 3,
              }}
            >
              {movie.poster ? (
                <img src={movie.poster} alt="포스터" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }} />
              ) : (
                <Typography color="grey.500">포스터 없음</Typography>
              )}
            </Box>
            {/* 카테고리 */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 2 }}>
              {movie.detail.categories.map((cat, idx) => (
                <Chip key={cat} label={cat} color={idx % 2 === 0 ? 'primary' : 'secondary'} sx={{ fontWeight: 600, letterSpacing: 1 }} />
              ))}
            </Stack>
          </Paper>
          {/* 상세 정보 */}
          <Paper elevation={2} sx={{ flex: 1, borderRadius: 4, p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', minWidth: 0 }}>
            <Box>
              <Typography variant="body1" mb={2} sx={{ borderBottom: '1px solid #444', pb: 1, fontWeight: 700 }}>
                <b>Director</b> {movie.director}
              </Typography>
              <Typography variant="body1" mb={2} sx={{ borderBottom: '1px solid #444', pb: 1, fontWeight: 700 }}>
                <b>Star</b> {movie.actors.join(' ')}
              </Typography>
              <Typography variant="body1" mb={2} sx={{ borderBottom: '1px solid #444', pb: 1, fontWeight: 700 }}>
                <b>Country</b> {movie.detail.country}
              </Typography>
              <Typography variant="body1" mb={2} sx={{ borderBottom: '1px solid #444', pb: 1, fontWeight: 700 }}>
                <b>RunningTime</b> {movie.detail.runningTime}
              </Typography>
              <Typography variant="body1" mb={2} sx={{ borderBottom: '1px solid #444', pb: 1, fontWeight: 700 }}>
                <b>Distributor</b> {movie.detail.distributor}
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box mt={5}>
          <Button variant="outlined" size="large" sx={{ borderRadius: 2, px: 4, fontWeight: 600 }} onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Fade>
  );
};

export default MovieDetailPage; 