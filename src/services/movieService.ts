import axios from 'axios';

const API_BASE_URL = 'http://review.impati.net';

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

// 사용자용 영화 검색 API (movieName 쿼리, 없으면 전체)
export const searchMovies = async (movieName?: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/v1/api/movies`, {
    params: movieName ? { movieName } : {},
  });
  return response.data;
};

// 사용자용 영화 상세 API
export const getUserMovieById = async (movieId: string): Promise<Movie> => {
  const response = await axios.get(`${API_BASE_URL}/v1/api/movies/${movieId}`);
  return response.data;
};

export const getMovies = async (): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/v1/movies`);
  return response.data;
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  const response = await axios.get(`${API_BASE_URL}/v1/movies/${movieId}`);
  return response.data;
};

export const createMovie = async (movie: CreateMovieRequest): Promise<Movie> => {
  const response = await axios.post(`${API_BASE_URL}/v1/movies`, movie);
  return response.data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/v1/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url;
}; 