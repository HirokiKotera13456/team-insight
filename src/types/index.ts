export type AxisType = 'energy' | 'thinking' | 'planning' | 'vision';

export interface AxisScores {
  energy: number;
  thinking: number;
  planning: number;
  vision: number;
}

export interface Question {
  id: string;
  axis: AxisType;
  text: string;
  leftLabel: string;
  rightLabel: string;
  context?: string; // 仕事シーンの補足（例：方針を決める会議、タスクの優先順位を決める場面など）
  shortLeftLabel?: string; // 短い左ラベル（感覚的）
  shortRightLabel?: string; // 短い右ラベル（感覚的）
}

export interface UserData {
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface AxisScoreData extends AxisScores {
  answeredAt?: any;
  version: string;
}

export interface AssessmentHistory extends AxisScores {
  id: string;
  answeredAt: any; // Firestore Timestamp
  createdAt?: any;
}

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}
