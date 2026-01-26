import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  Alert,
  alpha,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  DonutLarge,
  TrendingUp,
} from '@mui/icons-material';
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
  Cell,
  TooltipProps,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { AxisScores } from '@/types';
import { getAxisName, getAxisLabel, getAxisComments } from '@/utils/comments';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatCard } from '@/components/ui/StatCard';

// 軸ごとのカラー定義
const axisColors = {
  energy: { main: '#6366f1', light: '#818cf8', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
  thinking: { main: '#8b5cf6', light: '#a78bfa', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)' },
  planning: { main: '#06b6d4', light: '#22d3ee', gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' },
  vision: { main: '#f59e0b', light: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
};

// カスタムツールチップ
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {payload[0].value}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            / 100
          </Typography>
        </Typography>
      </Box>
    );
  }
  return null;
};

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

  const axisKeys = ['energy', 'thinking', 'planning', 'vision'] as Array<keyof AxisScores>;

  // 棒グラフ用データ（色情報付き）
  const barData = axisKeys.map(axis => ({
    name: getAxisName(axis),
    value: scores[axis],
    color: axisColors[axis].main,
    lightColor: axisColors[axis].light,
    axis,
  }));

  // レーダーチャート用データ
  const radarData = axisKeys.map(axis => ({
    axis: getAxisName(axis),
    value: scores[axis],
    fullMark: 100,
  }));

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          <SectionTitle
            title="診断結果"
            subtitle="4つの軸であなたの傾向を見える化"
          />

          <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
            {axisKeys.map(axis => {
              const colors = axisColors[axis];
              const labels = getAxisLabel(axis);
              return (
                <Grid item xs={12} sm={6} key={axis}>
                  <Card
                    sx={{
                      height: '100%',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 20px 40px ${alpha(colors.main, 0.2)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: colors.gradient,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                          {getAxisName(axis)}
                        </Typography>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: alpha(colors.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TrendingUp sx={{ color: colors.main, fontSize: 20 }} />
                        </Box>
                      </Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          background: colors.gradient,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                        }}
                      >
                        {scores[axis]}
                        <Typography component="span" variant="h6" sx={{ WebkitTextFillColor: '#94a3b8', ml: 0.5 }}>
                          / 100
                        </Typography>
                      </Typography>
                      {/* スコアバー */}
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(colors.main, 0.1),
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${scores[axis]}%`,
                              background: colors.gradient,
                              borderRadius: 4,
                              transition: 'width 1s ease-out',
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {labels.left}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {labels.right}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        {comments[axis]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      <BarChartIcon sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        スコア比較
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        4軸のスコアを棒グラフで表示
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barCategoryGap="20%">
                        <defs>
                          {axisKeys.map(axis => (
                            <linearGradient key={axis} id={`gradient-${axis}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={axisColors[axis].light} stopOpacity={1} />
                              <stop offset="100%" stopColor={axisColors[axis].main} stopOpacity={1} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickCount={6}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#gradient-${entry.axis})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(217, 70, 239, 0.03) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      <DonutLarge sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        バランスチャート
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        4軸のバランスをレーダーで表示
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <defs>
                          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <PolarAngleAxis
                          dataKey="axis"
                          tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fill: '#94a3b8', fontSize: 10 }}
                          tickCount={5}
                          axisLine={false}
                        />
                        <Radar
                          name="スコア"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="url(#radarGradient)"
                          dot={{
                            r: 5,
                            fill: '#8b5cf6',
                            strokeWidth: 2,
                            stroke: '#fff',
                          }}
                          activeDot={{
                            r: 7,
                            fill: '#8b5cf6',
                            strokeWidth: 3,
                            stroke: '#fff',
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
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
