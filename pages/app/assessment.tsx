import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { FocusLayout } from '@/components/layout/FocusLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { questions } from '@/data/questions';
import { getAxisName } from '@/utils/comments';
import { ProgressHeader } from '@/components/diagnosis/ProgressHeader';
import { QuestionCard } from '@/components/diagnosis/QuestionCard';
import { StepFooter } from '@/components/diagnosis/StepFooter';

const Assessment: React.FC = () => {
  const { user } = useAuth();
  const {
    currentIndex,
    answers,
    saving,
    snackbar,
    setCurrentIndex,
    handleSliderChange,
    handleNext,
    handlePrevious,
    closeSnackbar,
  } = useAssessment(user?.uid);

  const currentQuestion = questions[currentIndex];
  const currentAxisName = getAxisName(currentQuestion.axis);

  return (
    <ProtectedRoute allowGuest>
      <FocusLayout>
        <ProgressHeader
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          axisName={currentAxisName}
        />

        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={value => handleSliderChange(currentQuestion.id, value)}
          axisName={currentAxisName}
        />

        <StepFooter
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={saving}
          canProceed={true}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </FocusLayout>
    </ProtectedRoute>
  );
};

export default Assessment;
