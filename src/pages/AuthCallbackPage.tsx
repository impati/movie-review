import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://review.impati.net';

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      axios.get(`${API_BASE_URL}/v1/members?token=${token}`)
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/');
        });
    }
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default AuthCallbackPage; 