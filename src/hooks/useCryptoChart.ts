import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cryptoService } from '../services/cryptoService';
import type { CryptoChartData, CryptoChartDataPoint } from '../types/crypto';

interface UseCryptoChartResult {
  chartData: CryptoChartData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Transform timestamp to formatted date string based on days range
 */
const formatChartLabel = (timestamp: number, days: number): string => {
  const date = new Date(timestamp);

  if (days === 1) {
    // 24h: show HH:MM
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else if (days === 7) {
    // 7d: show MMM DD
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } else {
    // 30d: show MMM DD
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Transform CoinGecko price history to Cloudscape Chart format
 */
const transformToChartData = (coinName: string, prices: Array<[number, number]>, days: number): CryptoChartData => {
  // Handle empty price history
  if (!prices || prices.length === 0) {
    return {
      series: [
        {
          title: `${coinName} Price`,
          type: 'line',
          data: [],
        },
      ],
      labels: [],
    };
  }

  // Sample data to keep chart readable: take every nth point
  const sampleRate =
    days === 1 ? Math.max(1, Math.floor(prices.length / 24)) : Math.max(1, Math.floor(prices.length / 20));

  const sampledData: CryptoChartDataPoint[] = prices
    .filter((_, index) => index % sampleRate === 0)
    .map(([timestamp, price]) => ({
      x: formatChartLabel(timestamp, days),
      y: Math.round(price * 100) / 100, // Round to 2 decimal places
    }));

  const labels = sampledData.map(point => point.x);

  return {
    series: [
      {
        title: `${coinName} Price`,
        type: 'line',
        data: sampledData,
      },
    ],
    labels,
  };
};

// Simple in-memory cache for transformed chart data
const chartDataCache = new Map<string, { data: CryptoChartData; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch and transform cryptocurrency price history for charts
 * Caches transformed data to avoid repeated transformations
 */
export const useCryptoChart = (coinId: string | null, coinName: string | null, days: number): UseCryptoChartResult => {
  const { t } = useTranslation('errors');
  const [chartData, setChartData] = useState<CryptoChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    if (!coinId || !coinName) {
      setChartData(null);
      return;
    }

    const cacheKey = `chart:${coinId}:${days}`;
    const cached = chartDataCache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setChartData(cached.data);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const priceHistory = await cryptoService.getCryptoPriceHistory(coinId, days);

      // Handle null/undefined response
      if (!priceHistory || !priceHistory.prices) {
        const transformed = transformToChartData(coinName, [], days);
        chartDataCache.set(cacheKey, {
          data: transformed,
          timestamp: Date.now(),
        });
        setChartData(transformed);
        return;
      }

      const transformed = transformToChartData(coinName, priceHistory.prices, days);

      // Cache the transformed data
      chartDataCache.set(cacheKey, {
        data: transformed,
        timestamp: Date.now(),
      });

      setChartData(transformed);
    } catch (err) {
      const errorMessage = err instanceof Error ? t(`${err.message}`) : t('api.fetchPriceHistoryFailed');
      setError(errorMessage);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [coinId, coinName, days, t]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { chartData, loading, error };
};

// Test helper to reset internal cache between tests
export function clearChartDataCache() {
  chartDataCache.clear();
}
