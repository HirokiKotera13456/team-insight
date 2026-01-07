import React from 'react';
import { Typography, Box } from '@mui/material';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  variant?: 'h4' | 'h5' | 'h6';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  variant = 'h5',
}) => {
  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant={variant} component="h1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
