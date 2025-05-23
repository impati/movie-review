import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserMoviePage from './pages/UserMoviePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import UserMovieDetailPage from './pages/UserMovieDetailPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import MyPage from './pages/MyPage';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<UserMoviePage />} />
          <Route path="/user-movie/:movieId" element={<UserMovieDetailPage />} />
          <Route path="/admin" element={<HomePage />} />
          <Route path="/admin/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
