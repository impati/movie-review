import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { getApiUrl } from '../config/api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ background: 'none', boxShadow: 'none', mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 1, sm: 3, md: 6 } }}>
        <Typography 
          variant="h5" 
          fontWeight={900} 
          sx={{ color: 'primary.main', letterSpacing: -1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          영화 리뷰
        </Typography>
        <Box>
          {user && user.nickName ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>
                {user.nickName} 님
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/mypage')}
                sx={{ fontWeight: 700 }}
              >
                마이페이지
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={logout}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 80, height: 44 }}
              >
                로그아웃
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 700, borderRadius: 2, minWidth: 100, height: 44 }}
              onClick={() => { window.location.href = `${getApiUrl()}/v1/members/login`; }}
            >
              로그인
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 