import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  caseReviewToViewModel,
  summaryToDoctorStats,
  userProfileToDoctorView,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useDashboard = () => {
  const profileQ = useApi(() => api.auth.profile(), []);
  const summaryQ = useApi(() => api.stats.diagnosisSummary(), []);
  const casesQ = useApi(
    () => api.cases.list({ status: 'live', page_size: 5 }),
    [],
  );
  const stats = useMemo(
    () => summaryToDoctorStats(summaryQ.data),
    [summaryQ.data],
  );

  const profile = useMemo(
    () =>
      profileQ.data
        ? userProfileToDoctorView(profileQ.data)
        : {
            name: 'Doctor',
            initials: 'DR',
            specialty: 'Cardiology',
            experienceYears: 0,
            city: '',
            licenseVerified: false,
            languages: [],
            available: true,
            emergencyOnly: false,
            workingHours: '',
            severityFilters: '',
          },
    [profileQ.data],
  );

  const liveCases = useMemo(() => {
    const rows = casesQ.data?.results ?? [];
    return rows.map(caseReviewToViewModel);
  }, [casesQ.data]);

  const loading = profileQ.loading || summaryQ.loading || casesQ.loading;
  const error = profileQ.error || summaryQ.error || casesQ.error;

  const refetch = async () => {
    await Promise.all([profileQ.refetch(), summaryQ.refetch(), casesQ.refetch()]);
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