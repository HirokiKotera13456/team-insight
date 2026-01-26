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

      expect(comments.energy).toBe('情報が揃ってから動くほうが安心するタイプ。じっくり考えてから決めたい。');
      expect(comments.thinking).toBe('相手の気持ちや場の雰囲気を大事にするタイプ。まわりへの配慮を忘れない。');
      expect(comments.planning).toBe('状況に合わせて柔軟に動くタイプ。決めすぎないほうがうまくいく。');
      expect(comments.vision).toBe('具体的な話から入るほうが考えやすいタイプ。現実的な視点を大切にする。');
    });

    it('should return balance comments for scores between LEFT and MIDDLE_RIGHT', () => {
      const scores: AxisScores = {
        energy: 50,
        thinking: 50,
        planning: 50,
        vision: 50,
      };

      const comments = getAxisComments(scores);

      expect(comments.energy).toBe('状況を見てスピードを調整するタイプ。急ぐときは急ぐ、慎重なときは慎重に。');
      expect(comments.thinking).toBe('感情と論理、両方を見て判断するタイプ。バランス感覚がある。');
      expect(comments.planning).toBe('計画は立てつつ、必要なら柔軟に変えるタイプ。ガチガチには決めない。');
      expect(comments.vision).toBe('具体と抽象、どちらの視点も使えるタイプ。話の粒度を調整できる。');
    });

    it('should return right-leaning comments for scores > MIDDLE_RIGHT', () => {
      const scores: AxisScores = {
        energy: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        thinking: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        planning: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        vision: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
      };

      const comments = getAxisComments(scores);

      expect(comments.energy).toBe('まず動いてから考えるタイプ。走りながら調整するほうが性に合う。');
      expect(comments.thinking).toBe('データや論理で判断するタイプ。感情より事実を優先したい。');
      expect(comments.planning).toBe('計画を立ててから進めたいタイプ。段取りがあると安心する。');
      expect(comments.vision).toBe('大きな絵や目的から入るタイプ。全体像を押さえてから細部に行きたい。');
    });

    it('should handle boundary values correctly', () => {
      const scores1: AxisScores = {
        energy: SCORE_THRESHOLDS.LEFT + 1,
        thinking: SCORE_THRESHOLDS.MIDDLE_RIGHT,
        planning: SCORE_THRESHOLDS.MIDDLE_RIGHT + 1,
        vision: 100,
      };

      const comments = getAxisComments(scores1);

      expect(comments.energy).toBe('状況を見てスピードを調整するタイプ。急ぐときは急ぐ、慎重なときは慎重に。');
      expect(comments.thinking).toBe('感情と論理、両方を見て判断するタイプ。バランス感覚がある。');
      expect(comments.planning).toBe('計画を立ててから進めたいタイプ。段取りがあると安心する。');
      expect(comments.vision).toBe('大きな絵や目的から入るタイプ。全体像を押さえてから細部に行きたい。');
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
