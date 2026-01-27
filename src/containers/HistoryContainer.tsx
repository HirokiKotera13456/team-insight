import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { HistoryPresentation } from '@/components/presentation/HistoryPresentation';

export const HistoryContainer: React.FC = () => {
  const { user } = useAuth();
  const { history, loading, error } = useAssessmentHistory(user?.uid);

  return (
    <ProtectedRoute allowGuest>
      <AppLayout>
        <HistoryPresentation
          isGuest={!user}
          loading={loading}
          error={error}
          history={history}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};
