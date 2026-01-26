import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';

interface ProgressHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  axisName?: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentIndex,
  totalQuestions,
  axisName,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 2.5 } }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }}
        >
          診断
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          fontWeight="500"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {currentIndex + 1} / {totalQuestions}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: { xs: 6, sm: 8 },
          borderRadius: 4,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: '#6366f1',
          },
        }}
      />
      {axisName && (
        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <Chip
            label={axisName}
            size="small"
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 24, sm: 28 },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
