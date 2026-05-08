import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { userProfileToDoctorView } from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';

const FALLBACK_PROFILE = null;

export const useProfile = () => {
  const profileQ = useApi(() => api.auth.profile(), []);

  const profile = useMemo(
    () =>
      profileQ.data ? userProfileToDoctorView(profileQ.data) : null,
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