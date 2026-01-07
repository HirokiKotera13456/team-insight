import { AxisScores } from '@/types';
import { SCORE_THRESHOLDS } from '@/constants/scores';

const getComment = (axis: keyof AxisScores, score: number): string => {
  if (score <= SCORE_THRESHOLDS.LEFT) {
    // 左寄り
    switch (axis) {
      case 'energy':
        return '慎重に情報を集めてから動く傾向があります';
      case 'thinking':
        return '人の気持ちや雰囲気を重視して判断する傾向があります';
      case 'planning':
        return '状況に応じて柔軟に計画を変更する傾向があります';
      case 'vision':
        return '具体例や現実的な視点から考える傾向があります';
      default:
        return '';
    }
  } else if (score <= SCORE_THRESHOLDS.MIDDLE_RIGHT) {
    // バランス
    switch (axis) {
      case 'energy':
        return '状況に応じて慎重さとスピードを切り替えます';
      case 'thinking':
        return '感情と論理のバランスを取って判断します';
      case 'planning':
        return '計画と柔軟性のバランスを保ちます';
      case 'vision':
        return '具体と抽象の両方の視点を持っています';
      default:
        return '';
    }
  } else {
    // 右寄り
    switch (axis) {
      case 'energy':
        return 'まず動いて調整する傾向があります';
      case 'thinking':
        return '論理・事実・データを重視して判断する傾向があります';
      case 'planning':
        return '計画を立ててそれに沿って進める傾向があります';
      case 'vision':
        return '抽象概念や長期的な視点から考える傾向があります';
      default:
        return '';
    }
  }
};

export const getAxisComments = (scores: AxisScores): Record<keyof AxisScores, string> => {
  return {
    energy: getComment('energy', scores.energy),
    thinking: getComment('thinking', scores.thinking),
    planning: getComment('planning', scores.planning),
    vision: getComment('vision', scores.vision),
  };
};

export const getAxisLabel = (axis: keyof AxisScores): { left: string; right: string } => {
  switch (axis) {
    case 'energy':
      return { left: '慎重', right: '即行動' };
    case 'thinking':
      return { left: '共感', right: '論理' };
    case 'planning':
      return { left: '柔軟', right: '計画' };
    case 'vision':
      return { left: '具体', right: '抽象' };
  }
};

export const getAxisName = (axis: keyof AxisScores): string => {
  switch (axis) {
    case 'energy':
      return '行動エネルギー';
    case 'thinking':
      return '判断基準';
    case 'planning':
      return '進め方';
    case 'vision':
      return '視点';
  }
};
