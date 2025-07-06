import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface TokenExpiredDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const TokenExpiredDialog: React.FC<TokenExpiredDialogProps> = ({
  open,
  onClose,
  onLogin,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #181c24 0%, #232a34 100%)',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <WarningIcon sx={{ fontSize: 48, color: '#ff9800', mr: 2 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          로그인 만료
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          로그인이 만료되었습니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          계속 이용하시려면 다시 로그인해주세요.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={onLogin}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
            },
          }}
        >
          로그인하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenExpiredDialog; 