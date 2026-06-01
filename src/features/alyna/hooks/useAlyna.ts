import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../../api/api';
import type { AlynaMessageViewModel } from '../../../types';

interface UseAlynaOptions {
  patientId?: number;
  caseId?: number;
}

export const useAlyna = (opts: UseAlynaOptions = {}) => {
  const [messages,    setMessages]    = useState<AlynaMessageViewModel[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [draft,       setDraft]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const hasFetchedHistory             = useRef(false);

  // ── Load history once on mount ────────────────────────────────────────────
  useEffect(() => {
    if (hasFetchedHistory.current) return;
    hasFetchedHistory.current = true;

    api.alyna
      .history({ patient_id: opts.patientId, case_id: opts.caseId })
      .then((history) => {
        const mapped: AlynaMessageViewModel[] = history.map((m) => ({
          id:          String(m.id),
          role:        m.role,
          text:        m.text,
          suggestions: m.suggestions,
        }));
        setMessages(mapped);

        // Restore last assistant suggestions
        const lastAssistant = [...mapped].reverse().find((m) => m.role === 'assistant');
        if (lastAssistant?.suggestions?.length) {
          setSuggestions(lastAssistant.suggestions);
        }
      })
      .catch(() => {
        // Silent — fresh conversation starts
      });
  }, [opts.patientId, opts.caseId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const send = useCallback(
    async (text?: string) => {
      const value = (text ?? draft).trim();
      if (!value || loading) return;

      const userMsg: AlynaMessageViewModel = {
        id:   `u-${Date.now()}`,
        role: 'user',
        text: value,
      };
      setMessages((prev) => [...prev, userMsg]);
      setDraft('');
      setSuggestions([]);
      setLoading(true);
      setError(null);

      try {
        const response = await api.alyna.chat(value, {
          patient_id: opts.patientId,
          case_id:    opts.caseId,
        });

        const assistantMsg: AlynaMessageViewModel = {
          id:          `a-${response.message_id}`,
          role:        'assistant',
          text:        response.reply,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setSuggestions(response.suggestions ?? []);
      } catch (err) {
        setError('Alyna is unavailable. Please try again.');
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setLoading(false);
      }
    },
    [draft, loading, opts.patientId, opts.caseId],
  );

  // ── Clear conversation ────────────────────────────────────────────────────
  const clear = useCallback(async () => {
    await api.alyna.clear().catch(() => {});
    setMessages([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    messages,
    suggestions,
    draft,
    setDraft,
    send,
    clear,
    loading,
    error,
  };
};