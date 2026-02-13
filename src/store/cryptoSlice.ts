import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CryptoState, CryptoCoin } from '../types/crypto';

const initialState: CryptoState = {
  coins: [],
  selectedCoinId: 'bitcoin',
  refreshInterval: 60000, // 1 minute default
  lastUpdated: null,
  loading: false,
  error: null,
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCrypto: (state, action: PayloadAction<CryptoCoin[]>) => {
      state.coins = action.payload;
      if (action.payload.length > 0) {
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      }
    },
    selectCoin: (state, action: PayloadAction<string>) => {
      state.selectedCoinId = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    setLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCrypto, selectCoin, setRefreshInterval, setLastUpdated, setLoading, setError } = cryptoSlice.actions;
export default cryptoSlice.reducer;
