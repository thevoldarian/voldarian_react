import { apiCache } from '../utils/cache';
import type { CryptoCoin, CryptoPriceHistory } from '../types/crypto';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Top 10 cryptocurrencies by market cap
const TOP_10_COIN_IDS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'ripple',
  'polkadot',
  'dogecoin',
  'polygon',
  'uniswap',
];

const COIN_NAME_MAP: Record<string, { name: string; symbol: string; image: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  binancecoin: {
    name: 'Binance Coin',
    symbol: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
  ripple: {
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  },
  polkadot: {
    name: 'Polkadot',
    symbol: 'DOT',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  },
  dogecoin: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    image: 'https://assets.coingecko.com/coins/images/13442/large/polygon.png',
  },
  uniswap: {
    name: 'Uniswap',
    symbol: 'UNI',
    image: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg',
  },
};

/**
 * Cryptocurrency data service
 * Fetches data from CoinGecko free API
 */
export const cryptoService = {
  /**
   * Fetch top 10 cryptocurrencies with current prices
   * @throws {Error} with message 'api.fetchCryptoPricesFailed' on failure
   */
  async getCryptoPrices(): Promise<CryptoCoin[]> {
    try {
      const cacheKey = 'crypto:prices';
      const cached = apiCache.get<CryptoCoin[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const ids = TOP_10_COIN_IDS.join(',');
      const params = new URLSearchParams({
        ids,
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_vol: 'true',
        include_24hr_change: 'true',
        order: 'market_cap_desc',
      });

      const response = await fetch(`${COINGECKO_API_BASE}/simple/price?${params}`);

      if (!response.ok) {
        throw new Error('api.fetchCryptoPricesFailed');
      }

      const data = await response.json();

      if (typeof data !== 'object' || data === null) {
        throw new Error('api.fetchCryptoPricesFailed');
      }

      const coins: CryptoCoin[] = TOP_10_COIN_IDS.map((id, rank) => {
        const coinData = data[id];
        const metadata = COIN_NAME_MAP[id];

        if (!coinData || !metadata) {
          return null;
        }

        return {
          id,
          name: metadata.name,
          symbol: metadata.symbol,
          image: metadata.image,
          currentPrice: coinData.usd ?? 0,
          change24h: coinData.usd_24h_change ?? 0,
          marketCap: coinData.usd_market_cap ?? 0,
          volume24h: coinData.usd_24h_vol ?? 0,
          rank: rank + 1,
        };
      }).filter((coin): coin is CryptoCoin => coin !== null);

      if (coins.length === 0) {
        throw new Error('api.fetchCryptoPricesFailed');
      }

      apiCache.set<CryptoCoin[]>(cacheKey, coins);
      return coins;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('api.')) {
        throw error;
      }
      throw new Error('api.fetchCryptoPricesFailed');
    }
  },

  /**
   * Fetch historical price data for a cryptocurrency
   * @param coinId - CoinGecko coin ID (e.g., 'bitcoin')
   * @param days - Number of days of history (1, 7, or 30)
   * @throws {Error} with message 'api.fetchPriceHistoryFailed' on failure
   */
  async getCryptoPriceHistory(coinId: string, days: number): Promise<CryptoPriceHistory> {
    try {
      // Validate days parameter
      if (![1, 7, 30].includes(days)) {
        throw new Error('api.fetchPriceHistoryFailed');
      }

      const cacheKey = `crypto:history:${coinId}:${days}`;
      const cached = apiCache.get<CryptoPriceHistory>(cacheKey);
      if (cached) {
        return cached;
      }

      const params = new URLSearchParams({
        vs_currency: 'usd',
        days: String(days),
      });

      const response = await fetch(`${COINGECKO_API_BASE}/coins/${encodeURIComponent(coinId)}/market_chart?${params}`);

      if (!response.ok) {
        throw new Error('api.fetchPriceHistoryFailed');
      }

      const data = await response.json();

      if (!Array.isArray(data.prices) || data.prices.length === 0) {
        throw new Error('api.fetchPriceHistoryFailed');
      }

      const history: CryptoPriceHistory = {
        prices: data.prices,
      };

      apiCache.set<CryptoPriceHistory>(cacheKey, history);
      return history;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('api.')) {
        throw error;
      }
      throw new Error('api.fetchPriceHistoryFailed');
    }
  },

  /**
   * Refresh cryptocurrency prices (clears cache and fetches fresh data)
   */
  async refreshPrices(): Promise<CryptoCoin[]> {
    apiCache.clear();
    return this.getCryptoPrices();
  },
};
