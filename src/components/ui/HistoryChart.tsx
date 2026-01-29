import React from 'react';
import { Box, Card, CardContent, Typography, alpha } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AssessmentHistory } from '@/types';
import { getAxisName } from '@/utils/comments';
import { getAxisColor } from '@/constants/axisColors';

interface HistoryChartProps {
  history: AssessmentHistory[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            履歴データがありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // データを時系列でソート（古い順）
  const sortedHistory = [...history].sort((a, b) => {
    const aTime = a.answeredAt?.toMillis?.() || 0;
    const bTime = b.answeredAt?.toMillis?.() || 0;
    return aTime - bTime;
  });

  // グラフ用データに変換
  const chartData = sortedHistory.map((item, index) => {
    const date = item.answeredAt?.toDate?.();
    const dateLabel = date
      ? `${date.getMonth() + 1}/${date.getDate()}`
      : `#${index + 1}`;

    return {
      date: dateLabel,
      fullDate: date,
      energy: item.energy,
      thinking: item.thinking,
      planning: item.planning,
      vision: item.vision,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: '#fff',
            border: '1px solid',
            borderColor: alpha('#6366f1', 0.2),
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {payload[0]?.payload?.fullDate && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {payload[0].payload.fullDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          )}
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color, fontWeight: 600 }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          スコアの推移
        </Typography>
        <Box sx={{ width: '100%', height: 400, mt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#6366f1', 0.1)} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => getAxisName(value as any)}
                wrapperStyle={{ fontSize: '0.875rem' }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke={getAxisColor('energy')}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="energy"
              />
              <Line
                type="monotone"
                dataKey="thinking"
                stroke={getAxisColor('thinking')}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="thinking"
              />
              <Line
                type="monotone"
                dataKey="planning"
                stroke={getAxisColor('planning')}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="planning"
              />
              <Line
                type="monotone"
                dataKey="vision"
                stroke={getAxisColor('vision')}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="vision"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
