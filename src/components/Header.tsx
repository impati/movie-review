import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC = () => {
  const user = localStorage.getItem('user');
  const userObj = user ? JSON.parse(user) : null;

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ background: 'none', boxShadow: 'none', mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 1, sm: 3, md: 6 } }}>
        <Typography variant="h5" fontWeight={900} sx={{ color: 'primary.main', letterSpacing: -1 }}>
          영화 리뷰
        </Typography>
        <Box>
          {userObj && userObj.nickName ? (
            <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>
              {userObj.nickName} 님
            </Typography>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 700, borderRadius: 2, minWidth: 100, height: 44 }}
              onClick={() => { window.location.href = 'http://review.impati.net/v1/members/login'; }}
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