/**
 * Lightweight useQuery-style hook for the centralized api.ts client.
 * Replace with @tanstack/react-query if you outgrow it.
 */

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

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setState((s) => ({ ...s, loading: false, error: message }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const setData = useCallback((next: T | null) => {
    setState((s) => ({ ...s, data: next }));
  }, []);

  return { ...state, refetch: load, setData };
};