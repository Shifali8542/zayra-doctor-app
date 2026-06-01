import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { aiAnalysisToAlynaSeed } from '../../../api/adapters';
import type { AlynaMessageViewModel } from '../../../types';

export const useAlyna = (explicitPatientId?: number) => {
  const [messages, setMessages] = useState<AlynaMessageViewModel[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedPatientId, setResolvedPatientId] = useState<number | undefined>(
    explicitPatientId,
  );

  useEffect(() => {
    if (explicitPatientId) {
      setResolvedPatientId(explicitPatientId);
      return;
    }
    let cancelled = false;
    api.patients
      .list({ diagnosis: 'mi', page_size: 1 })
      .then((res) => {
        if (cancelled) return;
        setResolvedPatientId(res.results?.[0]?.id);
      })
      .catch(() => {
        if (cancelled) return;
        setResolvedPatientId(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [explicitPatientId]);

  const patientId = resolvedPatientId;

  useEffect(() => {
    let cancelled = false;
    if (!patientId) {
      setMessages(aiAnalysisToAlynaSeed(0, null));
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);
    api.assessments
      .aiAnalysis(patientId)
      .then((env) => {
        if (cancelled) return;
        setMessages(aiAnalysisToAlynaSeed(patientId, env.analysis));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setMessages(aiAnalysisToAlynaSeed(patientId, null));
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const send = useCallback(
    (text?: string) => {
      const value = (text ?? draft).trim();
      if (!value) return;
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', text: value },
      ]);
      setDraft('');

      if (!patientId) return;

      setLoading(true);
      api.assessments
        .aiAnalysis(patientId, { refresh: true })
        .then((env) => {
          const a = env.analysis;
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text:
                a.narrative ??
                a.recommendation ??
                'I have no additional information at this time.',
              confidence: a.risk_score ?? undefined,
              tags: (a.findings ?? []).slice(0, 3),
            },
          ]);
        })
        .catch((err: Error) => {
          setError(err.message);
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text: 'I could not reach the analysis service right now. Please try again.',
            },
          ]);
        })
        .finally(() => setLoading(false));
    },
    [draft, patientId],
  );

  return {
    messages,
    draft,
    setDraft,
    send,
    loading,
    error,
  };
};