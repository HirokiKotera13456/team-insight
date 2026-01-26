import React from 'react';
import { Box, Stack, Alert, Typography } from '@mui/material';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HistoryChart } from '@/components/ui/HistoryChart';
import { ChangeIndicator } from '@/components/ui/ChangeIndicator';
import { LoadingState } from '@/components/ui/LoadingState';

const History: React.FC = () => {
  const { user } = useAuth();
  const { history, loading, error } = useAssessmentHistory(user?.uid);

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          {loading ? (
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
      </AppLayout>
    </ProtectedRoute>
  );
};

export default History;
