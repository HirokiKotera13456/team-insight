import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/ui/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean; // 認証なしでもアクセス可能にするか（現在は使用されていませんが、互換性のため残しています）
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowGuest = true }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <LoadingState />
      </Box>
    );
  }

  return <>{children}</>;
};
