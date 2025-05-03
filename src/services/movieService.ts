import axios from 'axios';

const API_BASE_URL = 'http://review.impati.net:8080';

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
  detail: MovieDetail;
}

export interface CreateMovieRequest {
  movieName: string;
  director: string;
  actors: string[];
  detail: MovieDetail;
}

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