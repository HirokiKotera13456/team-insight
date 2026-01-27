import { useState, useEffect } from 'react';
import { getLatestAxisScores } from '@/lib/firestore';
import { AxisScores } from '@/types';

interface UseAxisScoresResult {
  scores: AxisScores | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAxisScores = (uid: string | undefined): UseAxisScoresResult => {
  const [scores, setScores] = useState<AxisScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScores = async () => {
    if (!uid) {
      // ログインしていない場合はローカルストレージから読み込む
      try {
        setLoading(true);
        setError(null);
        const guestScores = localStorage.getItem('guest_assessment_scores');
        if (guestScores) {
          setScores(JSON.parse(guestScores));
        } else {
          setScores(null);
        }
      } catch (err) {
        console.error('ローカルストレージ読み込みエラー:', err);
        setScores(null);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const latestScores = await getLatestAxisScores(uid);
      setScores(latestScores);
    } catch (err) {
      console.error('スコア取得エラー:', err);
      setError('スコアの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, [uid]);

  return {
    scores,
    loading,
    error,
    refetch: loadScores,
  };
};
