import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { useApi } from '../../../utils/useApi';
import type { Severity } from '../../../types';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

export const useTraceView = (explicitPatientId?: number) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');

  const fallbackQ = useApi(
    () =>
      explicitPatientId
        ? Promise.resolve(null)
        : api.patients.list({ diagnosis: 'mi', page_size: 1 }),
    [explicitPatientId],
  );

  const patientId =
    explicitPatientId ?? fallbackQ.data?.results?.[0]?.id ?? undefined;

  const waveformQ = useApi(
    () =>
      patientId
        ? api.patients.waveform(patientId, { downsample: 4, channels: 'ii' })
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  const clinicalQ = useApi(
    () =>
      patientId
        ? api.patients.clinicalInfo(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  const detailQ = useApi(
    () =>
      patientId
        ? api.patients.detail(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)));
  }, []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const saveAnnotation = useCallback(() => {
    setAnnotation('');
  }, []);

  const caseItem: { caseId: string; datasetLabel: string; signalQ: string; severity: Severity } | null = useMemo(() => {
    const p = detailQ.data;
    if (!p) return null;
    const code = p.patient_code.replace(/\D/g, '').padStart(5, '0').slice(-5);
    const cls = p.diagnosis_class;
    const datasetLabel =
      p.dataset_source_display ||
      (p.dataset_source === 'ptb_xl'
        ? 'PTB-XL'
        : p.dataset_source === 'cpsc_2018'
          ? 'CPSC 2018'
          : p.dataset_source === 'georgia_12lead'
            ? 'Georgia 12-Lead'
            : p.dataset_source === 'ptb_diagnostic'
              ? 'PTB Diagnostic'
              : 'Unknown Dataset');
    return {
      caseId: `ZC-${code}`,
      datasetLabel,
      signalQ: 'Q—',
      severity:
        cls === 'mi' ? ('CRITICAL' as const)
        : cls === 'normal' ? ('ROUTINE' as const)
        : ('URGENT' as const),
    };
  }, [detailQ.data]);

  const rhythm = useMemo(() => {
    const a = clinicalQ.data?.ecg_analysis ?? {};
    return {
      rate: typeof a.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : 0,
      qrsWidth: typeof a.qrs_width_ms === 'number' ? Math.round(a.qrs_width_ms) : 0,
      qt: typeof a.qt_ms === 'number' ? Math.round(a.qt_ms) : 0,
      qtc: typeof a.qtc_ms === 'number' ? Math.round(a.qtc_ms) : 0,
      axis: typeof a.axis_deg === 'number' ? Math.round(a.axis_deg) : 0,
      bookmarks: [] as { label: string; offset: string }[],
    };
  }, [clinicalQ.data]);

  return {
    caseItem,
    rhythm,
    waveform: waveformQ.data,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    annotation,
    setAnnotation,
    saveAnnotation,
    loading: fallbackQ.loading || waveformQ.loading || clinicalQ.loading,
    error:
      patientId === undefined
        ? null
        : waveformQ.error || clinicalQ.error,
    refetch: async () => {
      await Promise.all([waveformQ.refetch(), clinicalQ.refetch(), detailQ.refetch()]);
    },
  };
};