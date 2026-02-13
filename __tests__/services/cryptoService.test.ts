import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cryptoService } from '../../src/services/cryptoService';
import { apiCache } from '../../src/utils/cache';

global.fetch = vi.fn();

describe('cryptoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiCache.clear();
  });

  describe('getCryptoPrices', () => {
    it('fetches top 10 cryptocurrencies successfully', async () => {
      const mockResponse = {
        bitcoin: {
          usd: 42000,
          usd_market_cap: 820000000000,
          usd_24h_change: 2.5,
          usd_24h_vol: 28000000000,
        },
        ethereum: {
          usd: 2200,
          usd_market_cap: 264000000000,
          usd_24h_change: 1.5,
          usd_24h_vol: 11000000000,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await cryptoService.getCryptoPrices();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('bitcoin');
      expect(result[0].currentPrice).toBe(42000);
      expect(result[0].change24h).toBe(2.5);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('api.coingecko.com'));
    });

    it('transforms API response correctly', async () => {
      const mockResponse = {
        bitcoin: {
          usd: 42000,
          usd_market_cap: 820000000000,
          usd_24h_change: 2.5,
          usd_24h_vol: 28000000000,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await cryptoService.getCryptoPrices();

      expect(result[0]).toMatchObject({
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        currentPrice: 42000,
        change24h: 2.5,
        marketCap: 820000000000,
        volume24h: 28000000000,
        rank: 1,
      });
    });

    it('throws error on failed request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });

      await expect(cryptoService.getCryptoPrices()).rejects.toThrow('api.fetchCryptoPricesFailed');
    });

    it('throws error on network failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      await expect(cryptoService.getCryptoPrices()).rejects.toThrow('api.fetchCryptoPricesFailed');
    });

    it('caches results for 2 minutes', async () => {
      const mockResponse = {
        bitcoin: {
          usd: 42000,
          usd_market_cap: 820000000000,
          usd_24h_change: 2.5,
          usd_24h_vol: 28000000000,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result1 = await cryptoService.getCryptoPrices();
      const result2 = await cryptoService.getCryptoPrices();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('validates response has required fields', async () => {
      const invalidResponse = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          // Missing required fields
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      });

      await expect(cryptoService.getCryptoPrices()).rejects.toThrow();
    });
  });

  describe('getCryptoPriceHistory', () => {
    it('fetches price history successfully', async () => {
      const mockResponse = {
        prices: [
          [1707696000000, 42000],
          [1707782400000, 42500],
          [1707868800000, 41800],
        ],
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await cryptoService.getCryptoPriceHistory('bitcoin', 1);

      expect(result.prices).toHaveLength(3);
      expect(result.prices[0]).toEqual([1707696000000, 42000]);
      expect(result.prices[0][0]).toBe(1707696000000);
      expect(result.prices[0][1]).toBe(42000);
    });

    it('supports different day ranges', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ prices: [[1707696000000, 42000]] }),
      });

      await cryptoService.getCryptoPriceHistory('bitcoin', 7);

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('days=7'));
    });

    it('throws error on failed request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });

      await expect(cryptoService.getCryptoPriceHistory('bitcoin', 1)).rejects.toThrow('api.fetchPriceHistoryFailed');
    });

    it('caches history per coin and day range', async () => {
      const mockResponse = {
        prices: [[1707696000000, 42000]],
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await cryptoService.getCryptoPriceHistory('bitcoin', 1);
      await cryptoService.getCryptoPriceHistory('bitcoin', 1);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles invalid coin ID', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });

      await expect(cryptoService.getCryptoPriceHistory('invalid-coin', 1)).rejects.toThrow();
    });
  });

  describe('refreshPrices', () => {
    it('clears cache and refetches prices', async () => {
      const mockResponse = {
        bitcoin: { usd: 42000, usd_market_cap: 820000000000, usd_24h_change: 2.5, usd_24h_vol: 28000000000 },
        ethereum: { usd: 2200, usd_market_cap: 264000000000, usd_24h_change: 1.5, usd_24h_vol: 11000000000 }
      };

      // Cache initial response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await cryptoService.getCryptoPrices();

      // Refresh should fetch again
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const refreshedResult = await cryptoService.refreshPrices();

      expect(refreshedResult.length).toBeGreaterThan(0);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
