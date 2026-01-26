// スコア範囲の定数
export const SCORE_THRESHOLDS = {
  LEFT: 33,
  LEFT_MIDDLE: 40,
  MIDDLE_RIGHT: 60,
  RIGHT: 67,
} as const;

// スコア範囲の判定
export const getScoreRange = (score: number): 'left' | 'leftMiddle' | 'middle' | 'rightMiddle' | 'right' => {
  if (score <= SCORE_THRESHOLDS.LEFT) {
    return 'left';
  } else if (score <= SCORE_THRESHOLDS.LEFT_MIDDLE) {
    return 'leftMiddle';
  } else if (score <= SCORE_THRESHOLDS.MIDDLE_RIGHT) {
    return 'middle';
  } else if (score <= SCORE_THRESHOLDS.RIGHT) {
    return 'rightMiddle';
  } else {
    return 'right';
  }
};

// 傾向判定（内部用）
export const getTendency = (score: number): 'left' | 'balance' | 'right' => {
  if (score <= SCORE_THRESHOLDS.LEFT) {
    return 'left';
  } else if (score >= SCORE_THRESHOLDS.RIGHT) {
    return 'right';
  } else {
    return 'balance';
  }
};
