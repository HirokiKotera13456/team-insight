import React from 'react';
import { Box, Alert, Stack } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { AxisScores } from '@/types';
import { getAxisName } from '@/utils/comments';
import { getOverallSummary } from '@/utils/summary';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { AxisCard } from '@/components/ui/AxisCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { NextActions } from '@/components/ui/NextActions';
import { LoadingState } from '@/components/ui/LoadingState';

export interface DashboardPresentationProps {
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  scores: AxisScores | null;
  onStartAssessment: () => void;
  onViewResult: () => void;
  onReassess: () => void;
}

export const DashboardPresentation: React.FC<DashboardPresentationProps> = ({
  isGuest,
  loading,
  error,
  scores,
  onStartAssessment,
  onViewResult,
  onReassess,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {isGuest && (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 3, 
            width: '100%', 
            mb: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          現在ログインしていません。診断結果は保存されず、過去の履歴やグラフの履歴は表示できません。
        </Alert>
      )}
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
                onClick: onStartAssessment,
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
                onViewResult={onViewResult}
                onReassess={onReassess}
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};
