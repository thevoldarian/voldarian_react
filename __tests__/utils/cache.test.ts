import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiCache } from '../../src/utils/cache';

describe('apiCache', () => {
  const CACHE_TTL_MS = 5 * 60 * 1000;
  const TIME_AFTER_TTL_EXPIRES = 6 * 60 * 1000;
  const TIME_BEFORE_TTL_EXPIRES = 4 * 60 * 1000;

  beforeEach(() => {
    apiCache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves data', () => {
    apiCache.set('test', { value: 'data' });
    expect(apiCache.get('test')).toEqual({ value: 'data' });
  });

  it('returns null for non-existent keys', () => {
    expect(apiCache.get('nonexistent')).toBeNull();
  });

  it('expires data after TTL', () => {
    apiCache.set('test', { value: 'data' });
    
    vi.advanceTimersByTime(TIME_AFTER_TTL_EXPIRES);
    
    expect(apiCache.get('test')).toBeNull();
  });

  it('returns data before TTL expires', () => {
    apiCache.set('test', { value: 'data' });
    
    vi.advanceTimersByTime(TIME_BEFORE_TTL_EXPIRES);
    
    expect(apiCache.get('test')).toEqual({ value: 'data' });
  });

  it('clears all cached data', () => {
    apiCache.set('test1', { value: 'data1' });
    apiCache.set('test2', { value: 'data2' });
    
    apiCache.clear();
    
    expect(apiCache.get('test1')).toBeNull();
    expect(apiCache.get('test2')).toBeNull();
  });
});
