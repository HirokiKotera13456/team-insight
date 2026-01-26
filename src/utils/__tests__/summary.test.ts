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
      expect(summary).toContain('情報を集めてから動き');
      expect(summary).toContain('柔軟に調整する');
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
      expect(summary).toContain('まず動いてから調整し');
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
      expect(getAxisTendencyLabel('energy', SCORE_THRESHOLDS.LEFT)).toBe('石橋を叩いてから渡る派');
      expect(getAxisTendencyLabel('thinking', SCORE_THRESHOLDS.LEFT)).toBe('人の気持ちを大事にする派');
      expect(getAxisTendencyLabel('planning', SCORE_THRESHOLDS.LEFT)).toBe('臨機応変に対応する派');
      expect(getAxisTendencyLabel('vision', SCORE_THRESHOLDS.LEFT)).toBe('具体例から入る派');
    });

    it('should return correct label for middle range', () => {
      expect(getAxisTendencyLabel('energy', 50)).toBe('状況を見て切り替える派');
      expect(getAxisTendencyLabel('thinking', 50)).toBe('バランスを見て判断する派');
      expect(getAxisTendencyLabel('planning', 50)).toBe('計画と柔軟さを両立する派');
      expect(getAxisTendencyLabel('vision', 50)).toBe('具体と抽象を行き来する派');
    });

    it('should return correct label for right range', () => {
      expect(getAxisTendencyLabel('energy', SCORE_THRESHOLDS.RIGHT + 1)).toBe('まず動いてみる派');
      expect(getAxisTendencyLabel('thinking', SCORE_THRESHOLDS.RIGHT + 1)).toBe('データと論理で決める派');
      expect(getAxisTendencyLabel('planning', SCORE_THRESHOLDS.RIGHT + 1)).toBe('計画をしっかり立てる派');
      expect(getAxisTendencyLabel('vision', SCORE_THRESHOLDS.RIGHT + 1)).toBe('大きな絵から入る派');
    });
  });

  describe('getAxisWorkExample', () => {
    it('should return correct example for left range', () => {
      expect(getAxisWorkExample('energy', SCORE_THRESHOLDS.LEFT)).toContain('全員の意見を聞いてから');
      expect(getAxisWorkExample('thinking', SCORE_THRESHOLDS.LEFT)).toContain('相手の反応を見ながら');
      expect(getAxisWorkExample('planning', SCORE_THRESHOLDS.LEFT)).toContain('影響範囲を確認してから');
      expect(getAxisWorkExample('vision', SCORE_THRESHOLDS.LEFT)).toContain('具体例から入る');
    });

    it('should return correct example for middle range', () => {
      expect(getAxisWorkExample('energy', 50)).toContain('情報がある程度揃ったら');
      expect(getAxisWorkExample('thinking', 50)).toContain('納得感と根拠の両方');
      expect(getAxisWorkExample('planning', 50)).toContain('柔軟に変える');
      expect(getAxisWorkExample('vision', 50)).toContain('具体例と全体像');
    });

    it('should return correct example for right range', () => {
      expect(getAxisWorkExample('energy', SCORE_THRESHOLDS.RIGHT + 1)).toContain('6割くらい情報が揃ったら');
      expect(getAxisWorkExample('thinking', SCORE_THRESHOLDS.RIGHT + 1)).toContain('事実ベースでストレートに伝える');
      expect(getAxisWorkExample('planning', SCORE_THRESHOLDS.RIGHT + 1)).toContain('最初に計画を固めて');
      expect(getAxisWorkExample('vision', SCORE_THRESHOLDS.RIGHT + 1)).toContain('目的や全体像');
    });
  });
});
