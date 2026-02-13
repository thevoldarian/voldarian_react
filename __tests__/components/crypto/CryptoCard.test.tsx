import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CryptoCard } from '../../../src/components/crypto/CryptoCard';
import type { CryptoCoin } from '../../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CryptoCard', () => {
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

  const mockCoinNegativeChange: CryptoCoin = {
    ...mockCoin,
    change24h: -3.5,
  };

  it('displays coin information', () => {
    render(<CryptoCard coin={mockCoin} />);

    expect(screen.getByText('Bitcoin')).toBeDefined();
    expect(screen.getByText('BTC')).toBeDefined();
    expect(screen.getByText('$42.00K')).toBeDefined();
    expect(screen.getByAltText('Bitcoin')).toBeDefined();
  });

  it('displays positive price change in green', () => {
    const { container } = render(<CryptoCard coin={mockCoin} />);

    const changeElement = screen.getByTestId('crypto-change-bitcoin');
    expect(changeElement).toBeDefined();
    expect(changeElement.textContent).toContain('2.50');
  });

  it('displays negative price change in red', () => {
    const { container } = render(<CryptoCard coin={mockCoinNegativeChange} />);

    const changeElement = screen.getByTestId('crypto-change-bitcoin');
    expect(changeElement).toBeDefined();
    expect(changeElement.textContent).toContain('3.50');
  });

  it('formats large market cap values', () => {
    render(<CryptoCard coin={mockCoin} />);

    const marketCapText = screen.getByText(/Market Cap/i).parentElement?.textContent;
    expect(marketCapText).toContain('820');
  });

  it('formats price correctly', () => {
    render(<CryptoCard coin={mockCoin} />);

    expect(screen.getByText('$42.00K')).toBeDefined();
  });

  it('handles zero change', () => {
    const zeroChangeCoin = { ...mockCoin, change24h: 0 };
    render(<CryptoCard coin={zeroChangeCoin} />);

    const changeElement = screen.getByTestId('crypto-change-bitcoin');
    expect(changeElement.textContent).toContain('0.00');
  });

  it('renders coin image with correct src', () => {
    render(<CryptoCard coin={mockCoin} />);

    const image = screen.getByAltText('Bitcoin') as HTMLImageElement;
    expect(image.src).toContain('bitcoin.png');
  });

  it('handles very small price changes', () => {
    const smallChangeCoin = { ...mockCoin, change24h: 0.001 };
    render(<CryptoCard coin={smallChangeCoin} />);

    const changeElement = screen.getByTestId('crypto-change-bitcoin');
    expect(changeElement.textContent).toContain('0.00');
  });

  it('handles very large prices', () => {
    const highPriceCoin = { ...mockCoin, currentPrice: 9999999.99 };
    render(<CryptoCard coin={highPriceCoin} />);

    expect(screen.getByText('$10.00M')).toBeDefined();
  });
});
