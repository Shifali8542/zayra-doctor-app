import { RecordComparisonResponse } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (next: T | null) => void;
}

export const useApi = <T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseApiResult<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Prevent re-fetch if data is less than 60s old
  const lastFetchAt = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Reset cache timestamp whenever deps change so new dep values always fetch fresh
  useEffect(() => {
    lastFetchAt.current = 0;
  }, deps);

  const load = useCallback(async (force = false) => {
    if (!force && lastFetchAt.current > 0 && Date.now() - lastFetchAt.current < 60_000) {
      console.log('[useApi] skipping fetch — cache hit, age:', Math.round((Date.now() - lastFetchAt.current) / 1000), 's');
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      console.log('[useApi] fetching...');
      const data = await fetcherRef.current();
      if (!mountedRef.current) {
        console.log('[useApi] component unmounted before response — discarding');
        return;
      }
      lastFetchAt.current = Date.now();
      console.log('[useApi] fetch success');
      setState({ data, loading: false, error: null });
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof Error && err.message === 'No patient id') {
        setState({ data: null, loading: false, error: null });
        return;
      }
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.log('[useApi] fetch ERROR:', message);
      setState((s) => ({ ...s, loading: false, error: message }));
    }
  }, deps);

  useEffect(() => {
    load();
  }, deps);

  const setData = useCallback((next: T | null) => {
    setState((s) => ({ ...s, data: next }));
  }, []);

  const refetch = useCallback(() => load(true), [load]);
  return { ...state, refetch, setData };
};