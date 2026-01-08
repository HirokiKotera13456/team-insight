import { AxisScores } from '@/types';
import { SCORE_THRESHOLDS } from '@/constants/scores';

const getComment = (axis: keyof AxisScores, score: number): string => {
  if (score <= SCORE_THRESHOLDS.LEFT) {
    // 左寄り
    switch (axis) {
      case 'energy':
        return '情報が揃ってから動くほうが安心するタイプ。じっくり考えてから決めたい。';
      case 'thinking':
        return '相手の気持ちや場の雰囲気を大事にするタイプ。まわりへの配慮を忘れない。';
      case 'planning':
        return '状況に合わせて柔軟に動くタイプ。決めすぎないほうがうまくいく。';
      case 'vision':
        return '具体的な話から入るほうが考えやすいタイプ。現実的な視点を大切にする。';
      default:
        return '';
    }
  } else if (score <= SCORE_THRESHOLDS.MIDDLE_RIGHT) {
    // バランス
    switch (axis) {
      case 'energy':
        return '状況を見てスピードを調整するタイプ。急ぐときは急ぐ、慎重なときは慎重に。';
      case 'thinking':
        return '感情と論理、両方を見て判断するタイプ。バランス感覚がある。';
      case 'planning':
        return '計画は立てつつ、必要なら柔軟に変えるタイプ。ガチガチには決めない。';
      case 'vision':
        return '具体と抽象、どちらの視点も使えるタイプ。話の粒度を調整できる。';
      default:
        return '';
    }
  } else {
    // 右寄り
    switch (axis) {
      case 'energy':
        return 'まず動いてから考えるタイプ。走りながら調整するほうが性に合う。';
      case 'thinking':
        return 'データや論理で判断するタイプ。感情より事実を優先したい。';
      case 'planning':
        return '計画を立ててから進めたいタイプ。段取りがあると安心する。';
      case 'vision':
        return '大きな絵や目的から入るタイプ。全体像を押さえてから細部に行きたい。';
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
