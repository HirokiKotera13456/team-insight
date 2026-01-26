import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { TrendingUp, Psychology, EventNote, Visibility } from '@mui/icons-material';
import { getAxisLabel } from '@/utils/comments';
import { getAxisTendencyLabel, getAxisWorkExample } from '@/utils/summary';
import { AxisType } from '@/types';

// 軸ごとのカラー定義とアイコン
const axisConfig = {
  energy: {
    main: '#6366f1',
    light: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: TrendingUp,
  },
  thinking: {
    main: '#8b5cf6',
    light: '#a78bfa',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    icon: Psychology,
  },
  planning: {
    main: '#06b6d4',
    light: '#22d3ee',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    icon: EventNote,
  },
  vision: {
    main: '#f59e0b',
    light: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: Visibility,
  },
};

interface AxisCardProps {
  axis: AxisType;
  score: number;
  axisName: string;
}

export const AxisCard: React.FC<AxisCardProps> = ({ axis, score, axisName }) => {
  const tendencyLabel = getAxisTendencyLabel(axis, score);
  const workExample = getAxisWorkExample(axis, score);
  const labels = getAxisLabel(axis);
  const config = axisConfig[axis];
  const Icon = config.icon;

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 40px ${alpha(config.main, 0.15)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: config.gradient,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1.5, sm: 2 } }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing={1}
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            {axisName}
          </Typography>
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: 2,
              background: alpha(config.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color: config.main, fontSize: { xs: 16, sm: 18 } }} />
          </Box>
        </Box>

        {/* 傾向ラベル */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: { xs: 0.75, sm: 1 },
            background: config.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {tendencyLabel}
        </Typography>

        {/* 仕事例 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 2.5 },
            lineHeight: 1.7,
            minHeight: { xs: 40, sm: 48 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {workExample}
        </Typography>

        {/* スコアバー */}
        <Box sx={{ mb: { xs: 1.25, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 0.75, sm: 1 } }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              スコア
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ 
                color: config.main,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {score}
              <Typography 
                component="span" 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  ml: 0.5,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                / 100
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              height: { xs: 5, sm: 6 },
              borderRadius: 3,
              backgroundColor: alpha(config.main, 0.1),
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${score}%`,
                background: config.gradient,
                borderRadius: 3,
                transition: 'width 0.8s ease-out',
              }}
            />
          </Box>
        </Box>

        {/* 軸ラベル */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: { xs: 1.25, sm: 1.5 },
            borderTop: '1px solid',
            borderColor: alpha(config.main, 0.1),
            gap: 1,
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              flex: 1,
            }}
          >
            {labels.left}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              flex: 1,
              textAlign: 'right',
            }}
          >
            {labels.right}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
