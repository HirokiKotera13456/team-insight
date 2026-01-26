import React from 'react';
import { useRouter } from 'next/router';
import { Box, Alert, Stack } from '@mui/material';
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
import { LoadingState } from '@/components/ui/LoadingState';

const AppIndex: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { scores, loading, error } = useAxisScores(user?.uid);

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          {loading ? (
            <LoadingState />
          ) : (
            <>
              <SectionTitle
                title="ダッシュボード"
                subtitle="あなたの傾向をチェック"
              />
              {error ? (
            <Alert severity="error" sx={{ borderRadius: 3, width: '100%' }}>
              {error}
            </Alert>
          ) : !scores ? (
            <EmptyState
              icon={<Assessment />}
              title="まずは診断してみましょう"
              description="12問の質問に直感で答えるだけ。3分くらいで終わります。"
              action={{
                label: '診断をはじめる',
                onClick: () => router.push('/app/assessment'),
                startIcon: <Assessment />,
              }}
            />
          ) : (
            <Stack spacing={5}>
              {/* 一言サマリー */}
              <SummaryCard summary={getOverallSummary(scores)} />

              {/* 4軸カード */}
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {(
                  ['energy', 'thinking', 'planning', 'vision'] as Array<
                    keyof AxisScores
                  >
                ).map(axis => (
                  <Box
                    key={axis}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <AxisCard
                      axis={axis}
                      score={scores[axis]}
                      axisName={getAxisName(axis)}
                    />
                  </Box>
                ))}
              </Box>

              {/* 次にできること */}
              <NextActions
                onViewResult={() => router.push('/app/result')}
                onReassess={() => router.push('/app/assessment')}
              />
            </Stack>
              )}
            </>
          )}
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default AppIndex;
