import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, alpha } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { AssessmentHistory, AxisType } from '@/types';
import { getAxisName } from '@/utils/comments';
import { getAxisColor } from '@/constants/axisColors';

interface ChangeIndicatorProps {
  history: AssessmentHistory[];
}

interface ChangeData {
  axis: AxisType;
  current: number;
  previous: number | null;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ history }) => {
  if (history.length < 2) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            比較するには、少なくとも2回の診断結果が必要です
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 最新と1つ前の診断結果を取得
  const sortedHistory = [...history].sort((a, b) => {
    const aTime = a.answeredAt?.toMillis?.() || 0;
    const bTime = b.answeredAt?.toMillis?.() || 0;
    return bTime - aTime; // 新しい順
  });

  const current = sortedHistory[0];
  const previous = sortedHistory[1];

  const axes: AxisType[] = ['energy', 'thinking', 'planning', 'vision'];

  const changes: ChangeData[] = axes.map((axis) => {
    const currentValue = current[axis];
    const previousValue = previous[axis];
    const change = currentValue - previousValue;
    const absChange = Math.abs(change);

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (absChange >= 5) {
      trend = change > 0 ? 'up' : 'down';
    }

    return {
      axis,
      current: currentValue,
      previous: previousValue,
      change,
      trend,
    };
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 18 }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 18 }} />;
      default:
        return <Remove sx={{ fontSize: 18 }} />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          前回からの変化
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {changes.map((change) => (
              <Grid item xs={12} sm={6} key={change.axis}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(getAxisColor(change.axis), 0.2),
                    backgroundColor: alpha(getAxisColor(change.axis), 0.05),
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600">
                      {getAxisName(change.axis)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(change.trend)}
                      label={change.change > 0 ? `+${change.change}` : `${change.change}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getTrendColor(change.trend), 0.1),
                        color: getTrendColor(change.trend),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      前回: {change.previous}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: getAxisColor(change.axis) }}>
                      現在: {change.current}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
