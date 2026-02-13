import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CryptoChart } from '../../../src/components/crypto/CryptoChart';
import * as useCryptoChartModule from '../../../src/hooks/useCryptoChart';
import type { CryptoCoin } from '../../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../../src/hooks/useCryptoChart', () => ({
  useCryptoChart: vi.fn(),
}));

describe('CryptoChart', () => {
  const mockCoin: CryptoCoin = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://example.com/bitcoin.png',
    currentPrice: 42000,
    change24h: 2.5,
    marketCap: 820000000000,
    volume24h: 28000000000,
    rank: 1,
    sparklineData: [41000, 42000],
  };

  const mockChartData = {
    series: [
      {
        title: 'Bitcoin Price (USD)',
        type: 'line' as const,
        data: [
          { x: 0, y: 42000 },
          { x: 1, y: 42500 },
          { x: 2, y: 41800 },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays message when no coin selected', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: null,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={null} />);

    expect(screen.getByText('Select a cryptocurrency to view its price trend')).toBeDefined();
  });

  it('renders day toggle buttons', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={mockCoin} selectedDays={1} />);

    expect(screen.getByText('24h')).toBeDefined();
    expect(screen.getByText('7d')).toBeDefined();
    expect(screen.getByText('30d')).toBeDefined();
  });

  it('highlights selected day button', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    const { container } = render(<CryptoChart coin={mockCoin} selectedDays={7} />);

    // The 7d button should be primary variant
    expect(screen.getByText('7d')).toBeDefined();
  });

  it('calls onDaysChange when day button clicked', () => {
    const onDaysChange = vi.fn();
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={mockCoin} selectedDays={1} onDaysChange={onDaysChange} />);

    const button7d = screen.getByText('7d');
    fireEvent.click(button7d);

    expect(onDaysChange).toHaveBeenCalledWith(7);
  });

  it('displays loading state', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: null,
      loading: true,
      error: null,
    });

    render(<CryptoChart coin={mockCoin} />);

    expect(screen.getByTestId('chart-loading')).toBeDefined();
  });

  it('displays error state', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: null,
      loading: false,
      error: 'Failed to fetch chart data',
    });

    render(<CryptoChart coin={mockCoin} />);

    expect(screen.getByText('Failed to fetch chart data')).toBeDefined();
  });

  it('renders chart when data is available', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    const { container } = render(<CryptoChart coin={mockCoin} />);

    // Chart should be rendered (check by data-testid or by looking for the canvas)
    expect(screen.getByTestId(`chart-bitcoin`)).toBeDefined();
  });

  it('displays coin name in header', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={mockCoin} />);

    expect(screen.getByText('Bitcoin Price Trend')).toBeDefined();
  });

  it('passes correct parameters to useCryptoChart hook', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={mockCoin} selectedDays={7} />);

    expect(vi.mocked(useCryptoChartModule.useCryptoChart)).toHaveBeenCalledWith(
      'bitcoin',
      'Bitcoin',
      7
    );
  });

  it('handles null coin gracefully', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: null,
      loading: false,
      error: null,
    });

    render(<CryptoChart coin={null} selectedDays={1} />);

    expect(screen.getByText('Select a cryptocurrency to view its price trend')).toBeDefined();
  });

  it('updates chart when selectedDays prop changes', () => {
    vi.mocked(useCryptoChartModule.useCryptoChart).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    const { rerender } = render(<CryptoChart coin={mockCoin} selectedDays={1} />);

    expect(vi.mocked(useCryptoChartModule.useCryptoChart)).toHaveBeenCalledWith(
      'bitcoin',
      'Bitcoin',
      1
    );

    rerender(<CryptoChart coin={mockCoin} selectedDays={7} />);

    expect(vi.mocked(useCryptoChartModule.useCryptoChart)).toHaveBeenCalledWith(
      'bitcoin',
      'Bitcoin',
      7
    );
  });
});
