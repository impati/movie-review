import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import { useUser } from '../contexts/UserContext';

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      axios.get(`${getApiUrl()}/v1/members?token=${token}`)
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
          navigate('/');
        });
    }
  }, [location, navigate, setUser]);

  return <div>로그인 처리 중...</div>;
};

export default AuthCallbackPage; 