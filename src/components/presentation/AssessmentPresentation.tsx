import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { FocusLayout } from '@/components/layout/FocusLayout';
import { Question } from '@/types';
import { ProgressHeader } from '@/components/diagnosis/ProgressHeader';
import { QuestionCard } from '@/components/diagnosis/QuestionCard';
import { StepFooter } from '@/components/diagnosis/StepFooter';

export interface AssessmentPresentationProps {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  axisName: string;
  value: number;
  saving: boolean;
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' };
  onSliderChange: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onCloseSnackbar: () => void;
}

export const AssessmentPresentation: React.FC<AssessmentPresentationProps> = ({
  currentIndex,
  totalQuestions,
  currentQuestion,
  axisName,
  value,
  saving,
  snackbar,
  onSliderChange,
  onPrevious,
  onNext,
  onCloseSnackbar,
}) => {
  return (
    <FocusLayout>
      <ProgressHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        axisName={axisName}
      />

      <QuestionCard
        question={currentQuestion}
        value={value}
        onChange={onSliderChange}
        axisName={axisName}
      />

      <StepFooter
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        onPrevious={onPrevious}
        onNext={onNext}
        isSaving={saving}
        canProceed={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={onCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FocusLayout>
  );
};
