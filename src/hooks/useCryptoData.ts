import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCrypto, setLoading, setError } from '../store/cryptoSlice';
import { cryptoService } from '../services/cryptoService';
import type { CryptoCoin } from '../types/crypto';

interface UseCryptoDataResult {
  coins: CryptoCoin[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage cryptocurrency data
 * Fetches top 10 coins from CoinGecko API and stores in Redux
 */
export const useCryptoData = (): UseCryptoDataResult => {
  const { t } = useTranslation('errors');
  const dispatch = useAppDispatch();
  const coins = useAppSelector(state => state.crypto.coins);
  const loading = useAppSelector(state => state.crypto.loading);
  const error = useAppSelector(state => state.crypto.error);

  const refetch = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const cryptoData = await cryptoService.getCryptoPrices();
      dispatch(setCrypto(cryptoData));
      dispatch(setError(null));
    } catch (err) {
      const errorMessage = err instanceof Error ? t(`${err.message}`) : t('api.fetchCryptoPricesFailed');
      dispatch(setError(errorMessage));
      dispatch(setCrypto([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, t]);

  return { coins, loading, error, refetch };
};
