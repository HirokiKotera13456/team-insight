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
    return '状況を見ながらバランスよく判断するタイプ。チームでは調整役になることが多そうです。';
  }

  // 左寄りが優勢
  if (leftCount >= 2) {
    if (tendencies.energy === 'left' && tendencies.planning === 'left') {
      return '情報を集めてから動き、状況に合わせて柔軟に調整するタイプ。リスクを見ながら着実に進めるのが得意そうです。';
    }
    return '慎重さと柔軟さを持ち合わせたタイプ。まわりの状況を確認してから動くことが多そうです。';
  }

  // 右寄りが優勢
  if (rightCount >= 2) {
    if (tendencies.energy === 'right' && tendencies.planning === 'right') {
      return 'まず動いてから調整し、計画を立てて進めるタイプ。スピードと計画性を両立させるのが得意そうです。';
    }
    return '論理的で計画的に進めるタイプ。データや根拠をもとに判断することが多そうです。';
  }

  // 平均的な傾向
  if (avgScore >= 40 && avgScore <= 60) {
    return '状況を見ながらバランスよく判断するタイプ。チームでは調整役になることが多そうです。';
  }

  return '慎重さと柔軟さを持ち合わせたタイプ。まわりの状況を確認してから動くことが多そうです。';
};

const getTendencyLabelByRange = (
  axis: keyof AxisScores,
  range: 'left' | 'leftMiddle' | 'middle' | 'rightMiddle' | 'right'
): string => {
  switch (range) {
    case 'left':
      switch (axis) {
        case 'energy':
          return '石橋を叩いてから渡る派';
        case 'thinking':
          return '人の気持ちを大事にする派';
        case 'planning':
          return '臨機応変に対応する派';
        case 'vision':
          return '具体例から入る派';
      }
      break;
    case 'leftMiddle':
    case 'middle':
    case 'rightMiddle':
      switch (axis) {
        case 'energy':
          return '状況を見て切り替える派';
        case 'thinking':
          return 'バランスを見て判断する派';
        case 'planning':
          return '計画と柔軟さを両立する派';
        case 'vision':
          return '具体と抽象を行き来する派';
      }
      break;
    case 'right':
      switch (axis) {
        case 'energy':
          return 'まず動いてみる派';
        case 'thinking':
          return 'データと論理で決める派';
        case 'planning':
          return '計画をしっかり立てる派';
        case 'vision':
          return '大きな絵から入る派';
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
          return '会議では全員の意見を聞いてから結論を出すことが多い';
        case 'thinking':
          return 'フィードバックするとき、相手の反応を見ながら言い方を変える';
        case 'planning':
          return '予定変更があったら、まず影響範囲を確認してから動く';
        case 'vision':
          return '説明するとき、まず具体例から入ることが多い';
      }
      break;
    case 'leftMiddle':
    case 'middle':
    case 'rightMiddle':
      switch (axis) {
        case 'energy':
          return '情報がある程度揃ったら決断に動くことが多い';
        case 'thinking':
          return '意見が割れたとき、納得感と根拠の両方を意識する';
        case 'planning':
          return '計画は立てるけど、状況次第で柔軟に変える';
        case 'vision':
          return '具体例と全体像を行き来しながら説明する';
      }
      break;
    case 'right':
      switch (axis) {
        case 'energy':
          return '6割くらい情報が揃ったら、まず動いて調整する';
        case 'thinking':
          return 'フィードバックは事実ベースでストレートに伝える';
        case 'planning':
          return '最初に計画を固めて、それに沿って進めたい';
        case 'vision':
          return '話すとき、まず目的や全体像から入ることが多い';
      }
      break;
  }
  return '';
};

export const getAxisWorkExample = (axis: keyof AxisScores, score: number): string => {
  const range = getScoreRange(score);
  return getWorkExampleByRange(axis, range);
};
