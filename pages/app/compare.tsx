import React from 'react';
import { Box } from '@mui/material';
import { CompareArrows } from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';

const Compare: React.FC = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ width: '100%' }}>
          <SectionTitle
            title="比較"
            subtitle="他のユーザーとの傾向を比較できます"
          />
          <EmptyState
            icon={<CompareArrows />}
            title="準備中"
            description="この機能は近日実装予定です。他のユーザーとの傾向を比較できるようになります。"
          />
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Compare;
