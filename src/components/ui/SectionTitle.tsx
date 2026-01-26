import React from 'react';
import { Typography, Box, alpha } from '@mui/material';

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: subtitle ? 1 : 0 }}>
        <Box
          sx={{
            width: 4,
            height: variant === 'h4' ? 32 : variant === 'h5' ? 28 : 24,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
          }}
        />
        <Typography
          variant={variant}
          component="h1"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            ml: 3,
            pl: 1.5,
            borderLeft: '2px solid',
            borderColor: alpha('#6366f1', 0.2),
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
