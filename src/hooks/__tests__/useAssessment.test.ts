import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAssessment } from '../useAssessment';
import { saveAxisScores } from '@/lib/firestore';
import { questions } from '@/data/questions';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/firestore', () => ({
  saveAxisScores: jest.fn(),
}));

describe('useAssessment', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (saveAxisScores as jest.Mock).mockResolvedValue(undefined);
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    // Mock setTimeout/clearTimeout for navigation delay
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.answers).toEqual(
      questions.reduce((acc, q) => {
        acc[q.id] = 50;
        return acc;
      }, {} as Record<string, number>)
    );
    expect(result.current.saving).toBe(false);
    expect(result.current.snackbar.open).toBe(false);
  });

  it('should update currentIndex when setCurrentIndex is called', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.setCurrentIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it('should update answers when handleSliderChange is called', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.handleSliderChange('energy_1', 75);
    });

    expect(result.current.answers['energy_1']).toBe(75);
  });

  it('should move to next question when handleNext is called', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should move to previous question when handlePrevious is called', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.setCurrentIndex(2);
    });

    act(() => {
      result.current.handlePrevious();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should not move to previous question when already at first question', () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.handlePrevious();
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('should save and navigate to result when handleNext is called on last question', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.setCurrentIndex(questions.length - 1);
    });

    await act(async () => {
      result.current.handleNext();
    });

    await waitFor(() => {
      expect(saveAxisScores).toHaveBeenCalledWith('test-uid', expect.any(Object));
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/app/result');
    });
  });

  it('should save scores when handleSave is called', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      result.current.handleSliderChange('energy_1', 80);
      result.current.handleSliderChange('thinking_1', 60);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(saveAxisScores).toHaveBeenCalledWith('test-uid', expect.objectContaining({
      energy: expect.any(Number),
      thinking: expect.any(Number),
      planning: expect.any(Number),
      vision: expect.any(Number),
    }));
  });

  it('should show success snackbar after successful save', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    await act(async () => {
      await result.current.handleSave();
    });

    await waitFor(() => {
      expect(result.current.snackbar.open).toBe(true);
      expect(result.current.snackbar.message).toBe('診断結果を保存しました');
      expect(result.current.snackbar.severity).toBe('success');
    });
  });

  it('should show error snackbar when save fails', async () => {
    const errorMessage = '保存エラー';
    (saveAxisScores as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAssessment('test-uid'));

    await act(async () => {
      await result.current.handleSave();
    });

    await waitFor(() => {
      expect(result.current.snackbar.open).toBe(true);
      expect(result.current.snackbar.severity).toBe('error');
    });
  });

  it('should navigate to result when handleSave is called with navigateToResult=true', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    await act(async () => {
      await result.current.handleSave(true);
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/app/result');
    });
  });

  it('should not save when uid is undefined', async () => {
    const { result } = renderHook(() => useAssessment(undefined));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(saveAxisScores).not.toHaveBeenCalled();
  });

  it('should close snackbar when closeSnackbar is called', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    await act(async () => {
      await result.current.handleSave();
    });

    await waitFor(() => {
      expect(result.current.snackbar.open).toBe(true);
    });

    act(() => {
      result.current.closeSnackbar();
    });

    expect(result.current.snackbar.open).toBe(false);
  });

  it('should calculate scores correctly', async () => {
    const { result } = renderHook(() => useAssessment('test-uid'));

    act(() => {
      // Set all energy questions to 80
      questions.filter(q => q.axis === 'energy').forEach(q => {
        result.current.handleSliderChange(q.id, 80);
      });
      // Set all thinking questions to 20
      questions.filter(q => q.axis === 'thinking').forEach(q => {
        result.current.handleSliderChange(q.id, 20);
      });
    });

    await act(async () => {
      await result.current.handleSave();
    });

    await waitFor(() => {
      expect(saveAxisScores).toHaveBeenCalled();
      const callArgs = (saveAxisScores as jest.Mock).mock.calls[0];
      expect(callArgs[1].energy).toBe(80);
      expect(callArgs[1].thinking).toBe(20);
    });
  });
});
