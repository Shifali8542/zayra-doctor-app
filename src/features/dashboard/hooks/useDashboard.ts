import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  caseReviewToViewModel,
  impactStatsToDoctorStats,
  userProfileToDoctorView,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useDashboard = () => {
  const profileQ  = useApi(() => api.auth.profile(), []);
  const impactQ   = useApi(() => api.impact.stats(), []);
  const casesQ    = useApi(
    () => api.cases.list({ status: 'live', page_size: 3 }),
    [],
  );
  const stats = useMemo(
    () => impactStatsToDoctorStats(impactQ.data),
    [impactQ.data],
  );

  const profile = useMemo(
    () =>
      profileQ.data
        ? userProfileToDoctorView(profileQ.data)
        : null,
    [profileQ.data],
  );

  const liveCases = useMemo(() => {
    const rows = casesQ.data?.results ?? [];
    return rows.map(caseReviewToViewModel);
  }, [casesQ.data]);

  const loading = profileQ.loading || impactQ.loading || casesQ.loading;
  const error   = profileQ.error   || impactQ.error   || casesQ.error;

  const refetch = async () => {
    await Promise.all([profileQ.refetch(), impactQ.refetch(), casesQ.refetch()]);
  };

  return {
    stats,
    profile,
    liveCases,
    pendingCount: casesQ.data?.count ?? liveCases.length,
    loading,
    error,
    refetch,
  };
};