import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack, CircularProgress, Paper, Fade } from '@mui/material';
import { Movie, getMovies, createMovie, CreateMovieRequest, MovieDetail, uploadImage } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const defaultDetail: MovieDetail = {
  open: '',
  categories: [],
  country: '',
  runningTime: 0,
  distributor: '',
};

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateMovieRequest>({
    movieName: '',
    director: '',
    actors: [],
    poster: '',
    detail: { ...defaultDetail },
  });
  const [actorInput, setActorInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 영화 목록 불러오기
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      alert('영화 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // 폼 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('detail.')) {
      const detailKey = name.replace('detail.', '');
      setForm({ ...form, detail: { ...form.detail, [detailKey]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 배우 추가
  const handleAddActor = () => {
    if (actorInput.trim() && !form.actors.includes(actorInput.trim())) {
      setForm({ ...form, actors: [...form.actors, actorInput.trim()] });
      setActorInput('');
    }
  };
  const handleDeleteActor = (actor: string) => {
    setForm({ ...form, actors: form.actors.filter(a => a !== actor) });
  };

  // 카테고리 추가
  const handleAddCategory = () => {
    if (categoryInput.trim() && !form.detail.categories.includes(categoryInput.trim())) {
      setForm({ ...form, detail: { ...form.detail, categories: [...form.detail.categories, categoryInput.trim()] } });
      setCategoryInput('');
    }
  };
  const handleDeleteCategory = (cat: string) => {
    setForm({ ...form, detail: { ...form.detail, categories: form.detail.categories.filter(c => c !== cat) } });
  };

  // 포스터 파일 선택 핸들러
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  // 포스터 업로드
  const handleUploadPoster = async () => {
    if (!posterFile) return;
    setUploading(true);
    try {
      const url = await uploadImage(posterFile);
      setForm({ ...form, poster: url });
      setUploading(false);
      alert('포스터 업로드 성공!');
    } catch (error) {
      setUploading(false);
      alert('포스터 업로드 실패');
    }
  };

  // 영화 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.poster) {
      alert('포스터 이미지를 업로드해주세요.');
      return;
    }
    try {
      await createMovie({
        ...form,
        detail: {
          ...form.detail,
          runningTime: Number(form.detail.runningTime),
        },
      });
      setOpen(false);
      setForm({ movieName: '', director: '', actors: [], poster: '', detail: { ...defaultDetail } });
      setPosterFile(null);
      setPosterPreview('');
      fetchMovies();
    } catch (error) {
      alert('영화 등록에 실패했습니다.');
    }
  };

  return (
    <Fade in timeout={400}>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        {/* 상단 영화 등록 버튼 */}
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button variant="contained" size="large" sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'primary.main', color: 'white', boxShadow: 2 }} onClick={() => setOpen(true)}>
            영화 등록
          </Button>
        </Box>
        {/* 영화 등록 다이얼로그 */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>영화 등록</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ minWidth: 400 }}>
              <TextField
                margin="normal"
                fullWidth
                label="영화 제목"
                name="movieName"
                value={form.movieName}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="감독"
                name="director"
                value={form.director}
                onChange={handleChange}
                required
              />
              {/* 배우 입력 및 추가 */}
              <Box mt={2} mb={1}>
                <Typography variant="subtitle2">배우</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    value={actorInput}
                    onChange={e => setActorInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddActor(); }}}
                    placeholder="배우 이름 입력 후 Enter"
                  />
                  <Button onClick={handleAddActor} variant="outlined" size="small">추가</Button>
                </Stack>
                <Box mt={1}>
                  {form.actors.map(actor => (
                    <Chip key={actor} label={actor} onDelete={() => handleDeleteActor(actor)} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Box>
              {/* 포스터 업로드 */}
              <Box mt={2} mb={2}>
                <Typography variant="subtitle2">포스터 이미지</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" component="label" disabled={uploading}>
                    파일 선택
                    <input type="file" accept="image/*" hidden onChange={handlePosterChange} />
                  </Button>
                  {posterFile && !form.poster && (
                    <Button variant="outlined" onClick={handleUploadPoster} disabled={uploading}>
                      {uploading ? <CircularProgress size={20} /> : '업로드'}
                    </Button>
                  )}
                  {form.poster && <Typography color="success.main">업로드 완료</Typography>}
                </Stack>
                {posterPreview && (
                  <Box mt={2}>
                    <img src={posterPreview} alt="포스터 미리보기" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
                  </Box>
                )}
              </Box>
              {/* 상세 정보 */}
              <TextField
                margin="normal"
                fullWidth
                label="개봉일"
                name="detail.open"
                type="date"
                value={form.detail.open}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              {/* 카테고리 입력 및 추가 */}
              <Box mt={2} mb={1}>
                <Typography variant="subtitle2">카테고리</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }}}
                    placeholder="카테고리 입력 후 Enter"
                  />
                  <Button onClick={handleAddCategory} variant="outlined" size="small">추가</Button>
                </Stack>
                <Box mt={1}>
                  {form.detail.categories.map(cat => (
                    <Chip key={cat} label={cat} onDelete={() => handleDeleteCategory(cat)} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Box>
              <TextField
                margin="normal"
                fullWidth
                label="국가 (예: AMERICA, JAPAN)"
                name="detail.country"
                value={form.detail.country}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="상영 시간(분)"
                name="detail.runningTime"
                type="number"
                value={form.detail.runningTime}
                onChange={handleChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="배급사"
                name="detail.distributor"
                value={form.detail.distributor}
                onChange={handleChange}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button type="submit" variant="contained">등록</Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* 영화 목록 */}
        <Box mt={6}>
          <Typography variant="h4" fontWeight={900} mb={3} sx={{ color: 'primary.main', letterSpacing: -1 }}>
            영화 목록
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : movies.length === 0 ? (
            <Typography>등록된 영화가 없습니다.</Typography>
          ) : (
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={5} alignItems="stretch" width="100%" minWidth={0} boxSizing="border-box">
              {movies.map((movie) => (
                <Paper
                  key={movie.movieId}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    p: 0,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                    transition: 'box-shadow 0.25s, background 0.25s',
                    '&:hover': {
                      boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                    minHeight: 220,
                    height: 220,
                    maxHeight: 220,
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'stretch',
                    overflow: 'hidden',
                  }}
                >
                  <MovieCard movie={movie} onClick={() => navigate(`/movie/${movie.movieId}`)} />
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Fade>
  );
};

export default HomePage; 