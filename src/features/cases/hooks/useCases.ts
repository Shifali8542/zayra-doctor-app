import { useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { patientListItemToCase } from '../../../api/adapters';
import type { CaseViewModel, CasesTab, PatientListItem } from '../../../types';
import { useApi } from '../../../utils/useApi';

export const useCases = () => {
  const [activeTab, setActiveTab] = useState<CasesTab>('live');

  const liveQ = useApi(
    () => api.patients.list({ diagnosis: 'mi', page_size: 10 }),
    [],
  );
  const claimedQ = useApi(
    () => api.patients.list({ diagnosis: 'mimic', page_size: 10 }),
    [],
  );
  const completedQ = useApi(
    () => api.patients.list({ diagnosis: 'normal', page_size: 10 }),
    [],
  );

  const adapt = (
    items: { results: PatientListItem[] } | null,
    status: 'live' | 'claimed' | 'completed',
  ): CaseViewModel[] =>
    (items?.results ?? []).map((p) => patientListItemToCase(p, { status }));

  const data = useMemo<CaseViewModel[]>(() => {
    switch (activeTab) {
      case 'live':
        return adapt(liveQ.data, 'live');
      case 'claimed':
        return adapt(claimedQ.data, 'claimed');
      case 'completed':
        return adapt(completedQ.data, 'completed');
    }
  }, [activeTab, liveQ.data, claimedQ.data, completedQ.data]);

  const counts = useMemo(
    () => ({
      live: liveQ.data?.count ?? 0,
      claimed: claimedQ.data?.count ?? 0,
      completed: completedQ.data?.count ?? 0,
    }),
    [liveQ.data, claimedQ.data, completedQ.data],
  );

  const loading =
    activeTab === 'live'
      ? liveQ.loading
      : activeTab === 'claimed'
        ? claimedQ.loading
        : completedQ.loading;

  const error =
    activeTab === 'live'
      ? liveQ.error
      : activeTab === 'claimed'
        ? claimedQ.error
        : completedQ.error;

  const findById = (id: string): CaseViewModel | undefined =>
    [
      ...adapt(liveQ.data, 'live'),
      ...adapt(claimedQ.data, 'claimed'),
      ...adapt(completedQ.data, 'completed'),
    ].find((c) => c.id === id || c.caseId === id);

  return {
    activeTab,
    setActiveTab,
    data,
    counts,
    loading,
    error,
    findById,
    refetch: async () => {
      await Promise.all([
        liveQ.refetch(),
        claimedQ.refetch(),
        completedQ.refetch(),
      ]);
    },
  };
};