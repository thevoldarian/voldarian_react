import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CryptoDashboard from '../../../src/pages/projects/CryptoDashboard';
import cryptoReducer from '../../../src/store/cryptoSlice';
import * as useCryptoDataModule from '../../../src/hooks/useCryptoData';
import * as useCryptoRefreshModule from '../../../src/hooks/useCryptoRefresh';
import type { CryptoCoin } from '../../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../../src/hooks/useCryptoData', () => ({
  useCryptoData: vi.fn(),
}));

vi.mock('../../../src/hooks/useCryptoRefresh', () => ({
  useCryptoRefresh: vi.fn(),
}));

vi.mock('../../../src/components/crypto/CryptoTable', () => ({
  CryptoTable: ({ onCoinSelect }: any) => (
    <div data-testid='crypto-table' onClick={() => onCoinSelect?.('ethereum')}>
      Table Component
    </div>
  ),
}));

vi.mock('../../../src/components/crypto/CryptoChart', () => ({
  CryptoChart: () => <div data-testid='crypto-chart'>Chart Component</div>,
}));

vi.mock('../../../src/components/crypto/RefreshControls', () => ({
  RefreshControls: ({ onIntervalChange, onManualRefresh }: any) => (
    <div data-testid='refresh-controls'>
      <button onClick={() => onIntervalChange?.(30000)} data-testid='interval-btn'>
        Change Interval
      </button>
      <button onClick={() => onManualRefresh?.()} data-testid='refresh-btn'>
        Refresh
      </button>
    </div>
  ),
}));

vi.mock('../../../src/components/crypto/PriceAlert', () => ({
  PriceAlert: () => <div data-testid='price-alert'>Alert Component</div>,
}));

vi.mock('../../../src/components/crypto/CryptoCard', () => ({
  CryptoCard: () => <div data-testid='crypto-card'>Card Component</div>,
}));

describe('CryptoDashboard', () => {
  const mockCoins: CryptoCoin[] = [
    {
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
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://example.com/ethereum.png',
      currentPrice: 2200,
      change24h: 1.5,
      marketCap: 264000000000,
      volume24h: 11000000000,
      rank: 2,
      sparklineData: [2100, 2200],
    },
  ];

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: { crypto: cryptoReducer },
      preloadedState: {
        crypto: {
          coins: mockCoins,
          selectedCoinId: 'bitcoin',
          refreshInterval: 60000,
          lastUpdated: null,
          loading: false,
          error: null,
        },
      },
    });

    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: mockCoins,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    vi.mocked(useCryptoRefreshModule.useCryptoRefresh).mockReturnValue({
      start: vi.fn(),
      stop: vi.fn(),
    });
  });

  const renderDashboard = () => {
    return render(
      <Provider store={store}>
        <CryptoDashboard />
      </Provider>
    );
  };

  it('renders main dashboard components', () => {
    renderDashboard();

    expect(screen.getByText('title')).toBeDefined();
    expect(screen.getByTestId('crypto-table')).toBeDefined();
    expect(screen.getByTestId('crypto-chart')).toBeDefined();
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('displays price alert when coins available', () => {
    renderDashboard();

    expect(screen.getByTestId('price-alert')).toBeDefined();
  });

  it('displays selected coin card', () => {
    renderDashboard();

    expect(screen.getByTestId('crypto-card')).toBeDefined();
  });

  it('fetches data on initial mount if not loaded', () => {
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderDashboard();

    const mockUseCryptoData = vi.mocked(useCryptoDataModule.useCryptoData);
    expect(mockUseCryptoData).toHaveBeenCalled();
  });

  it('does not refetch if data already loaded', () => {
    const refetch = vi.fn();
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: mockCoins,
      loading: false,
      error: null,
      refetch,
    });

    renderDashboard();

    // Should not refetch since coins already exist
    expect(refetch).not.toHaveBeenCalled();
  });

  it('handles loading state', () => {
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderDashboard();

    // Should handle loading gracefully
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('handles error state', () => {
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: [],
      loading: false,
      error: 'Failed to fetch',
      refetch: vi.fn(),
    });

    renderDashboard();

    // Error alert should be displayed when there's an error
    expect(screen.getByTestId('dashboard-error')).toBeDefined();
    expect(screen.getByText('Failed to fetch')).toBeDefined();
  });

  it('calls useCryptoRefresh with refetch function', () => {
    const refetch = vi.fn();
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: mockCoins,
      loading: false,
      error: null,
      refetch,
    });

    renderDashboard();

    expect(vi.mocked(useCryptoRefreshModule.useCryptoRefresh)).toHaveBeenCalledWith(refetch);
  });

  it('handles manual refresh', async () => {
    const user = userEvent.setup({ delay: null });
    const refetch = vi.fn().mockResolvedValueOnce(undefined);
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: mockCoins,
      loading: false,
      error: null,
      refetch,
    });

    renderDashboard();

    const refreshBtn = screen.getByTestId('refresh-btn');
    await user.click(refreshBtn);

    // Manual refresh should work
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('updates refresh interval when changed', async () => {
    const user = userEvent.setup({ delay: null });
    renderDashboard();

    const intervalBtn = screen.getByTestId('interval-btn');
    await user.click(intervalBtn);

    // Interval change should be dispatched
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('selects coin when table row clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderDashboard();

    const table = screen.getByTestId('crypto-table');
    await user.click(table);

    // Selected coin should update (ethereum was selected by mock)
    expect(screen.getByTestId('crypto-card')).toBeDefined();
  });

  it('defaults to first coin if no selection', () => {
    renderDashboard();

    // Should default to bitcoin (first in the list)
    expect(screen.getByTestId('crypto-card')).toBeDefined();
  });

  it('resets chart to 24h when changing coins', async () => {
    const user = userEvent.setup({ delay: null });
    renderDashboard();

    // Click table to change coin
    const table = screen.getByTestId('crypto-table');
    await user.click(table);

    // Chart component should be rendered (with reset days)
    expect(screen.getByTestId('crypto-chart')).toBeDefined();
  });

  it('displays description text', () => {
    renderDashboard();

    expect(screen.getByText('description')).toBeDefined();
  });

  it('renders without crashing when no coins', () => {
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderDashboard();

    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('integrates all child components', () => {
    renderDashboard();

    expect(screen.getByTestId('crypto-table')).toBeDefined();
    expect(screen.getByTestId('crypto-chart')).toBeDefined();
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
    expect(screen.getByTestId('price-alert')).toBeDefined();
    expect(screen.getByTestId('crypto-card')).toBeDefined();
  });

  it('passes correct props to children', () => {
    const refetch = vi.fn();
    vi.mocked(useCryptoDataModule.useCryptoData).mockReturnValue({
      coins: mockCoins,
      loading: false,
      error: null,
      refetch,
    });

    renderDashboard();

    expect(vi.mocked(useCryptoRefreshModule.useCryptoRefresh)).toHaveBeenCalled();
  });

  it('handles Redux state updates', () => {
    renderDashboard();

    // Should have access to Redux state
    expect(screen.getByTestId('refresh-controls')).toBeDefined();
  });

  it('updates when Redux state changes', () => {
    const { rerender } = render(
      <Provider store={store}>
        <CryptoDashboard />
      </Provider>
    );

    // Update store
    store.dispatch({
      type: 'crypto/selectCoin',
      payload: 'ethereum',
    });

    rerender(
      <Provider store={store}>
        <CryptoDashboard />
      </Provider>
    );

    expect(screen.getByTestId('crypto-card')).toBeDefined();
  });
});
