import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Box,
  Chip,
} from '@mui/material';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  axisName: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  axisName,
}) => {
  return (
    <Card
      sx={{
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        width: '100%',
        mx: 'auto',
      }}
    >
      <CardContent sx={{ p: { xs: 4, sm: 5, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Chip
            label={axisName}
            size="small"
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
            }}
          />
          <Chip
            label={`現在: ${value}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              opacity: 0.6,
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          fontWeight="600"
          sx={{ mb: 1, lineHeight: 1.6 }}
        >
          {question.text}
        </Typography>

        {question.context && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 4, opacity: 0.8 }}
          >
            {question.context}
          </Typography>
        )}

        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
          <Slider
            value={value}
            onChange={(_, newValue) => onChange(typeof newValue === 'number' ? newValue : newValue[0])}
            min={0}
            max={100}
            step={1}
            marks={[
              {
                value: 0,
                label: question.shortLeftLabel || question.leftLabel,
              },
              {
                value: 100,
                label: question.shortRightLabel || question.rightLabel,
              },
            ]}
            valueLabelDisplay="off"
            sx={{
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#6366f1',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  width: 28,
                  height: 28,
                  backgroundColor: '#4f46e5',
                },
                '&.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                height: 6,
                backgroundColor: '#6366f1',
              },
              '& .MuiSlider-rail': {
                height: 6,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              '& .MuiSlider-mark': {
                backgroundColor: 'transparent',
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                color: 'text.secondary',
                fontWeight: 500,
                top: 36,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
