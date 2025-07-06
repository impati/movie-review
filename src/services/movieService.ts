import axios from 'axios';
import { getApiUrl } from '../config/api';
import { isTokenExpired, handleTokenExpiration } from '../utils/auth';

const API_URL = getApiUrl();

export interface MovieDetail {
  open: string;
  categories: string[];
  country: string;
  runningTime: number;
  distributor: string;
}

export interface Movie {
  movieId: string;
  movieName: string;
  director: string;
  actors: string[];
  poster: string;
  detail: MovieDetail;
}

export interface CreateMovieRequest {
  movieName: string;
  director: string;
  actors: string[];
  poster: string;
  detail: MovieDetail;
}

// 페이징을 지원하는 영화 검색 API
export interface MovieSearchParams {
  movieName?: string;
  offsetId?: string;
  fetchSize?: number;
}

// 사용자용 영화 검색 API (movieName 쿼리, 없으면 전체) - 페이징 지원
export const searchMovies = async (params?: MovieSearchParams): Promise<Movie[]> => {
  const searchParams: any = {};
  
  if (params?.movieName) {
    searchParams.movieName = params.movieName;
  }
  if (params?.offsetId) {
    searchParams.offsetId = params.offsetId;
  }
  if (params?.fetchSize) {
    searchParams.fetchSize = params.fetchSize;
  }
  
  const response = await axios.get(`${API_URL}/v1/api/movies`, {
    params: searchParams,
  });
  return response.data;
};

// 사용자용 영화 상세 API
export const getUserMovieById = async (movieId: string): Promise<Movie> => {
  const response = await axios.get(`${API_URL}/v1/api/movies/${movieId}`);
  return response.data;
};

export const getMovies = async (): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/v1/movies`);
  return response.data;
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  const response = await axios.get(`${API_URL}/v1/movies/${movieId}`);
  return response.data;
};

export const createMovie = async (movie: CreateMovieRequest): Promise<Movie> => {
  const response = await axios.post(`${API_URL}/v1/movies`, movie);
  return response.data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/v1/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url;
};

// 볼 영화 추가
export const addToWatchlist = async (movieId: string, token: string) => {
  try {
    await axios.post(`${getApiUrl()}/v1/watchlist/movies/${movieId}`, {}, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (error: any) {
    if (isTokenExpired(error)) {
      handleTokenExpiration();
    }
    throw error;
  }
};

// 볼 영화 제거
export const removeFromWatchlist = async (movieId: string, token: string) => {
  try {
    await axios.delete(`${getApiUrl()}/v1/watchlist/movies/${movieId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (error: any) {
    if (isTokenExpired(error)) {
      handleTokenExpiration();
    }
    throw error;
  }
};

// 내 볼 영화 목록 조회
export const getWatchlist = async (token: string): Promise<{ movieId: string }[]> => {
  try {
    const res = await axios.get(`${getApiUrl()}/v1/watchlist`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (isTokenExpired(error)) {
      handleTokenExpiration();
    }
    throw error;
  }
}; 