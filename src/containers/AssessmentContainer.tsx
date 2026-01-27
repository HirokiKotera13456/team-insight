import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { questions } from '@/data/questions';
import { getAxisName } from '@/utils/comments';
import { AssessmentPresentation } from '@/components/presentation/AssessmentPresentation';

export const AssessmentContainer: React.FC = () => {
  const { user } = useAuth();
  const {
    currentIndex,
    answers,
    saving,
    snackbar,
    handleSliderChange,
    handleNext,
    handlePrevious,
    closeSnackbar,
  } = useAssessment(user?.uid);

  const currentQuestion = questions[currentIndex];
  const currentAxisName = getAxisName(currentQuestion.axis);

  return (
    <ProtectedRoute allowGuest>
      <AssessmentPresentation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        axisName={currentAxisName}
        value={answers[currentQuestion.id]}
        saving={saving}
        snackbar={snackbar}
        onSliderChange={(value) => handleSliderChange(currentQuestion.id, value)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCloseSnackbar={closeSnackbar}
      />
    </ProtectedRoute>
  );
};
