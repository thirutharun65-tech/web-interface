import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/types';

interface NewsState {
  data: Article[];
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, { data: Article[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useNews(
  fetcher: () => Promise<Article[]>,
  deps: unknown[] = [],
  options: { cacheKey?: string } = {}
): NewsState & { refetch: () => void } {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCount, setRefetchCount] = useState(0);

  const cacheKey = options.cacheKey || '';

  const refetch = useCallback(() => setRefetchCount((c) => c + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cacheKey) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setData(cached.data);
          setLoading(false);
          setError(null);
          return;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (cancelled) return;
        setData(result);
        if (cacheKey) {
          cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'UNKNOWN';
        if (msg === 'NO_API_KEY') {
          setError('NO_API_KEY');
        } else if (msg === 'RATE_LIMIT') {
          setError('RATE_LIMIT');
        } else if (msg === 'INVALID_KEY') {
          setError('INVALID_KEY');
        } else {
          setError('API_ERROR');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refetchCount]);

  return { data, loading, error, refetch };
}
