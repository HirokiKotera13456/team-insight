import { AxisScores } from '@/types';
import { getTendency, getScoreRange } from '@/constants/scores';

export const getOverallSummary = (scores: AxisScores): string => {
  const avgScore = (scores.energy + scores.thinking + scores.planning + scores.vision) / 4;
  
  // 各軸の傾向を判定
  const tendencies = {
    energy: getTendency(scores.energy),
    thinking: getTendency(scores.thinking),
    planning: getTendency(scores.planning),
    vision: getTendency(scores.vision),
  };

  const balanceCount = Object.values(tendencies).filter(t => t === 'balance').length;
  const leftCount = Object.values(tendencies).filter(t => t === 'left').length;
  const rightCount = Object.values(tendencies).filter(t => t === 'right').length;

  // バランス型が優勢
  if (balanceCount >= 3) {
    return '全体的に、状況を見ながらバランスよく判断するタイプです。極端な判断は少なく、調整役として動く場面が多い傾向があります。';
  }

  // 左寄りが優勢
  if (leftCount >= 2) {
    if (tendencies.energy === 'left' && tendencies.planning === 'left') {
      return '慎重に情報を集め、柔軟に計画を調整しながら進めるタイプです。急ぎすぎず、リスクを見ながら進めることが多い傾向があります。';
    }
    return '慎重さと柔軟さを併せ持ち、極端に偏らない仕事の進め方です。周囲の状況を確認してから判断することが多い傾向があります。';
  }

  // 右寄りが優勢
  if (rightCount >= 2) {
    if (tendencies.energy === 'right' && tendencies.planning === 'right') {
      return 'まず動いて調整し、計画を立てて進めるタイプです。スピード感と計画性を両立させ、マイルストーンを切って管理することが多い傾向があります。';
    }
    return '論理的で計画的なアプローチを重視するタイプです。データや根拠に基づいて判断し、感情よりも事実を優先することが多い傾向があります。';
  }

  // 平均的な傾向
  if (avgScore >= 40 && avgScore <= 60) {
    return '全体的に、状況を見ながらバランスよく判断するタイプです。極端な判断は少なく、調整役として動く場面が多い傾向があります。';
  }

  return '慎重さと柔軟さを併せ持ち、極端に偏らない仕事の進め方です。周囲の状況を確認してから判断することが多い傾向があります。';
};

const getTendencyLabelByRange = (
  axis: keyof AxisScores,
  range: 'left' | 'leftMiddle' | 'middle' | 'rightMiddle' | 'right'
): string => {
  switch (range) {
    case 'left':
      switch (axis) {
        case 'energy':
          return 'やや慎重';
        case 'thinking':
          return 'やや共感重視';
        case 'planning':
          return 'やや柔軟';
        case 'vision':
          return 'やや具体重視';
      }
      break;
    case 'leftMiddle':
    case 'middle':
    case 'rightMiddle':
      switch (axis) {
        case 'energy':
          return '状況に応じて切り替える傾向';
        case 'thinking':
          return '周囲を見ながら判断する傾向';
        case 'planning':
          return '極端に寄らず調整するタイプ';
        case 'vision':
          return '具体と抽象を使い分ける傾向';
      }
      break;
    case 'right':
      switch (axis) {
        case 'energy':
          return 'やや行動派';
        case 'thinking':
          return 'やや論理重視';
        case 'planning':
          return 'やや計画重視';
        case 'vision':
          return 'やや抽象重視';
      }
      break;
  }
  return '';
};

export const getAxisTendencyLabel = (axis: keyof AxisScores, score: number): string => {
  const range = getScoreRange(score);
  return getTendencyLabelByRange(axis, range);
};

const getWorkExampleByRange = (
  axis: keyof AxisScores,
  range: 'left' | 'leftMiddle' | 'middle' | 'rightMiddle' | 'right'
): string => {
  switch (range) {
    case 'left':
      switch (axis) {
        case 'energy':
          return '会議では、全員の意見を聞いてから結論を出しやすい';
        case 'thinking':
          return 'フィードバックの際、相手の反応を見ながら伝え方を選ぶことが多い';
        case 'planning':
          return '仕様変更が入ったとき、影響範囲を確認してから動く傾向がある';
        case 'vision':
          return '議論では、具体例を出してから抽象的な話に移ることが多い';
      }
      break;
    case 'leftMiddle':
    case 'middle':
    case 'rightMiddle':
      switch (axis) {
        case 'energy':
          return '会議では、情報が揃いかけたタイミングで判断することが多い';
        case 'thinking':
          return '意見が割れたとき、納得感と根拠の両方を意識して調整する';
        case 'planning':
          return '計画を立てつつ、状況に応じて柔軟に変更する場面が多い';
        case 'vision':
          return '具体例と抽象概念を組み合わせて説明することが多い';
      }
      break;
    case 'right':
      switch (axis) {
        case 'energy':
          return '会議では、60%程度情報が揃った時点で方向性を決めやすい';
        case 'thinking':
          return 'フィードバックの際、事実と論点を優先して率直に伝えることが多い';
        case 'planning':
          return '計画を最初に固めて、それに沿って進めることを重視する';
        case 'vision':
          return '議論では、目的や原則から話を始めることが多い';
      }
      break;
  }
  return '';
};

export const getAxisWorkExample = (axis: keyof AxisScores, score: number): string => {
  const range = getScoreRange(score);
  return getWorkExampleByRange(axis, range);
};
