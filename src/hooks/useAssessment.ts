import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { saveAxisScores } from '@/lib/firestore';
import { questions } from '@/data/questions';
import { AxisScores, AxisType } from '@/types';

interface UseAssessmentResult {
  currentIndex: number;
  answers: Record<string, number>;
  saving: boolean;
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  setCurrentIndex: (index: number) => void;
  handleSliderChange: (questionId: string, value: number) => void;
  handleSave: (navigateToResult?: boolean) => Promise<void>;
  handleNext: () => void;
  handlePrevious: () => void;
  closeSnackbar: () => void;
}

export const useAssessment = (uid: string | undefined): UseAssessmentResult => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(
    questions.reduce((acc, q) => {
      acc[q.id] = 50;
      return acc;
    }, {} as Record<string, number>)
  );
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const calculateScores = useCallback((): AxisScores => {
    const axisSums: Record<AxisType, number[]> = {
      energy: [],
      thinking: [],
      planning: [],
      vision: [],
    };

    questions.forEach((q) => {
      const answer = answers[q.id];
      axisSums[q.axis].push(answer);
    });

    return {
      energy: Math.round(
        axisSums.energy.reduce((sum, val) => sum + val, 0) / axisSums.energy.length
      ),
      thinking: Math.round(
        axisSums.thinking.reduce((sum, val) => sum + val, 0) / axisSums.thinking.length
      ),
      planning: Math.round(
        axisSums.planning.reduce((sum, val) => sum + val, 0) / axisSums.planning.length
      ),
      vision: Math.round(
        axisSums.vision.reduce((sum, val) => sum + val, 0) / axisSums.vision.length
      ),
    };
  }, [answers]);

  const handleSave = useCallback(async (navigateToResult = false) => {
    try {
      setSaving(true);
      const scores = calculateScores();
      
      if (uid) {
        // ログインしている場合は保存
        await saveAxisScores(uid, scores);
        setSnackbar({
          open: true,
          message: '診断結果を保存しました',
          severity: 'success',
        });
      } else {
        // ログインしていない場合は保存せず、ローカルストレージに一時保存
        localStorage.setItem('guest_assessment_scores', JSON.stringify(scores));
        setSnackbar({
          open: true,
          message: '診断が完了しました（データは保存されていません）',
          severity: 'info',
        });
      }
      
      if (navigateToResult) {
        setTimeout(() => {
          router.push('/app/result');
        }, 1500);
      }
    } catch (error: any) {
      console.error('保存エラー:', error);
      const errorMessage = error?.message || '保存に失敗しました。もう一度お試しください。';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [uid, calculateScores, router]);

  const handleSliderChange = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSave(true);
    }
  }, [currentIndex, handleSave]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    currentIndex,
    answers,
    saving,
    snackbar,
    setCurrentIndex,
    handleSliderChange,
    handleSave,
    handleNext,
    handlePrevious,
    closeSnackbar,
  };
};
