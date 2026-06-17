/**
 * useEarnings.ts
 * Fetches real completed cases from the backend API for the Earnings screen.
 * Summary/chart data uses mock values matching the doctor web.
 */
import { useMemo } from 'react';
import { api } from '../../../api/api';
import { caseReviewToViewModel } from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useEarnings = () => {
  const completedQ = useApi(
    () => api.earnings.getCompleted({ page_size: 50 }),
    [],
  );

  const completedCases = useMemo(
    () => (completedQ.data?.results ?? []).map(caseReviewToViewModel),
    [completedQ.data],
  );

  return {
    completedCases,
    loading: completedQ.loading,
    error: completedQ.error,
    refetch: completedQ.refetch,
  };
};
