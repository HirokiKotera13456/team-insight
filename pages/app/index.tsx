import React from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Skeleton, Alert, Stack } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { AxisScores } from '@/types';
import { getAxisName } from '@/utils/comments';
import { getOverallSummary } from '@/utils/summary';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { AxisCard } from '@/components/ui/AxisCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { NextActions } from '@/components/ui/NextActions';

const AppIndex: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { scores, loading, error } = useAxisScores(user?.uid);

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          <SectionTitle
            title="ダッシュボード"
            subtitle="あなたの仕事の進め方の傾向を確認しましょう"
          />

          {loading ? (
            <Stack spacing={4}>
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 3 }}
              />
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map(i => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton
                      variant="rectangular"
                      height={140}
                      sx={{ borderRadius: 3 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 3, width: '100%' }}>
              {error}
            </Alert>
          ) : !scores ? (
            <EmptyState
              icon={<Assessment />}
              title="診断を開始しましょう"
              description="12問の質問に答えて、あなたの仕事の進め方の傾向を可視化します。各質問はスライダーで直感的に回答できます。"
              action={{
                label: '診断を開始',
                onClick: () => router.push('/app/assessment'),
                startIcon: <Assessment />,
              }}
            />
          ) : (
            <Stack spacing={5}>
              {/* 一言サマリー */}
              <SummaryCard summary={getOverallSummary(scores)} />

              {/* 4軸カード */}
              <Grid container spacing={3} sx={{ width: '100%' }}>
                {(
                  ['energy', 'thinking', 'planning', 'vision'] as Array<
                    keyof AxisScores
                  >
                ).map(axis => (
                  <Grid item xs={12} sm={6} key={axis}>
                    <AxisCard
                      axis={axis}
                      score={scores[axis]}
                      axisName={getAxisName(axis)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* 次にできること */}
              <NextActions
                onViewResult={() => router.push('/app/result')}
                onCompare={() => router.push('/app/compare')}
                onReassess={() => router.push('/app/assessment')}
              />
            </Stack>
          )}
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default AppIndex;
