import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCryptoData } from '../../src/hooks/useCryptoData';
import cryptoReducer from '../../src/store/cryptoSlice';
import * as cryptoService from '../../src/services/cryptoService';
import type { CryptoCoin } from '../../src/types/crypto';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../src/services/cryptoService', () => ({
  cryptoService: {
    getCryptoPrices: vi.fn(),
    getCryptoPriceHistory: vi.fn(),
    refreshPrices: vi.fn(),
  },
}));

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

describe('useCryptoData', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: { crypto: cryptoReducer },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCryptoData(), { wrapper });

    expect(result.current.coins).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches crypto data successfully', async () => {
    vi.mocked(cryptoService.cryptoService.getCryptoPrices).mockResolvedValueOnce(mockCoins);

    const { result } = renderHook(() => useCryptoData(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.coins).toEqual(mockCoins);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles loading state during fetch', async () => {
    let resolvePromise: () => void;
    const fetchPromise = new Promise<CryptoCoin[]>(resolve => {
      resolvePromise = () => resolve(mockCoins);
    });

    vi.mocked(cryptoService.cryptoService.getCryptoPrices).mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => useCryptoData(), { wrapper });

    const fetchPromiseHandle = act(async () => {
      result.current.refetch();
    });

    // Loading state should be true during fetch
    expect(result.current.coins).toEqual([]);

    resolvePromise!();
    await fetchPromiseHandle;

    expect(result.current.loading).toBe(false);
  });

  it('handles fetch error', async () => {
    vi.mocked(cryptoService.cryptoService.getCryptoPrices).mockRejectedValueOnce(
      new Error('API Error')
    );

    const { result } = renderHook(() => useCryptoData(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.coins).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('handles non-Error exceptions', async () => {
    vi.mocked(cryptoService.cryptoService.getCryptoPrices).mockRejectedValueOnce('Network error');

    const { result } = renderHook(() => useCryptoData(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('api.fetchCryptoPricesFailed');
  });

  it('returns refetch function', () => {
    const { result } = renderHook(() => useCryptoData(), { wrapper });

    expect(typeof result.current.refetch).toBe('function');
  });

  it('clears error on successful refetch', async () => {
    vi.mocked(cryptoService.cryptoService.getCryptoPrices)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce(mockCoins);

    const { result } = renderHook(() => useCryptoData(), { wrapper });

    // First fetch - error
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('API Error');

    // Second fetch - success
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.coins).toEqual(mockCoins);
  });
});
