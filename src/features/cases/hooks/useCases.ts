import { useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { caseReviewToViewModel } from '../../../api/adapters';
import type { CaseReview, CaseViewModel, CasesTab } from '../../../types';
import { useApi } from '../../../utils/useApi';

export const useCases = () => {
  const [activeTab, setActiveTab] = useState<CasesTab>('live');

  const liveQ      = useApi(() => api.cases.list({ status: 'live',      page_size: 20 }), []);
  const claimedQ   = useApi(() => api.cases.list({ status: 'claimed',   page_size: 20 }), []);
  const completedQ = useApi(() => api.cases.list({ status: 'completed', page_size: 20 }), []);
  const missedQ    = useApi(() => api.cases.list({ status: 'missed',    page_size: 20 }), []);
  const escalatedQ = useApi(() => api.cases.list({ status: 'escalated', page_size: 20 }), []);

  const adapt = (items: { results: CaseReview[] } | null): CaseViewModel[] =>
    (items?.results ?? []).map(caseReviewToViewModel);

  const data = useMemo<CaseViewModel[]>(() => {
    switch (activeTab) {
      case 'live':      return adapt(liveQ.data);
      case 'claimed':   return adapt(claimedQ.data);
      case 'completed': return adapt(completedQ.data);
      case 'missed':    return adapt(missedQ.data);
      case 'escalated': return adapt(escalatedQ.data);
    }
  }, [activeTab, liveQ.data, claimedQ.data, completedQ.data, missedQ.data, escalatedQ.data]);

  const counts = useMemo(() => ({
    live:      liveQ.data?.count      ?? 0,
    claimed:   claimedQ.data?.count   ?? 0,
    completed: completedQ.data?.count ?? 0,
    missed:    missedQ.data?.count    ?? 0,
    escalated: escalatedQ.data?.count ?? 0,
  }), [liveQ.data, claimedQ.data, completedQ.data, missedQ.data, escalatedQ.data]);

  const activeQ = {
    live: liveQ, claimed: claimedQ, completed: completedQ,
    missed: missedQ, escalated: escalatedQ,
  }[activeTab];

  return {
    activeTab,
    setActiveTab,
    data,
    counts,
    loading: activeQ.loading,
    error:   activeQ.error,
    findById: (id: string): CaseViewModel | undefined =>
      [
        ...adapt(liveQ.data), ...adapt(claimedQ.data), ...adapt(completedQ.data),
        ...adapt(missedQ.data), ...adapt(escalatedQ.data),
      ].find((c) => c.id === id || c.caseId === id),
    refetch: async () => {
      await Promise.all([
        liveQ.refetch(), claimedQ.refetch(), completedQ.refetch(),
        missedQ.refetch(), escalatedQ.refetch(),
      ]);
    },
  };
};