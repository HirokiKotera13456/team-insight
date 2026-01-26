import {
  getOverallSummary,
  getAxisTendencyLabel,
  getAxisWorkExample,
} from '../summary';
import { AxisScores } from '@/types';
import { SCORE_THRESHOLDS } from '@/constants/scores';

describe('summary', () => {
  describe('getOverallSummary', () => {
    it('should return balance summary when balanceCount >= 3', () => {
      const scores: AxisScores = {
        energy: 50,
        thinking: 50,
        planning: 50,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('バランスよく判断するタイプ');
    });

    it('should return left-leaning summary when leftCount >= 2', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.LEFT,
        thinking: SCORE_THRESHOLDS.LEFT,
        planning: 50,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('慎重');
    });

    it('should return specific left-leaning summary for energy and planning left', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.LEFT,
        thinking: 50,
        planning: SCORE_THRESHOLDS.LEFT,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('慎重に情報を集め');
      expect(summary).toContain('柔軟に計画を調整');
    });

    it('should return right-leaning summary when rightCount >= 2', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.RIGHT,
        thinking: SCORE_THRESHOLDS.RIGHT,
        planning: 50,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('論理的');
    });

    it('should return specific right-leaning summary for energy and planning right', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.RIGHT,
        thinking: 50,
        planning: SCORE_THRESHOLDS.RIGHT,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('まず動いて調整し');
      expect(summary).toContain('計画を立てて進める');
    });

    it('should return balance summary for average score between 40 and 60', () => {
      const scores: AxisScores = {
        energy: 45,
        thinking: 55,
        planning: 50,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toContain('バランスよく判断するタイプ');
    });

    it('should return default summary for other cases', () => {
      const scores: AxisScores = {
        energy: 30,
        thinking: 70,
        planning: 50,
        vision: 50,
      };

      const summary = getOverallSummary(scores);
      expect(summary).toBeTruthy();
      expect(typeof summary).toBe('string');
    });
  });

  describe('getAxisTendencyLabel', () => {
    it('should return correct label for left range', () => {
      expect(getAxisTendencyLabel('energy', SCORE_THRESHOLDS.LEFT)).toBe('やや慎重');
      expect(getAxisTendencyLabel('thinking', SCORE_THRESHOLDS.LEFT)).toBe('やや共感重視');
      expect(getAxisTendencyLabel('planning', SCORE_THRESHOLDS.LEFT)).toBe('やや柔軟');
      expect(getAxisTendencyLabel('vision', SCORE_THRESHOLDS.LEFT)).toBe('やや具体重視');
    });

    it('should return correct label for middle range', () => {
      expect(getAxisTendencyLabel('energy', 50)).toBe('状況に応じて切り替える傾向');
      expect(getAxisTendencyLabel('thinking', 50)).toBe('周囲を見ながら判断する傾向');
      expect(getAxisTendencyLabel('planning', 50)).toBe('極端に寄らず調整するタイプ');
      expect(getAxisTendencyLabel('vision', 50)).toBe('具体と抽象を使い分ける傾向');
    });

    it('should return correct label for right range', () => {
      expect(getAxisTendencyLabel('energy', SCORE_THRESHOLDS.RIGHT + 1)).toBe('やや行動派');
      expect(getAxisTendencyLabel('thinking', SCORE_THRESHOLDS.RIGHT + 1)).toBe('やや論理重視');
      expect(getAxisTendencyLabel('planning', SCORE_THRESHOLDS.RIGHT + 1)).toBe('やや計画重視');
      expect(getAxisTendencyLabel('vision', SCORE_THRESHOLDS.RIGHT + 1)).toBe('やや抽象重視');
    });
  });

  describe('getAxisWorkExample', () => {
    it('should return correct example for left range', () => {
      expect(getAxisWorkExample('energy', SCORE_THRESHOLDS.LEFT)).toContain('全員の意見を聞いてから');
      expect(getAxisWorkExample('thinking', SCORE_THRESHOLDS.LEFT)).toContain('相手の反応を見ながら');
      expect(getAxisWorkExample('planning', SCORE_THRESHOLDS.LEFT)).toContain('影響範囲を確認してから');
      expect(getAxisWorkExample('vision', SCORE_THRESHOLDS.LEFT)).toContain('具体例を出してから');
    });

    it('should return correct example for middle range', () => {
      expect(getAxisWorkExample('energy', 50)).toContain('情報が揃いかけたタイミング');
      expect(getAxisWorkExample('thinking', 50)).toContain('納得感と根拠の両方');
      expect(getAxisWorkExample('planning', 50)).toContain('柔軟に変更する');
      expect(getAxisWorkExample('vision', 50)).toContain('具体例と抽象概念');
    });

    it('should return correct example for right range', () => {
      expect(getAxisWorkExample('energy', SCORE_THRESHOLDS.RIGHT + 1)).toContain('60%程度情報が揃った時点');
      expect(getAxisWorkExample('thinking', SCORE_THRESHOLDS.RIGHT + 1)).toContain('事実と論点を優先');
      expect(getAxisWorkExample('planning', SCORE_THRESHOLDS.RIGHT + 1)).toContain('計画を最初に固めて');
      expect(getAxisWorkExample('vision', SCORE_THRESHOLDS.RIGHT + 1)).toContain('目的や原則から');
    });
  });
});
