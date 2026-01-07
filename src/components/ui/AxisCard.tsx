import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { getAxisLabel } from '@/utils/comments';
import { getAxisTendencyLabel, getAxisWorkExample } from '@/utils/summary';
import { AxisType } from '@/types';

interface AxisCardProps {
  axis: AxisType;
  score: number;
  axisName: string;
}

export const AxisCard: React.FC<AxisCardProps> = ({ axis, score, axisName }) => {
  const tendencyLabel = getAxisTendencyLabel(axis, score);
  const workExample = getAxisWorkExample(axis, score);
  const labels = getAxisLabel(axis);

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {axisName}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1.5 }}
        >
          {tendencyLabel}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mb: 2,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          {workExample}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.75rem', opacity: 0.7 }}
          >
            {score}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
            {labels.left}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
            {labels.right}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
