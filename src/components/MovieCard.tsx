import React from 'react';
import { Card, CardContent, Typography, Chip, Box, CardMedia } from '@mui/material';
import { Movie } from '../services/movieService';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const CARD_HEIGHT = 800;
const POSTER_HEIGHT = 220;
const CHIP_ROW_HEIGHT = 32;
const TITLE_HEIGHT = 32;
const FOOTER_HEIGHT = 28;

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <Card 
      sx={{ 
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)'
        },
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height={POSTER_HEIGHT}
        image={movie.poster && movie.poster.trim() !== '' ? movie.poster : 'https://via.placeholder.com/120x160?text=No+Image'}
        alt="포스터"
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{
        p: 3,
        pb: 4,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <Box sx={{ flex: 'none', minHeight: 32, mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 700 }}>
            {movie.movieName}
          </Typography>
        </Box>
        <Box sx={{
          flex: 'none',
          minHeight: 32,
          maxHeight: 64,
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1,
        }}>
          {movie.detail.categories.map((cat) => (
            <Chip key={cat} label={cat} size="small" sx={{ mr: 1, mb: 0.5, display: 'inline-block', verticalAlign: 'middle' }} />
          ))}
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ flex: 'none', minHeight: 32, mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '100%', whiteSpace: 'normal', wordBreak: 'keep-all', fontWeight: 500 }}>
            감독: {movie.director}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 