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
    <Box sx={{ mb: 5, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          診断
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="500">
          {currentIndex + 1} / {totalQuestions}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: '#6366f1',
          },
        }}
      />
      {axisName && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={axisName}
            size="small"
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
            }}
          />
        </Box>
      )}
    </Box>
  );
};
