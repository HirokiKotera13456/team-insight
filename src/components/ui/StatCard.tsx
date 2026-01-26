import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = 'primary',
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          color={`${color}.main`}
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
