import React from 'react';
import { useRouter } from 'next/router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAxisScores } from '@/hooks/useAxisScores';
import { DashboardPresentation } from '@/components/presentation/DashboardPresentation';

export const DashboardContainer: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { scores, loading, error } = useAxisScores(user?.uid);

  const handleStartAssessment = () => {
    router.push('/app/assessment');
  };

  const handleViewResult = () => {
    router.push('/app/result');
  };

  const handleReassess = () => {
    router.push('/app/assessment');
  };

  return (
    <ProtectedRoute allowGuest>
      <AppLayout>
        <DashboardPresentation
          isGuest={!user}
          loading={loading}
          error={error}
          scores={scores}
          onStartAssessment={handleStartAssessment}
          onViewResult={handleViewResult}
          onReassess={handleReassess}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};
