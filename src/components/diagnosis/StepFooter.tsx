import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface StepFooterProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isSaving?: boolean;
  canProceed?: boolean;
}

export const StepFooter: React.FC<StepFooterProps> = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  isSaving = false,
  canProceed = true,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: { xs: 3, sm: 4, md: 5 },
        gap: { xs: 1.5, sm: 2 },
        pt: { xs: 3, sm: 4 },
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={onPrevious}
        disabled={isFirst}
        sx={{ 
          minWidth: { xs: 'calc(50% - 8px)', sm: 140 },
          width: { xs: 'calc(50% - 8px)', sm: 'auto' },
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
        }}
      >
        前の質問
      </Button>

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={onNext}
        disabled={!canProceed || isSaving}
        sx={{ 
          minWidth: { xs: 'calc(50% - 8px)', sm: 120 },
          width: { xs: 'calc(50% - 8px)', sm: 'auto' },
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
        }}
      >
        {isLast ? '保存して結果へ' : '次へ'}
      </Button>
    </Box>
  );
};
