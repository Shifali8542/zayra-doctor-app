import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  stSummaryRowToCase,
  summaryToDoctorStats,
  userProfileToDoctorView,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useDashboard = () => {
  const profileQ = useApi(() => api.auth.profile(), []);
  const summaryQ = useApi(() => api.stats.diagnosisSummary(), []);
  const stQ = useApi(() => api.assessments.stSummary(), []);

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
    const rows = stQ.data?.results ?? [];
    const now = Date.now();
    return rows.slice(0, 5).map((r) => stSummaryRowToCase(r, now));
  }, [stQ.data]);

  const loading = profileQ.loading || summaryQ.loading || stQ.loading;
  const error = profileQ.error || summaryQ.error || stQ.error;

  const refetch = async () => {
    await Promise.all([profileQ.refetch(), summaryQ.refetch(), stQ.refetch()]);
  };

  return {
    stats,
    profile,
    liveCases,
    pendingCount: liveCases.length,
    loading,
    error,
    refetch,
  };
};