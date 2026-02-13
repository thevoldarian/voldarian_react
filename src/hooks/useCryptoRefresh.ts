import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';

interface UseCryptoRefreshResult {
  start: () => void;
  stop: () => void;
}

/**
 * Hook to manage auto-refresh interval for cryptocurrency data
 * Calls refetchFn at the configured refresh interval from Redux state
 */
export const useCryptoRefresh = (refetchFn: () => Promise<void>): UseCryptoRefreshResult => {
  const refreshInterval = useAppSelector(state => state.crypto.refreshInterval);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(true);

  // Wrap refetchFn to avoid dependency changes breaking the interval
  const refetchRef = useRef(refetchFn);
  useEffect(() => {
    refetchRef.current = refetchFn;
  }, [refetchFn]);

  // Setup and manage the interval
  useEffect(() => {
    if (!isRunningRef.current) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Create new interval
    intervalRef.current = setInterval(() => {
      refetchRef.current().catch(err => {
        console.error('Auto-refresh failed:', err);
      });
    }, refreshInterval);

    // Cleanup on unmount or interval change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshInterval]);

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      intervalRef.current = setInterval(() => {
        refetchRef.current().catch(err => {
          console.error('Auto-refresh failed:', err);
        });
      }, refreshInterval);
    }
  }, [refreshInterval]);

  const stop = useCallback(() => {
    if (isRunningRef.current && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      isRunningRef.current = false;
    }
  }, []);

  return {
    start,
    stop,
  };
};
