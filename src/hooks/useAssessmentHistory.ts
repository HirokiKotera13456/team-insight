import { useState, useEffect } from 'react';
import { getAssessmentHistory } from '@/lib/firestore';
import { AssessmentHistory } from '@/types';

interface UseAssessmentHistoryResult {
  history: AssessmentHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAssessmentHistory = (
  uid: string | undefined,
  limitCount: number = 50
): UseAssessmentHistoryResult => {
  const [history, setHistory] = useState<AssessmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const historyData = await getAssessmentHistory(uid, limitCount);
      setHistory(historyData);
    } catch (err: any) {
      console.error('履歴取得エラー:', err);
      setError(err.message || '履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [uid, limitCount]);

  return {
    history,
    loading,
    error,
    refetch: loadHistory,
  };
};
