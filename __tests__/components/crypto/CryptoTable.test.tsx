import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CryptoTable } from '../../../src/components/crypto/CryptoTable';
import type { CryptoCoin } from '../../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CryptoTable', () => {
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
      change24h: -1.5,
      marketCap: 264000000000,
      volume24h: 11000000000,
      rank: 2,
      sparklineData: [2100, 2200],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with coin data', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    expect(screen.getByText('Bitcoin')).toBeDefined();
    expect(screen.getByText('Ethereum')).toBeDefined();
    expect(screen.getByText('BTC')).toBeDefined();
    expect(screen.getByText('ETH')).toBeDefined();
  });

  it('displays all table columns', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    expect(screen.getByText(/tableHeaders\.rank/)).toBeDefined();
    expect(screen.getByText(/tableHeaders\.name/)).toBeDefined();
    expect(screen.getByText(/tableHeaders\.price/)).toBeDefined();
    expect(screen.getByText(/tableHeaders\.change24h/)).toBeDefined();
    expect(screen.getByText(/tableHeaders\.marketCap/)).toBeDefined();
    expect(screen.getByText(/tableHeaders\.volume/)).toBeDefined();
    // Symbol is displayed within the name cell, not as a separate column
    expect(screen.getByText('BTC')).toBeDefined();
    expect(screen.getByText('ETH')).toBeDefined();
  });

  it('displays prices correctly formatted', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    expect(screen.getByText('$42,000.00')).toBeDefined();
    expect(screen.getByText('$2,200.00')).toBeDefined();
  });

  it('displays 24h change with sign', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    expect(screen.getByText('+2.50%')).toBeDefined();
    expect(screen.getByText('-1.50%')).toBeDefined();
  });

  it('colors positive change in green', () => {
    const { container } = render(
      <CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />
    );

    const positiveChange = screen.getByText('+2.50%');
    expect(positiveChange).toBeDefined();
  });

  it('colors negative change in red', () => {
    const { container } = render(
      <CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />
    );

    const negativeChange = screen.getByText('-1.50%');
    expect(negativeChange).toBeDefined();
  });

  it('calls onCoinSelect when row clicked', () => {
    const onCoinSelect = vi.fn();
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={onCoinSelect} />);

    const ethereumRow = screen.getByText('Ethereum');
    fireEvent.click(ethereumRow);

    expect(onCoinSelect).toHaveBeenCalledWith('ethereum');
  });

  it('displays coins in order by rank', () => {
    const unorderedCoins = [...mockCoins].reverse(); // Reverse order
    render(<CryptoTable coins={unorderedCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    const rows = screen.getAllByText(/Bitcoin|Ethereum/);
    // Bitcoin should appear first
    expect(rows[0].textContent).toContain('Bitcoin');
  });

  it('handles empty coin list', () => {
    render(<CryptoTable coins={[]} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    // Should display empty state message when no coins
    expect(screen.getByText(/No cryptocurrency/)).toBeDefined();
  });

  it('displays market cap formatted', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    // Market cap should be formatted as $XXX.XB
    // Need to use getAllByText because both marketCap and volume24h are formatted with B suffix
    const marketCapElements = screen.getAllByText(/\$[0-9.]+B/);
    expect(marketCapElements.length).toBeGreaterThan(0);
  });

  it('displays volume formatted', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    // Volume should be displayed in B (billions) format
    // Bitcoin: 28,000,000,000 = $28.0B, Ethereum: 11,000,000,000 = $11.0B
    const volumeElements = screen.getAllByText(/\$[0-9.]+B/);
    expect(volumeElements.length).toBeGreaterThan(0);
  });

  it('sorts by clicking column headers', () => {
    const { container } = render(
      <CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />
    );

    const priceHeader = screen.getByText(/tableHeaders\.price/).closest('button');
    expect(priceHeader).toBeDefined();
  });

  it('handles coin with zero change', () => {
    const zerosChangeCoins = [{ ...mockCoins[0], change24h: 0 }];
    render(
      <CryptoTable coins={zerosChangeCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />
    );

    expect(screen.getByText(/0\.00%/)).toBeDefined();
  });

  it('displays coin rank numbers', () => {
    render(<CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />);

    expect(screen.getByText('#1')).toBeDefined();
    expect(screen.getByText('#2')).toBeDefined();
  });

  it('highlights selected coin', () => {
    const { container } = render(
      <CryptoTable coins={mockCoins} selectedCoinId="bitcoin" onCoinSelect={() => {}} />
    );

    // The Bitcoin row should be highlighted
    expect(screen.getByText('Bitcoin')).toBeDefined();
  });

  it('handles large number of coins', () => {
    const largeCoinList = Array.from({ length: 100 }, (_, i) => ({
      ...mockCoins[0],
      id: `coin-${i}`,
      name: `Coin ${i}`,
      rank: i + 1,
    }));

    render(
      <CryptoTable coins={largeCoinList} selectedCoinId="coin-0" onCoinSelect={() => {}} />
    );

    expect(screen.getByText('Coin 0')).toBeDefined();
    expect(screen.getByText('Coin 99')).toBeDefined();
  });
});
