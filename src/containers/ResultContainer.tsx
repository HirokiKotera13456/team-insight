import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { exportAsPDF } from '@/utils/export';
import { ResultPresentation } from '@/components/presentation/ResultPresentation';
import { LoadingState } from '@/components/ui/LoadingState';

export const ResultContainer: React.FC = () => {
  const { user } = useAuth();
  const { scores, loading, error: scoresError } = useAxisScores(user?.uid);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const error =
    scoresError ||
    (!scores && !loading
      ? '診断結果が見つかりません。まず診断を完了してください。'
      : null);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportAsPDF('result-export', `work-insight-result-${new Date().toISOString().split('T')[0]}.pdf`);
      setSnackbar({ open: true, message: 'PDFとして保存しました', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'エクスポートに失敗しました', severity: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <ProtectedRoute allowGuest>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <LoadingState />
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error || !scores) {
    return (
      <ProtectedRoute allowGuest>
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

  return (
    <ProtectedRoute allowGuest>
      <AppLayout>
        <ResultPresentation
          scores={scores}
          isGuest={!user}
          exporting={exporting}
          snackbar={snackbar}
          onExportPDF={handleExportPDF}
          onCloseSnackbar={handleCloseSnackbar}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};
