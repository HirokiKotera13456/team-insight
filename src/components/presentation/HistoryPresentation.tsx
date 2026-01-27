import React from 'react';
import { Box, Stack, Alert, Typography } from '@mui/material';
import { AssessmentHistory } from '@/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HistoryChart } from '@/components/ui/HistoryChart';
import { ChangeIndicator } from '@/components/ui/ChangeIndicator';
import { LoadingState } from '@/components/ui/LoadingState';

export interface HistoryPresentationProps {
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  history: AssessmentHistory[];
}

export const HistoryPresentation: React.FC<HistoryPresentationProps> = ({
  isGuest,
  loading,
  error,
  history,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {isGuest ? (
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: 3, 
            width: '100%',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          ⚠️ 診断履歴を表示するにはログインが必要です。ログインすると、過去の診断結果とスコアの変化を確認できるようになります。
        </Alert>
      ) : loading ? (
        <LoadingState />
      ) : (
        <>
          <SectionTitle
            title="診断履歴"
            subtitle="過去の診断結果とスコアの変化を確認"
          />
          {error ? (
            <Alert severity="error" sx={{ borderRadius: 3, width: '100%' }}>
              {error}
            </Alert>
          ) : history.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3, width: '100%' }}>
              まだ診断履歴がありません。診断を完了すると、ここに履歴が表示されます。
            </Alert>
          ) : (
            <Stack spacing={4}>
              <ChangeIndicator history={history} />
              <HistoryChart history={history} />
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  診断回数: {history.length}回
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  最新の診断: {history[0]?.answeredAt?.toDate?.()?.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) || '不明'}
                </Typography>
              </Box>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};
