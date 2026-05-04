import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  stSummaryToLifesavingMoments,
  summaryToImpactStats,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useImpact = () => {
  const summaryQ = useApi(() => api.stats.diagnosisSummary(), []);
  const stQ = useApi(() => api.assessments.stSummary(), []);

  const stats = useMemo(
    () => summaryToImpactStats(summaryQ.data, stQ.data),
    [summaryQ.data, stQ.data],
  );

  const moments = useMemo(
    () => stSummaryToLifesavingMoments(stQ.data),
    [stQ.data],
  );

  return {
    stats,
    moments,
    loading: summaryQ.loading || stQ.loading,
    error: summaryQ.error || stQ.error,
    refetch: async () => {
      await Promise.all([summaryQ.refetch(), stQ.refetch()]);
    },
  };
};