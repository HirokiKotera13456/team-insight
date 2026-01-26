import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChangeIndicator } from '../ChangeIndicator';
import { AssessmentHistory } from '@/types';

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
  TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
  TrendingDown: () => <div data-testid="trending-down">TrendingDown</div>,
  Remove: () => <div data-testid="remove">Remove</div>,
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

describe('ChangeIndicator', () => {
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
    } as any,
  });

  it('should display message when history has less than 2 items', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70),
    ];

    render(<ChangeIndicator history={history} />);

    expect(
      screen.getByText('比較するには、少なくとも2回の診断結果が必要です')
    ).toBeInTheDocument();
  });

  it('should display change indicators for all axes', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(60, 70, 50, 80, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    expect(screen.getByText('前回からの変化')).toBeInTheDocument();
    expect(screen.getByText('行動エネルギー')).toBeInTheDocument();
    expect(screen.getByText('判断基準')).toBeInTheDocument();
    expect(screen.getByText('進め方')).toBeInTheDocument();
    expect(screen.getByText('視点')).toBeInTheDocument();
  });

  it('should show correct change values', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(60, 70, 50, 80, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    // Energy: 60 - 50 = +10 (should appear multiple times for all axes)
    const changeValues = screen.getAllByText('+10');
    expect(changeValues.length).toBe(4); // All 4 axes have +10 change
  });

  it('should show negative change values', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(40, 50, 30, 60, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    // Energy: 40 - 50 = -10 (should appear multiple times for all axes)
    const changeValues = screen.getAllByText('-10');
    expect(changeValues.length).toBe(4); // All 4 axes have -10 change
  });

  it('should show previous and current values', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(60, 70, 50, 80, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    expect(screen.getByText('前回: 50')).toBeInTheDocument();
    expect(screen.getByText('現在: 60')).toBeInTheDocument();
  });

  it('should show trending up icon for significant positive change', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(60, 70, 50, 80, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    // Change of +10 should show trending up (MUI uses TrendingUpIcon)
    const trendingUpIcons = screen.getAllByTestId('TrendingUpIcon');
    expect(trendingUpIcons.length).toBe(4); // All 4 axes have +10 change
  });

  it('should show trending down icon for significant negative change', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(40, 50, 30, 60, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    // Change of -10 should show trending down (MUI uses TrendingDownIcon)
    const trendingDownIcons = screen.getAllByTestId('TrendingDownIcon');
    expect(trendingDownIcons.length).toBe(4); // All 4 axes have -10 change
  });

  it('should show stable icon for small changes', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(51, 61, 41, 71, Date.now()),
      createMockHistory(50, 60, 40, 70, Date.now() - 86400000),
    ];

    render(<ChangeIndicator history={history} />);

    // Change of +1 should show stable (less than 5) (MUI uses RemoveIcon)
    const removeIcons = screen.getAllByTestId('RemoveIcon');
    expect(removeIcons.length).toBe(4); // All 4 axes have +1 change
  });

  it('should handle multiple history items and use latest two', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(70, 80, 60, 90, Date.now()),
      createMockHistory(60, 70, 50, 80, Date.now() - 86400000),
      createMockHistory(50, 60, 40, 70, Date.now() - 172800000),
    ];

    render(<ChangeIndicator history={history} />);

    // Should compare latest (70) with second latest (60)
    expect(screen.getByText('前回: 60')).toBeInTheDocument();
    expect(screen.getByText('現在: 70')).toBeInTheDocument();
  });

  it('should sort history by timestamp correctly', () => {
    const history: AssessmentHistory[] = [
      createMockHistory(50, 60, 40, 70, Date.now() - 172800000), // Oldest
      createMockHistory(70, 80, 60, 90, Date.now()), // Newest
      createMockHistory(60, 70, 50, 80, Date.now() - 86400000), // Middle
    ];

    render(<ChangeIndicator history={history} />);

    // Should compare newest (70) with middle (60), not oldest
    expect(screen.getByText('前回: 60')).toBeInTheDocument();
    expect(screen.getByText('現在: 70')).toBeInTheDocument();
  });
});
