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
        mt: 5,
        gap: 2,
        pt: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={onPrevious}
        disabled={isFirst}
        sx={{ minWidth: 140 }}
      >
        前の質問
      </Button>

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={onNext}
        disabled={!canProceed || isSaving}
        sx={{ minWidth: 120 }}
      >
        {isLast ? '保存して結果へ' : '次へ'}
      </Button>
    </Box>
  );
};
