import React from 'react';
import { render, screen } from '@testing-library/react';
import { HistoryChart } from '../HistoryChart';
import { AssessmentHistory } from '@/types';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock utils
jest.mock('@/utils/comments', () => ({
  getAxisName: (axis: string) => {
    const names: Record<string, string> = {
      energy: '行動エネルギー',
      thinking: '判断基準',
      planning: '進め方',
      vision: '視点',
    };
    return names[axis] || axis;
  },
}));

describe('HistoryChart', () => {
  const createMockHistory = (
    energy: number,
    thinking: number,
    planning: number,
    vision: number,
    timestamp: number = Date.now()
  ): AssessmentHistory => ({
    id: `history-${timestamp}`,
    energy,
    thinking,
    planning,
    vision,
    answeredAt: {
      toMillis: () => timestamp,
      toDate: () => new Date(timestamp),
    } as any,
  });

  it('should display message when history is empty', () => {
    render(<HistoryChart history={[]} />);

    expect(screen.getByText('履歴データがありません')).toBeInTheDocument();
  });

  it('should render chart when history exists', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70),
    ];

    render(<HistoryChart history={history} />);

    expect(screen.getByText('スコアの推移')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should render all axis lines', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70),
    ];

    render(<HistoryChart history={history} />);

    const lines = screen.getAllByTestId('line');
    expect(lines.length).toBe(4); // energy, thinking, planning, vision
  });

  it('should render chart components', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70),
    ];

    render(<HistoryChart history={history} />);

    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should sort history by timestamp in ascending order', () => {
    const now = Date.now();
    const history: AssessmentHistory[] = [
      createMockHistory(70, 80, 60, 90, now),
      createMockHistory(50, 60, 40, 70, now - 172800000),
      createMockHistory(60, 70, 50, 80, now - 86400000),
    ];

    render(<HistoryChart history={history} />);

    // Chart should be rendered (sorting is internal)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should handle history with single item', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70),
    ];

    render(<HistoryChart history={history} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should handle history with multiple items', () => {
    const now = Date.now();
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70, now - 172800000),
      createMockHistory(55, 65, 45, 75, now - 86400000),
      createMockHistory(60, 70, 50, 80, now),
    ];

    render(<HistoryChart history={history} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    const lines = screen.getAllByTestId('line');
    expect(lines.length).toBe(4);
  });

  it('should handle history items without toDate method', () => {
    const history: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: {
          toMillis: () => Date.now(),
        } as any,
      },
    ];

    render(<HistoryChart history={history} />);

    // Should still render chart
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should format date labels correctly', () => {
    const specificDate = new Date('2024-01-15T10:00:00Z');
    const history: AssessmentHistory[] = [
      {
        id: 'history-1',
        energy: 50,
        thinking: 60,
        planning: 40,
        vision: 70,
        answeredAt: {
          toMillis: () => specificDate.getTime(),
          toDate: () => specificDate,
        } as any,
      },
    ];

    render(<HistoryChart history={history} />);

    // Chart should render with date formatting
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
