import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserMovieById, Movie } from '../services/movieService';
import { Container, Box, Typography, Chip, Stack, Button, CircularProgress, Paper, Fade, TextField, Rating } from '@mui/material';
import { useState as useReactState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// 리뷰 작성 폼 상태 타입
interface ReviewForm {
  title: string;
  description: string;
  acting: number;
  cinematography: number;
  originality: number;
  entertainment: number;
  story: number;
  hasSpoiler: boolean;
  rating: number;
}

// 리뷰 타입
interface Review {
  id: string;
  title: string;
  description: string;
  acting: number;
  cinematography: number;
  originality: number;
  entertainment: number;
  story: number;
  hasSpoiler: boolean;
  rating: number;
  nickName: string;
  createdAt: string;
}

const UserMovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    title: '',
    description: '',
    acting: 0,
    cinematography: 0,
    originality: 0,
    entertainment: 0,
    story: 0,
    hasSpoiler: false,
    rating: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const [reviewReactions, setReviewReactions] = useState<{ [reviewId: string]: { good: number; bad: number } }>({});
  const [myReactions, setMyReactions] = useState<{ [reviewId: string]: 'GOOD' | 'BAD' | 'NONE' }>({});

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getUserMovieById(movieId);
        setMovie(data);
      } catch (e) {
        alert('영화 정보를 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    // 리뷰 목록 불러오기
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`http://review.impati.net/v1/movies/${movieId}/reviews`);
        const data = await res.json();
        // id 필드가 없고 reviewId만 있다면 id: reviewId로 매핑
        const reviewsWithId = data.map((r: any) => ({ ...r, id: r.id || r.reviewId }));
        setReviews(reviewsWithId);
      } catch (e) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
    // 리뷰별 공감/비공감 수 불러오기
    const fetchReviewReactions = async () => {
      try {
        const res = await fetch(`http://review.impati.net/v1/movies/${movieId}/review-reaction`);
        const data = await res.json();
        const map: { [reviewId: string]: { good: number; bad: number } } = {};
        data.forEach((item: any) => {
          map[item.reviewId] = { good: item.good, bad: item.bad };
        });
        setReviewReactions(map);
      } catch (e) {
        setReviewReactions({});
      }
    };
    fetchReviewReactions();
  }, [movieId, navigate]);

  useEffect(() => {
    if (!token) return;
    // 각 리뷰별로 내 반응 불러오기
    const fetchMyReactions = async () => {
      const result: { [reviewId: string]: 'GOOD' | 'BAD' | 'NONE' } = {};
      await Promise.all(reviews.map(async (review) => {
        try {
          const res = await fetch(`http://review.impati.net/v1/reviews/${review.id}/reaction`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await res.json();
          result[review.id] = data.reactionType || 'NONE';
        } catch {
          result[review.id] = 'NONE';
        }
      }));
      setMyReactions(result);
    };
    if (reviews.length > 0) fetchMyReactions();
  }, [token, reviews]);

  // 리뷰 등록 핸들러
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setReviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleReviewRating = (name: keyof ReviewForm, value: number | null) => {
    setReviewForm(prev => ({ ...prev, [name]: value || 0 }));
  };
  const handleSubmitReview = async () => {
    if (!token) {
      alert('로그인 후 리뷰를 작성할 수 있습니다.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`http://review.impati.net/v1/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewForm),
      });
      alert('리뷰가 등록되었습니다!');
      setReviewForm({ title: '', description: '', acting: 0, cinematography: 0, originality: 0, entertainment: 0, story: 0, hasSpoiler: false, rating: 0 });
      setReviewFormOpen(false);
      // 리뷰 목록 새로고침
      const res = await fetch(`http://review.impati.net/v1/movies/${movieId}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      alert('리뷰 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

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
        {/* 리뷰 목록 */}
        <Container maxWidth="md" sx={{ mb: 4, mt: 8 }}>
          <Box p={0} borderRadius={3}>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ flex: 1 }}>리뷰</Typography>
              {user && !reviewFormOpen && (
                <Button variant="contained" color="primary" sx={{ fontWeight: 700 }} onClick={() => setReviewFormOpen(true)}>
                  리뷰 작성
                </Button>
              )}
            </Box>
            {reviewFormOpen && user && (
              <Box display="flex" flexDirection="column" gap={2} mb={4}>
                <TextField label="한줄평" name="title" value={reviewForm.title} onChange={handleReviewChange} fullWidth required />
                <TextField
                  label="감상평"
                  name="description"
                  value={reviewForm.description}
                  onChange={handleReviewChange}
                  fullWidth
                  multiline
                  minRows={5}
                  inputProps={{ maxLength: 1000 }}
                  helperText={
                    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                      <Typography color="text.secondary" fontSize={14} mb={0.5}>
                        평점은 최대 1,000자까지 등록 가능합니다. 영화와 상관 없는 내용은 약관에 의해 제재를 받을 수 있습니다.
                      </Typography>
                      <Typography color="text.secondary" fontSize={13}>
                        ({reviewForm.description.length}/1,000)
                      </Typography>
                    </Box>
                  }
                  required
                />
                <Box display="flex" gap={4} flexWrap="wrap">
                  <Box>
                    <Typography>연기</Typography>
                    <Rating value={reviewForm.acting} max={5} onChange={(_, v) => handleReviewRating('acting', v)} />
                  </Box>
                  <Box>
                    <Typography>연출</Typography>
                    <Rating value={reviewForm.cinematography} max={5} onChange={(_, v) => handleReviewRating('cinematography', v)} />
                  </Box>
                  <Box>
                    <Typography>신선도</Typography>
                    <Rating value={reviewForm.originality} max={5} onChange={(_, v) => handleReviewRating('originality', v)} />
                  </Box>
                  <Box>
                    <Typography>재미</Typography>
                    <Rating value={reviewForm.entertainment} max={5} onChange={(_, v) => handleReviewRating('entertainment', v)} />
                  </Box>
                  <Box>
                    <Typography>스토리</Typography>
                    <Rating value={reviewForm.story} max={5} onChange={(_, v) => handleReviewRating('story', v)} />
                  </Box>
                  <Box>
                    <Typography>종합 평점</Typography>
                    <Rating value={reviewForm.rating} max={5} onChange={(_, v) => handleReviewRating('rating', v)} />
                  </Box>
                </Box>
                <Box mt={2} mb={1}>
                  <Typography fontWeight={500} mb={1} fontSize={15}>감상평에 스포일러가 포함되어있나요?</Typography>
                  <Box display="flex" gap={2}>
                    <Button
                      variant={!reviewForm.hasSpoiler ? 'contained' : 'outlined'}
                      color={!reviewForm.hasSpoiler ? 'primary' : 'inherit'}
                      onClick={() => setReviewForm(prev => ({ ...prev, hasSpoiler: false }))}
                      sx={{ borderRadius: 8, minWidth: 80 }}
                    >
                      없음
                    </Button>
                    <Button
                      variant={reviewForm.hasSpoiler ? 'contained' : 'outlined'}
                      color={reviewForm.hasSpoiler ? 'error' : 'inherit'}
                      onClick={() => setReviewForm(prev => ({ ...prev, hasSpoiler: true }))}
                      sx={{ borderRadius: 8, minWidth: 80 }}
                    >
                      있음
                    </Button>
                  </Box>
                </Box>
                <Box display="flex" gap={2}>
                  <Button variant="contained" color="primary" onClick={handleSubmitReview} disabled={submitting} sx={{ fontWeight: 700, mt: 2 }}>
                    {submitting ? '등록 중...' : '리뷰 등록'}
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setReviewFormOpen(false)} sx={{ fontWeight: 700, mt: 2 }}>
                    취소
                  </Button>
                </Box>
              </Box>
            )}
            {reviewsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}><CircularProgress /></Box>
            ) : reviews.length === 0 ? (
              <Typography color="text.secondary">아직 등록된 리뷰가 없습니다.</Typography>
            ) : (
              <ReviewListWithSpoiler 
                reviews={reviews} 
                reviewReactions={reviewReactions} 
                myReactions={myReactions} 
                token={token} 
                onReacted={async (reviewId, type) => {
                  if (!token) return;
                  await fetch(`http://review.impati.net/v1/reviews/${reviewId}/reaction?reactionType=${type}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  // 반영 후 다시 불러오기
                  const res = await fetch(`http://review.impati.net/v1/movies/${movieId}/review-reaction`);
                  const data = await res.json();
                  const map: { [reviewId: string]: { good: number; bad: number } } = {};
                  data.forEach((item: any) => {
                    map[item.reviewId] = { good: item.good, bad: item.bad };
                  });
                  setReviewReactions(map);
                  // 내 반응도 갱신
                  const res2 = await fetch(`http://review.impati.net/v1/reviews/${reviewId}/reaction`, { headers: { 'Authorization': `Bearer ${token}` } });
                  const data2 = await res2.json();
                  setMyReactions(prev => ({ ...prev, [reviewId]: data2.reactionType || 'NONE' }));
                }}
              />
            )}
          </Box>
        </Container>
      </Container>
    </Fade>
  );
};

