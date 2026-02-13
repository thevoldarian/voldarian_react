import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCryptoRefresh } from '../../src/hooks/useCryptoRefresh';
import cryptoReducer from '../../src/store/cryptoSlice';

const mockRefetchFn = vi.fn();

describe('useCryptoRefresh', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    store = configureStore({
      reducer: { crypto: cryptoReducer },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('initializes and sets up interval on mount', () => {
    mockRefetchFn.mockResolvedValueOnce(undefined);

    renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    // Should start interval automatically, first call happens after configured interval
    expect(mockRefetchFn).not.toHaveBeenCalled();
  });

  it('calls refetch function at configured intervals', async () => {
    mockRefetchFn.mockResolvedValueOnce(undefined);

    const { unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    // Advance time to trigger the first interval call (default 60s from Redux state)
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockRefetchFn).toHaveBeenCalled();

    unmount();
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('restarts interval when refresh interval changes', async () => {
    mockRefetchFn.mockResolvedValue(undefined);

    const { unmount, rerender } = renderHook(
      () => useCryptoRefresh(mockRefetchFn),
      { wrapper }
    );

    // Verify initial setup
    expect(mockRefetchFn).not.toHaveBeenCalled();

    // Advance some time
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    // Update Redux store with new interval through a store dispatch action
    act(() => {
      store.dispatch({
        type: 'crypto/setRefreshInterval',
        payload: 30000,
      });
    });

    rerender();

    // Now the interval should be shorter
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    // Should have been called at the new interval
    expect(mockRefetchFn).toHaveBeenCalled();

    unmount();
  });

  it('handles refetch function errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRefetchFn.mockRejectedValueOnce(new Error('Fetch failed'));

    const { unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Auto-refresh failed:', expect.any(Error));

    consoleErrorSpy.mockRestore();
    unmount();
  });

  it('returns start and stop functions', () => {
    const { result } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    expect(typeof result.current.start).toBe('function');
    expect(typeof result.current.stop).toBe('function');
  });

  it('start function begins refreshing', async () => {
    mockRefetchFn.mockResolvedValue(undefined);

    const { result, unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    // Call start
    act(() => {
      result.current.start();
    });

    // Advance time
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockRefetchFn).toHaveBeenCalled();

    unmount();
  });

  it('stop function stops refreshing', async () => {
    mockRefetchFn.mockResolvedValue(undefined);

    const { result, unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    // Call stop
    act(() => {
      result.current.stop();
    });

    // Advance time - should not trigger refetch
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockRefetchFn).not.toHaveBeenCalled();

    unmount();
  });

  it('handles multiple calls to start and stop', async () => {
    mockRefetchFn.mockResolvedValue(undefined);

    const { result, unmount } = renderHook(() => useCryptoRefresh(mockRefetchFn), { wrapper });

    act(() => {
      result.current.stop();
      result.current.stop(); // Multiple stops should not error
    });

    act(() => {
      result.current.start();
      result.current.start(); // Multiple starts should not error
    });

    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockRefetchFn).toHaveBeenCalled();

    unmount();
  });
});
