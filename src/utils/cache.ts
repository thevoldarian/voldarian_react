interface CacheEntry {
  data: unknown;
  timestamp: number;
}

class Cache {
  private cache = new Map<string, CacheEntry>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    try {
      return entry.data as T;
    } catch {
      this.cache.delete(key);
      return null;
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new Cache(5);
