import { TrendingUp, Psychology, EventNote, Visibility } from '@mui/icons-material';
import { AxisType } from '@/types';

export interface AxisColorConfig {
  main: string;
  light: string;
  gradient: string;
  icon: React.ComponentType;
}

export const axisColors: Record<AxisType, AxisColorConfig> = {
  energy: {
    main: '#6366f1',
    light: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: TrendingUp,
  },
  thinking: {
    main: '#8b5cf6',
    light: '#a78bfa',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    icon: Psychology,
  },
  planning: {
    main: '#06b6d4',
    light: '#22d3ee',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    icon: EventNote,
  },
  vision: {
    main: '#f59e0b',
    light: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: Visibility,
  },
};

// 単純な色のみが必要な場合のヘルパー
export const getAxisColor = (axis: AxisType): string => {
  return axisColors[axis].main;
};
