import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  impactMomentsToViewModel,
  impactStatsToViewModel,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useImpact = () => {
  const statsQ = useApi(() => api.impact.stats(), []);
  const momentsQ = useApi(() => api.impact.moments(), []);

  const stats = useMemo(
    () => impactStatsToViewModel(statsQ.data),
    [statsQ.data],
  );

  const moments = useMemo(
    () => impactMomentsToViewModel(momentsQ.data),
    [momentsQ.data],
  );

  return {
    stats,
    moments,
    loading: statsQ.loading || momentsQ.loading,
    error: statsQ.error || momentsQ.error,
    refetch: async () => {
      await Promise.all([statsQ.refetch(), momentsQ.refetch()]);
    },
  };
};