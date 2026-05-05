import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  patientListItemToCase,
  summaryToDoctorStats,
  userProfileToDoctorView,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

export const useDashboard = () => {
  const profileQ = useApi(() => api.auth.profile(), []);
  const summaryQ = useApi(() => api.stats.diagnosisSummary(), []);
  const patientsQ = useApi(
    () => api.patients.list({ diagnosis: 'mi', page_size: 5 }),
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
    const rows = patientsQ.data?.results ?? [];
    return rows.map((p) => patientListItemToCase(p, { status: 'live' }));
  }, [patientsQ.data]);

  const loading = profileQ.loading || summaryQ.loading || patientsQ.loading;
  const error = profileQ.error || summaryQ.error || patientsQ.error;

  const refetch = async () => {
    await Promise.all([profileQ.refetch(), summaryQ.refetch(), patientsQ.refetch()]);
  };

  return {
    stats,
    profile,
    liveCases,
    pendingCount: summaryQ.data?.diagnosis_class_stats?.mi ?? liveCases.length,
    loading,
    error,
    refetch,
  };
};