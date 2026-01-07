import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { AxisScores } from '@/types';
import { getAxisName, getAxisLabel, getAxisComments } from '@/utils/comments';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatCard } from '@/components/ui/StatCard';

const Result: React.FC = () => {
  const { user } = useAuth();
  const { scores, loading, error: scoresError } = useAxisScores(user?.uid);

  const error =
    scoresError ||
    (!scores && !loading
      ? '診断結果が見つかりません。まず診断を完了してください。'
      : null);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map(i => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error || !scores) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <Alert severity="error" sx={{ borderRadius: 3, width: '100%' }}>
              {error || '診断結果が見つかりません'}
            </Alert>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const comments = getAxisComments(scores);

  // 棒グラフ用データ
  const barData = (
    ['energy', 'thinking', 'planning', 'vision'] as Array<keyof AxisScores>
  ).map(axis => ({
    name: getAxisName(axis),
    value: scores[axis],
  }));

  // レーダーチャート用データ
  const radarData = [
    {
      axis: getAxisName('energy'),
      value: scores.energy,
    },
    {
      axis: getAxisName('thinking'),
      value: scores.thinking,
    },
    {
      axis: getAxisName('planning'),
      value: scores.planning,
    },
    {
      axis: getAxisName('vision'),
      value: scores.vision,
    },
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          <SectionTitle
            title="診断結果"
            subtitle="あなたの仕事の進め方の傾向を4軸で可視化しています"
          />

          <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
            {(
              ['energy', 'thinking', 'planning', 'vision'] as Array<
                keyof AxisScores
              >
            ).map(axis => (
              <Grid item xs={12} sm={6} key={axis}>
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {getAxisName(axis)}
                    </Typography>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {scores[axis]}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {getAxisLabel(axis).left} ← → {getAxisLabel(axis).right}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, color: 'text.primary' }}
                    >
                      {comments[axis]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    棒グラフ
                  </Typography>
                  <Box sx={{ mt: 2, height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#6366f1"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    レーダーチャート
                  </Typography>
                  <Box sx={{ mt: 2, height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                          dataKey="axis"
                          tick={{ fill: '#64748b' }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fill: '#64748b' }}
                        />
                        <Radar
                          name="スコア"
                          dataKey="value"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.6}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Result;
