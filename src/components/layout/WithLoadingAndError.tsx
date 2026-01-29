import React from 'react';
import { Box, Alert } from '@mui/material';
import { AppLayout } from './AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingState } from '@/components/ui/LoadingState';

interface WithLoadingAndErrorProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  allowGuest?: boolean;
  emptyMessage?: string;
  showEmpty?: boolean;
}

export const WithLoadingAndError: React.FC<WithLoadingAndErrorProps> = ({
  loading,
  error,
  children,
  allowGuest = false,
  emptyMessage,
  showEmpty = false,
}) => {
  if (loading) {
    return (
      <ProtectedRoute allowGuest={allowGuest}>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <LoadingState />
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowGuest={allowGuest}>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <Alert severity="error" sx={{ borderRadius: 3, width: '100%' }}>
              {error}
            </Alert>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (showEmpty && emptyMessage) {
    return (
      <ProtectedRoute allowGuest={allowGuest}>
        <AppLayout>
          <Box sx={{ width: '100%' }}>
            <Alert severity="info" sx={{ borderRadius: 3, width: '100%' }}>
              {emptyMessage}
            </Alert>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return <>{children}</>;
};
