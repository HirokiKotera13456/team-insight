import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WithLoadingAndError } from '@/components/layout/WithLoadingAndError';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { exportAsPDF } from '@/utils/export';
import { ResultPresentation } from '@/components/presentation/ResultPresentation';
import { SnackbarState } from '@/types';

export const ResultContainer: React.FC = () => {
  const { user } = useAuth();
  const { scores, loading, error: scoresError } = useAxisScores(user?.uid);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
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

  if (!scores) {
    return null;
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
