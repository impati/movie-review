import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import { Movie } from '../services/movieService';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 350, 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.movieName}
        </Typography>
        <Stack direction="row" spacing={1} mt={1} mb={1}>
          {movie.detail.categories.map((cat) => (
            <Chip key={cat} label={cat} size="small" />
          ))}
        </Stack>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            감독: {movie.director}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {movie.detail.open}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 