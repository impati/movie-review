import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserMoviePage from './pages/UserMoviePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import UserMovieDetailPage from './pages/UserMovieDetailPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import MyPage from './pages/MyPage';
import Header from './components/Header';
import TokenExpiredDialog from './components/TokenExpiredDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppContent() {
  const { showTokenExpiredDialog, setShowTokenExpiredDialog } = useAuth();

  const handleLogin = () => {
    setShowTokenExpiredDialog(false);
    window.location.href = '/login';
  };

  const handleClose = () => {
    setShowTokenExpiredDialog(false);
  };

  return (
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
      <TokenExpiredDialog
        open={showTokenExpiredDialog}
        onClose={handleClose}
        onLogin={handleLogin}
      />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
