import { getAxisComments, getAxisLabel, getAxisName } from '../comments';
import { AxisScores } from '@/types';
import { SCORE_THRESHOLDS } from '@/constants/scores';

describe('comments', () => {
  describe('getAxisComments', () => {
    it('should return left-leaning comments for scores <= LEFT threshold', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.LEFT,
        thinking: SCORE_THRESHOLDS.LEFT,
        planning: SCORE_THRESHOLDS.LEFT,
        vision: SCORE_THRESHOLDS.LEFT,
      };

      const comments = getAxisComments(scores);

      expect(comments.energy).toBe('慎重に情報を集めてから動く傾向があります');
      expect(comments.thinking).toBe('人の気持ちや雰囲気を重視して判断する傾向があります');
      expect(comments.planning).toBe('状況に応じて柔軟に計画を変更する傾向があります');
      expect(comments.vision).toBe('具体例や現実的な視点から考える傾向があります');
    });

    it('should return balance comments for scores between LEFT and MIDDLE_RIGHT', () => {
      const scores: AxisScores = {
        energy: 50,
        thinking: 50,
        planning: 50,
        vision: 50,
      };

      const comments = getAxisComments(scores);

      expect(comments.energy).toBe('状況に応じて慎重さとスピードを切り替えます');
      expect(comments.thinking).toBe('感情と論理のバランスを取って判断します');
      expect(comments.planning).toBe('計画と柔軟性のバランスを保ちます');
      expect(comments.vision).toBe('具体と抽象の両方の視点を持っています');
    });

    it('should return right-leaning comments for scores > MIDDLE_RIGHT', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        thinking: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        planning: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        vision: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
      };

      const comments = getAxisComments(scores);

      expect(comments.energy).toBe('まず動いて調整する傾向があります');
      expect(comments.thinking).toBe('論理・事実・データを重視して判断する傾向があります');
      expect(comments.planning).toBe('計画を立ててそれに沿って進める傾向があります');
      expect(comments.vision).toBe('抽象概念や長期的な視点から考える傾向があります');
    });

    it('should handle boundary values correctly', () => {
      const scores1: AxisScores = {
        energy: SCORE_THRESHOLDS.LEFT + 1,
        thinking: SCORE_THRESHOLDS.MIDDLE_RIGHT,
        planning: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        vision: 100,
      };

      const comments = getAxisComments(scores1);

      expect(comments.energy).toBe('状況に応じて慎重さとスピードを切り替えます');
      expect(comments.thinking).toBe('感情と論理のバランスを取って判断します');
      expect(comments.planning).toBe('計画を立ててそれに沿って進める傾向があります');
      expect(comments.vision).toBe('抽象概念や長期的な視点から考える傾向があります');
    });
  });

  describe('getAxisLabel', () => {
    it('should return correct labels for energy axis', () => {
      const label = getAxisLabel('energy');
      expect(label.left).toBe('慎重');
      expect(label.right).toBe('即行動');
    });

    it('should return correct labels for thinking axis', () => {
      const label = getAxisLabel('thinking');
      expect(label.left).toBe('共感');
      expect(label.right).toBe('論理');
    });

    it('should return correct labels for planning axis', () => {
      const label = getAxisLabel('planning');
      expect(label.left).toBe('柔軟');
      expect(label.right).toBe('計画');
    });

    it('should return correct labels for vision axis', () => {
      const label = getAxisLabel('vision');
      expect(label.left).toBe('具体');
      expect(label.right).toBe('抽象');
    });
  });

  describe('getAxisName', () => {
    it('should return correct name for energy axis', () => {
      expect(getAxisName('energy')).toBe('行動エネルギー');
    });

    it('should return correct name for thinking axis', () => {
      expect(getAxisName('thinking')).toBe('判断基準');
    });

    it('should return correct name for planning axis', () => {
      expect(getAxisName('planning')).toBe('進め方');
    });

    it('should return correct name for vision axis', () => {
      expect(getAxisName('vision')).toBe('視点');
    });
  });
});
