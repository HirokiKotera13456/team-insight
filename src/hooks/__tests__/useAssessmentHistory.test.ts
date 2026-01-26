import { renderHook, waitFor, act } from '@testing-library/react';
import { useAssessmentHistory } from '../useAssessmentHistory';
import { getAssessmentHistory } from '@/lib/firestore';
import { AssessmentHistory } from '@/types';

// Mock dependencies
jest.mock('@/lib/firestore', () => ({
  getAssessmentHistory: jest.fn(),
}));

describe('useAssessmentHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    (getAssessmentHistory as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useAssessmentHistory('test-uid'));

    expect(result.current.loading).toBe(true);
    expect(result.current.history).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should load history successfully', async () => {
    const mockHistory: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: { toMillis: () => Date.now() } as any,
      },
      {
        id: 'history-2',
        energy: 55,
        thinking: 65,
        planning: 45,
        vision: 75,
        answeredAt: { toMillis: () => Date.now() - 86400000 } as any,
      },
    ];

    (getAssessmentHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { result } = renderHook(() => useAssessmentHistory('test-uid'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when loading history fails', async () => {
    const error = new Error('Failed to fetch');
    (getAssessmentHistory as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useAssessmentHistory('test-uid'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch');
  });

  it('should not load history when uid is undefined', async () => {
    const { result } = renderHook(() => useAssessmentHistory(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAssessmentHistory).not.toHaveBeenCalled();
    expect(result.current.history).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should use custom limitCount', async () => {
    const mockHistory: AssessmentHistory[] = [];
    (getAssessmentHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { result } = renderHook(() => useAssessmentHistory('test-uid', 10));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAssessmentHistory).toHaveBeenCalledWith('test-uid', 10);
  });

  it('should refetch history when refetch is called', async () => {
    const mockHistory1: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: { toMillis: () => Date.now() } as any,
      },
    ];

    const mockHistory2: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: { toMillis: () => Date.now() } as any,
      },
      {
        id: 'history-2',
        energy: 55,
        thinking: 65,
        planning: 45,
        vision: 75,
        answeredAt: { toMillis: () => Date.now() - 86400000 } as any,
      },
    ];

    (getAssessmentHistory as jest.Mock)
      .mockResolvedValueOnce(mockHistory1)
      .mockResolvedValueOnce(mockHistory2);

    const { result } = renderHook(() => useAssessmentHistory('test-uid'));

    await waitFor(() => {
      expect(result.current.history).toEqual(mockHistory1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.history).toEqual(mockHistory2);
    });
  });

  it('should handle error during refetch', async () => {
    const mockHistory: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: { toMillis: () => Date.now() } as any,
      },
    ];

    (getAssessmentHistory as jest.Mock)
      .mockResolvedValueOnce(mockHistory)
      .mockRejectedValueOnce(new Error('Refetch failed'));

    const { result } = renderHook(() => useAssessmentHistory('test-uid'));

    await waitFor(() => {
      expect(result.current.history).toEqual(mockHistory);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Refetch failed');
    });
  });

  it('should reload when uid changes', async () => {
    const mockHistory: AssessmentHistory[] = [];
    (getAssessmentHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { result, rerender } = renderHook(
      ({ uid }) => useAssessmentHistory(uid),
      {
        initialProps: { uid: 'test-uid-1' },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAssessmentHistory).toHaveBeenCalledWith('test-uid-1', 50);

    rerender({ uid: 'test-uid-2' });

    await waitFor(() => {
      expect(getAssessmentHistory).toHaveBeenCalledWith('test-uid-2', 50);
    });
  });

  it('should reload when limitCount changes', async () => {
    const mockHistory: AssessmentHistory[] = [];
    (getAssessmentHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { result, rerender } = renderHook(
      ({ uid, limitCount }) => useAssessmentHistory(uid, limitCount),
      {
        initialProps: { uid: 'test-uid', limitCount: 50 },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAssessmentHistory).toHaveBeenCalledWith('test-uid', 50);

    rerender({ uid: 'test-uid', limitCount: 100 });

    await waitFor(() => {
      expect(getAssessmentHistory).toHaveBeenCalledWith('test-uid', 100);
    });
  });
});
