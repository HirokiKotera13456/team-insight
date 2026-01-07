import { renderHook, waitFor, act } from '@testing-library/react';
import { useAxisScores } from '../useAxisScores';
import { getLatestAxisScores } from '@/lib/firestore';
import { AxisScores } from '@/types';

// Mock dependencies
jest.mock('@/lib/firestore', () => ({
  getLatestAxisScores: jest.fn(),
}));

describe('useAxisScores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    (getLatestAxisScores as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useAxisScores('test-uid'));

    expect(result.current.loading).toBe(true);
    expect(result.current.scores).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should load scores successfully', async () => {
    const mockScores: AxisScores = {
      energy: 50,
      thinking: 60,
      planning: 40,
      vision: 70,
    };

    (getLatestAxisScores as jest.Mock).mockResolvedValue(mockScores);

    const { result } = renderHook(() => useAxisScores('test-uid'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scores).toEqual(mockScores);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when loading scores fails', async () => {
    const error = new Error('Failed to fetch');
    (getLatestAxisScores as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useAxisScores('test-uid'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scores).toBe(null);
    expect(result.current.error).toBe('スコアの取得に失敗しました');
  });

  it('should return null scores when no data exists', async () => {
    (getLatestAxisScores as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAxisScores('test-uid'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scores).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should not load scores when uid is undefined', async () => {
    const { result } = renderHook(() => useAxisScores(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getLatestAxisScores).not.toHaveBeenCalled();
    expect(result.current.scores).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should refetch scores when refetch is called', async () => {
    const mockScores1: AxisScores = {
      energy: 50,
      thinking: 60,
      planning: 40,
      vision: 70,
    };

    const mockScores2: AxisScores = {
      energy: 60,
      thinking: 70,
      planning: 50,
      vision: 80,
    };

    (getLatestAxisScores as jest.Mock)
      .mockResolvedValueOnce(mockScores1)
      .mockResolvedValueOnce(mockScores2);

    const { result } = renderHook(() => useAxisScores('test-uid'));

    await waitFor(() => {
      expect(result.current.scores).toEqual(mockScores1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.scores).toEqual(mockScores2);
    });
  });

  it('should handle error during refetch', async () => {
    const mockScores: AxisScores = {
      energy: 50,
      thinking: 60,
      planning: 40,
      vision: 70,
    };

    (getLatestAxisScores as jest.Mock)
      .mockResolvedValueOnce(mockScores)
      .mockRejectedValueOnce(new Error('Refetch failed'));

    const { result } = renderHook(() => useAxisScores('test-uid'));

    await waitFor(() => {
      expect(result.current.scores).toEqual(mockScores);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('スコアの取得に失敗しました');
    });
  });
});
