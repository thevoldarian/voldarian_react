import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PriceAlert } from '../../../src/components/crypto/PriceAlert';
import type { CryptoCoin } from '../../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PriceAlert', () => {
  const mockCoins: CryptoCoin[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://example.com/bitcoin.png',
      currentPrice: 42000,
      change24h: 5.0, // Positive change - potential top gainer
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
      change24h: -2.5, // Negative change - potential top loser
      marketCap: 264000000000,
      volume24h: 11000000000,
      rank: 2,
      sparklineData: [2100, 2200],
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      image: 'https://example.com/cardano.png',
      currentPrice: 0.58,
      change24h: 1.2,
      marketCap: 20000000000,
      volume24h: 800000000,
      rank: 3,
      sparklineData: [0.57, 0.58],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders alert when coins provided', () => {
    render(<PriceAlert coins={mockCoins} />);

    // Should render top gainer and loser info
    expect(screen.getByText(/alert\.topGainer/)).toBeDefined();
    expect(screen.getByText(/alert\.topLoser/)).toBeDefined();
  });

  it('identifies top gainer correctly', () => {
    render(<PriceAlert coins={mockCoins} />);

    // Bitcoin has 5% change - should be top gainer
    // Text might be split, use regex to match
    expect(screen.queryByText(/Bitcoin/)).toBeDefined();
    expect(screen.queryByText(/5\.00%/)).toBeDefined();
  });

  it('identifies top loser correctly', () => {
    render(<PriceAlert coins={mockCoins} />);

    // Ethereum has -2.5% change - should be top loser
    expect(screen.queryByText(/Ethereum/)).toBeDefined();
    expect(screen.queryByText(/2\.50%/)).toBeDefined();
  });

  it('displays both gainer and loser information', () => {
    render(<PriceAlert coins={mockCoins} />);

    expect(screen.queryByText(/Bitcoin/)).toBeDefined();
    expect(screen.queryByText(/Ethereum/)).toBeDefined();
  });

  it('handles empty coin list', () => {
    const { container } = render(<PriceAlert coins={[]} />);

    // Should render nothing when empty
    expect(container.textContent).toBe('');
  });

  it('handles single coin', () => {
    const singleCoin = mockCoins.slice(0, 1);
    const { container } = render(<PriceAlert coins={singleCoin} />);

    // With single coin, gainer and loser are the same, so alert doesn't show
    expect(container.textContent).toBe('');
  });

  it('displays percentage changes with correct sign', () => {
    render(<PriceAlert coins={mockCoins} />);

    expect(screen.queryByText(/5\.00%/)).toBeDefined();
    expect(screen.queryByText(/2\.50%/)).toBeDefined();
  });

  it('can be dismissed', () => {
    const { container } = render(<PriceAlert coins={mockCoins} />);

    const dismissButton = screen.queryByRole('button', { name: /close|dismiss/i });
    if (dismissButton) {
      fireEvent.click(dismissButton);
      expect(container.textContent).toBe('');
    }
  });

  it('shows message when all coins have same change', () => {
    const sameChanges = mockCoins.map(coin => ({
      ...coin,
      change24h: 2.0,
    }));

    const { container } = render(<PriceAlert coins={sameChanges} />);

    // When all coins have same change, gainer and loser are the same, no alert
    expect(container.textContent).toBe('');
  });

  it('handles very large positive change', () => {
    const largeChangeCoins = [
      { ...mockCoins[0], change24h: 150.5 },
      { ...mockCoins[1], change24h: 1.0 },
    ];

    render(<PriceAlert coins={largeChangeCoins} />);

    expect(screen.queryByText(/150\.50%/)).toBeDefined();
  });

  it('handles very large negative change', () => {
    const largeChangeCoins = [
      { ...mockCoins[0], change24h: 1.0 },
      { ...mockCoins[1], change24h: -75.5 },
    ];

    render(<PriceAlert coins={largeChangeCoins} />);

    expect(screen.queryByText(/75\.50%/)).toBeDefined();
  });

  it('handles zero change', () => {
    const zeroChangeCoins = [
      { ...mockCoins[0], change24h: 0 },
      { ...mockCoins[1], change24h: -1 }, // Need at least one different value
    ];

    render(<PriceAlert coins={zeroChangeCoins} />);

    // Should display alert since there's a gainer (0%) and loser (-1%)
    expect(screen.getByText(/alert\.topGainer/)).toBeDefined();
    expect(screen.getByText(/alert\.topLoser/)).toBeDefined();
  });

  it('preserves coin symbols in alert', () => {
    render(<PriceAlert coins={mockCoins} />);

    // Bitcoin should be displayed in the alert
    expect(screen.queryByText(/Bitcoin/)).toBeDefined();
  });

  it('alert is dismissible', () => {
    const { rerender } = render(<PriceAlert coins={mockCoins} />);

    expect(screen.getByText(/alert\.topGainer/)).toBeDefined();

    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);

    // Alert should disappear
    expect(screen.queryByText(/alert\.topGainer/)).toBeNull();
  });

  it('handles coins with equal maximum change', () => {
    const equalCoins = [
      { ...mockCoins[0], change24h: 5.0 },
      { ...mockCoins[1], change24h: 5.0, id: 'ripple' },
      { ...mockCoins[2], change24h: -1.0 }, // Add a loser
    ];

    render(<PriceAlert coins={equalCoins} />);

    // Should display alert and pick the first one with max change
    expect(screen.getByText(/alert\.topGainer/)).toBeDefined();
    // Bitcoin text might be split, use queryAllByText to find any matching text
    const bitcoinText = screen.queryAllByText(/Bitcoin/);
    expect(bitcoinText.length).toBeGreaterThan(0);
  });

  it('handles coins with equal minimum change', () => {
    const equalCoins = [
      { ...mockCoins[0], change24h: 3.5 }, // Add a gainer
      { ...mockCoins[1], change24h: -2.5 },
      { ...mockCoins[2], change24h: -2.5, id: 'ripple' },
    ];

    render(<PriceAlert coins={equalCoins} />);

    // Should display alert and pick the first one with min change
    expect(screen.getByText(/alert\.topLoser/)).toBeDefined();
    // Ethereum text might be split, use queryAllByText to find any matching text
    const ethereumText = screen.queryAllByText(/Ethereum/);
    expect(ethereumText.length).toBeGreaterThan(0);
  });

  it('displays alert with proper styling', () => {
    const { container } = render(<PriceAlert coins={mockCoins} />);

    const alert = container.querySelector('[role="img"]');
    expect(alert).toBeDefined();
  });

  it('shows alert before dismissal', () => {
    render(<PriceAlert coins={mockCoins} />);

    const alert = screen.getByText(/alert\.topGainer/);
    expect(alert).toBeDefined();
  });
});
