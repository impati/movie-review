// 토큰 만료 처리 유틸리티

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  errors: ApiError[];
}

// 토큰 만료 여부 확인
export const isTokenExpired = (error: any): boolean => {
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors as ApiError[];
    return errors.some(err => err.code === 'EXPIRED_TOKEN');
  }
  return false;
};

let isTokenExpiredHandled = false;

// 토큰 제거 및 재로그인 안내 (기본 구현 - 서비스 레이어용)
export const handleTokenExpiration = () => {
  if (isTokenExpiredHandled) return;
  isTokenExpiredHandled = true;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
  window.location.href = '/'; // 메인으로 이동
};

// API 호출 래퍼 함수 (토큰 만료 자동 처리)
export const apiCall = async <T>(
  apiFunction: () => Promise<T>,
  onTokenExpired?: () => void
): Promise<T> => {
  try {
    return await apiFunction();
  } catch (error: any) {
    if (isTokenExpired(error)) {
      if (onTokenExpired) {
        onTokenExpired();
      } else {
        handleTokenExpiration();
      }
      throw error;
    }
    throw error;
  }
};

export { useUser } from '../contexts/UserContext'; 