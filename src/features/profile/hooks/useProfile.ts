import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { userProfileToDoctorView } from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

const FALLBACK_PROFILE = {
  name: 'Doctor',
  initials: 'DR',
  specialty: 'Cardiology',
  experienceYears: 0,
  city: '',
  licenseVerified: false,
  languages: ['English'],
  available: true,
  emergencyOnly: false,
  workingHours: 'Mon–Sat · 08:00 – 22:00',
  severityFilters: 'Critical · Urgent · Routine',
};

export const useProfile = () => {
  const profileQ = useApi(() => api.auth.profile(), []);

  const profile = useMemo(
    () =>
      profileQ.data ? userProfileToDoctorView(profileQ.data) : FALLBACK_PROFILE,
    [profileQ.data],
  );

  const [available, setAvailable] = useState(true);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [lockScreenAlerts, setLockScreenAlerts] = useState(true);
  const [hapticSound, setHapticSound] = useState(true);

  const toggleAvailable = useCallback(() => setAvailable((v) => !v), []);
  const toggleEmergency = useCallback(() => setEmergencyOnly((v) => !v), []);

  return {
    profile,
    available,
    emergencyOnly,
    lockScreenAlerts,
    hapticSound,
    toggleAvailable,
    toggleEmergency,
    setLockScreenAlerts,
    setHapticSound,
    loading: profileQ.loading,
    error: profileQ.error,
    refetch: profileQ.refetch,
  };
};