// 리뷰 목록에서 스포일러 감추기/보기 기능 + 공감/비공감 버튼
const ReviewListWithSpoiler: React.FC<{ reviews: Review[], reviewReactions: any, myReactions: any, token: string|null, onReacted: (reviewId: string, type: 'GOOD'|'BAD') => void }> = ({ reviews, reviewReactions, myReactions, token, onReacted }) => {
  const [openSpoiler, setOpenSpoiler] = useReactState<{ [id: string]: boolean }>({});
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {reviews.map((review) => {
        const isSpoiler = review.hasSpoiler;
        const isOpen = openSpoiler[review.id];
        const reaction = myReactions[review.id] || 'NONE';
        const counts = reviewReactions[review.id] || { good: 0, bad: 0 };
        return (
          <Paper key={review.id} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)' }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              {isSpoiler && !isOpen ? (
                <Typography fontWeight={700} fontSize={18} color="error.main">스포일러가 포함된 리뷰입니다.</Typography>
              ) : (
                <Typography fontWeight={700} fontSize={18}>{review.title}</Typography>
              )}
              <Rating value={review.rating} max={5} readOnly size="small" sx={{ ml: 1 }} />
              <Box flex={1} />
              <Typography color="text.secondary" fontSize={14}>{review.nickName}</Typography>
              <Typography color="text.secondary" fontSize={13} ml={2}>{new Date(review.createdAt).toLocaleString()}</Typography>
            </Box>
            {isSpoiler && !isOpen ? (
              <Box>
                <Button variant="outlined" color="error" size="small" onClick={() => setOpenSpoiler(prev => ({ ...prev, [review.id]: true }))}>
                  스포일러 감안하고 보기
                </Button>
              </Box>
            ) : (
              <>
                <Typography mb={1}>{review.description}</Typography>
                <Box display="flex" gap={2} mt={1} alignItems="center">
                  <Typography color="text.secondary" fontSize={14}>연기: {review.acting}</Typography>
                  <Typography color="text.secondary" fontSize={14}>연출: {review.cinematography}</Typography>
                  <Typography color="text.secondary" fontSize={14}>신선도: {review.originality}</Typography>
                  <Typography color="text.secondary" fontSize={14}>재미: {review.entertainment}</Typography>
                  <Typography color="text.secondary" fontSize={14}>스토리: {review.story}</Typography>
                  {review.hasSpoiler && (
                    <Box ml={2} px={1.5} py={0.5} bgcolor="error.main" borderRadius={2}>
                      <Typography color="#fff" fontSize={13} fontWeight={700}>스포일러 포함</Typography>
                    </Box>
                  )}
                  {/* 공감/비공감 버튼 */}
                  <Box ml={3} display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      variant={reaction === 'GOOD' ? 'contained' : 'outlined'}
                      color={reaction === 'GOOD' ? 'primary' : 'inherit'}
                      disabled={!token}
                      onClick={() => onReacted(review.id, reaction === 'GOOD' ? 'GOOD' : 'GOOD')}
                      sx={{ minWidth: 36, px: 1 }}
                    >
                      <ThumbUpIcon fontSize="small" /> {counts.good}
                    </Button>
                    <Button
                      size="small"
                      variant={reaction === 'BAD' ? 'contained' : 'outlined'}
                      color={reaction === 'BAD' ? 'error' : 'inherit'}
                      disabled={!token}
                      onClick={() => onReacted(review.id, reaction === 'BAD' ? 'BAD' : 'BAD')}
                      sx={{ minWidth: 36, px: 1 }}
                    >
                      <ThumbDownIcon fontSize="small" /> {counts.bad}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default UserMovieDetailPage; 