import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Info } from '@mui/icons-material';

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <Card
      sx={{
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid',
        borderColor: 'rgba(99, 102, 241, 0.2)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Info sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight="500" sx={{ lineHeight: 1.7, mb: 1 }}>
              {summary}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.7, fontStyle: 'italic' }}
            >
              ※ これは性格ではなく、仕事の進め方の傾向を表しています
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
