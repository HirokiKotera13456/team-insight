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
      <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
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
          <Chip
            label={`現在: ${value}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: 'text.secondary',
              opacity: 0.6,
              height: { xs: 24, sm: 28 },
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          fontWeight="600"
          sx={{ 
            mb: { xs: 1, sm: 1.5 }, 
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {question.text}
        </Typography>

        {question.context && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              display: 'block', 
              mb: { xs: 3, sm: 4 }, 
              opacity: 0.8,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {question.context}
          </Typography>
        )}

        <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, mb: { xs: 2, sm: 3 } }}>
          {/* 左ラベル（上に表示） */}
          <Box sx={{ mb: { xs: 1.5, sm: 2 }, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                fontWeight: 500,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                textAlign: 'left',
                maxWidth: '45%',
              }}
            >
              {question.shortLeftLabel || question.leftLabel}
            </Typography>
          </Box>

          {/* スライダー */}
          <Slider
            value={value}
            onChange={(_, newValue) => onChange(typeof newValue === 'number' ? newValue : newValue[0])}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="off"
            sx={{
              '& .MuiSlider-thumb': {
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#6366f1',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  width: { xs: 24, sm: 28 },
                  height: { xs: 24, sm: 28 },
                  backgroundColor: '#4f46e5',
                },
                '&.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                height: { xs: 4, sm: 6 },
                backgroundColor: '#6366f1',
              },
              '& .MuiSlider-rail': {
                height: { xs: 4, sm: 6 },
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          />

          {/* 右ラベル（下に表示） */}
          <Box sx={{ mt: { xs: 1.5, sm: 2 }, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                fontWeight: 500,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                textAlign: 'right',
                maxWidth: '45%',
              }}
            >
              {question.shortRightLabel || question.rightLabel}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
