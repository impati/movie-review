import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Movie } from '../services/movieService';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const CARD_HEIGHT = 220;
const CHIP_ROW_HEIGHT = 32;
const TITLE_HEIGHT = 32;
const FOOTER_HEIGHT = 28;

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <Card 
      sx={{ 
        width: '100%',
        minWidth: 0,
        minHeight: `${CARD_HEIGHT}px`,
        maxHeight: `${CARD_HEIGHT}px`,
        height: `${CARD_HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)'
        },
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <CardContent sx={{
        p: 2,
        pb: 3.5,
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <Box sx={{ minHeight: `${TITLE_HEIGHT}px`, display: 'flex', alignItems: 'center' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 700 }}>
            {movie.movieName}
          </Typography>
        </Box>
        <Box sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          mb: 1,
          height: `${CHIP_ROW_HEIGHT}px`,
          maxHeight: `${CHIP_ROW_HEIGHT}px`,
          minHeight: `${CHIP_ROW_HEIGHT}px`,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          display: 'flex',
          alignItems: 'center',
        }}>
          {movie.detail.categories.map((cat) => (
            <Chip key={cat} label={cat} size="small" sx={{ mr: 1, mb: 0.5, display: 'inline-block', verticalAlign: 'middle' }} />
          ))}
        </Box>
        <Box display="flex" alignItems="center" sx={{ minHeight: `${FOOTER_HEIGHT}px`, mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>
            감독: {movie.director}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 