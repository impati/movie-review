import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { searchMovies, Movie, getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

const UserMoviePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const [myReviewMovieIds, setMyReviewMovieIds] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // 내 리뷰 영화 ID 목록 불러오기
  useEffect(() => {
    if (!token) return;
    const fetchMyReviews = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/v1/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setMyReviewMovieIds(data.map((r: any) => r.movieId));
      } catch {
        setMyReviewMovieIds([]);
      }
    };
    fetchMyReviews();
  }, [token]);

  // 화면 진입 시 자동 검색 & watchlist 불러오기
  useEffect(() => {
    handleSearch();
    if (isLoggedIn) fetchWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist(token!);
      setWatchlist(data.map(item => item.movieId));
    } catch {
      setWatchlist([]);
    }
  };

  // 검색 실행
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasMore(true);
    try {
      const data = await searchMovies({
        movieName: query || undefined,
        fetchSize: 19  // 첫 번째 요청에서는 19개만 요청 (더보기 버튼을 위해)
      });
      setMovies(data);
      // 19개 미만이면 더 이상 데이터가 없음
      setHasMore(data.length === 19);
    } catch (e) {
      setMovies([]);
      setError('검색 결과가 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 더보기 버튼 클릭 시 추가 영화 로드
  const handleLoadMore = async () => {
    if (movies.length === 0 || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const lastMovieId = movies[movies.length - 1].movieId;
      const data = await searchMovies({
        movieName: query || undefined,
        offsetId: lastMovieId,
        fetchSize: 20  // 더보기 요청에서는 20개 요청
      });
      
      setMovies(prev => {
        // 중복 제거를 위해 기존 영화 ID 목록 생성
        const existingIds = new Set(prev.map((movie: Movie) => movie.movieId));
        const newMovies = data.filter((movie: Movie) => !existingIds.has(movie.movieId));
        return [...prev, ...newMovies];
      });
      // 20개 미만이면 더 이상 데이터가 없음
      setHasMore(data.length === 20);
    } catch (e) {
      setError('추가 영화를 불러오는데 실패했습니다.');
    } finally {
      setLoadingMore(false);
    }
  };

  // 볼 영화 추가
  const handleAddToWatchlist = async (movieId: string) => {
    if (!token) return;
    await addToWatchlist(movieId, token);
    fetchWatchlist();
  };
  // 볼 영화 제거
  const handleRemoveFromWatchlist = async (movieId: string) => {
    if (!token) return;
    await removeFromWatchlist(movieId, token);
    fetchWatchlist();
  };

  // 영화 선택 시 상세 페이지로 이동
  const handleSelectMovie = (movie: Movie) => {
    navigate(`/user-movie/${movie.movieId}`);
  };

  return (
    <>
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
        ) : error || movies.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <Typography color="text.secondary" fontSize={20}>{error || '검색 결과가 없습니다.'}</Typography>
          </Box>
        ) : (
          <>
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
                  <MovieCard 
                    movie={movie} 
                    onClick={() => handleSelectMovie(movie)}
                    isInWatchlist={watchlist.includes(movie.movieId)}
                    isLoggedIn={isLoggedIn}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    isReviewedByMe={myReviewMovieIds.includes(movie.movieId)}
                  />
                </Paper>
              ))}
            </Box>
            
            {/* 더보기 버튼 */}
            {hasMore && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loadingMore ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      로딩 중...
                    </>
                  ) : (
                    '더보기'
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default UserMoviePage; 