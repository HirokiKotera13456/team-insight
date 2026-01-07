import { SCORE_THRESHOLDS, getScoreRange, getTendency } from '../scores';

describe('scores', () => {
  describe('SCORE_THRESHOLDS', () => {
    it('should have correct threshold values', () => {
      expect(SCORE_THRESHOLDS.LEFT).toBe(33);
      expect(SCORE_THRESHOLDS.LEFT_MIDDLE).toBe(40);
      expect(SCORE_THRESHOLDS.MIDDLE_RIGHT).toBe(60);
      expect(SCORE_THRESHOLDS.RIGHT).toBe(67);
    });
  });

  describe('getScoreRange', () => {
    it('should return "left" for scores <= LEFT threshold', () => {
      expect(getScoreRange(0)).toBe('left');
      expect(getScoreRange(33)).toBe('left');
      expect(getScoreRange(20)).toBe('left');
    });

    it('should return "leftMiddle" for scores between LEFT and LEFT_MIDDLE', () => {
      expect(getScoreRange(34)).toBe('leftMiddle');
      expect(getScoreRange(40)).toBe('leftMiddle');
      expect(getScoreRange(37)).toBe('leftMiddle');
    });

    it('should return "middle" for scores between LEFT_MIDDLE and MIDDLE_RIGHT', () => {
      expect(getScoreRange(41)).toBe('middle');
      expect(getScoreRange(60)).toBe('middle');
      expect(getScoreRange(50)).toBe('middle');
    });

    it('should return "rightMiddle" for scores between MIDDLE_RIGHT and RIGHT', () => {
      expect(getScoreRange(61)).toBe('rightMiddle');
      expect(getScoreRange(67)).toBe('rightMiddle');
      expect(getScoreRange(65)).toBe('rightMiddle');
    });

    it('should return "right" for scores > RIGHT threshold', () => {
      expect(getScoreRange(68)).toBe('right');
      expect(getScoreRange(100)).toBe('right');
      expect(getScoreRange(80)).toBe('right');
    });
  });

  describe('getTendency', () => {
    it('should return "left" for scores <= LEFT threshold', () => {
      expect(getTendency(0)).toBe('left');
      expect(getTendency(33)).toBe('left');
      expect(getTendency(20)).toBe('left');
    });

    it('should return "balance" for scores between LEFT and RIGHT thresholds', () => {
      expect(getTendency(34)).toBe('balance');
      expect(getTendency(50)).toBe('balance');
      expect(getTendency(66)).toBe('balance');
    });

    it('should return "right" for scores >= RIGHT threshold', () => {
      expect(getTendency(67)).toBe('right');
      expect(getTendency(100)).toBe('right');
      expect(getTendency(80)).toBe('right');
    });
  });
});
