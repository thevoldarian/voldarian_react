/**
 * Type definitions for cryptocurrency market data
 */

export interface CryptoCoin {
  id: string; // e.g., "bitcoin"
  name: string; // e.g., "Bitcoin"
  symbol: string; // e.g., "BTC"
  image: string; // URL to coin icon
  currentPrice: number; // Price in USD
  change24h: number; // Percentage change in 24h (can be negative)
  marketCap: number; // Market capitalization in USD
  volume24h: number; // 24h trading volume in USD
  rank: number; // Rank by market cap (1-10)
  sparkline?: number[]; // Optional: small price points for sparkline
}

export interface CryptoPriceHistory {
  prices: Array<[number, number]>; // [[timestamp_ms, price], ...]
}

export interface CryptoChartDataPoint {
  x: number | string; // Timestamp or formatted date string
  y: number; // Price in USD
}

export interface CryptoChartData {
  series: Array<{
    title: string; // Coin name
    type: 'line';
    data: CryptoChartDataPoint[];
  }>;
  labels: (number | string)[]; // X-axis labels
}

export interface CryptoState {
  coins: CryptoCoin[];
  selectedCoinId: string | null;
  refreshInterval: number; // milliseconds
  lastUpdated: string | null; // ISO timestamp
  loading: boolean;
  error: string | null;
}
