import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../api/api';
import { useApi } from '../../../utils/useApi';
import { waveformCache } from '../waveformCache';
import type { Severity, WaveformResponse } from '../../../types';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

export const useTraceView = (
  explicitPatientId?: number,
  initialRecordId?: number,
) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>(initialRecordId);
  const [waveformData, setWaveformData] = useState<WaveformResponse | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);

  // Fallback: find first MI patient if no patientId passed
  const fallbackQ = useApi(
    () =>
      explicitPatientId
        ? Promise.resolve(null)
        : api.patients.list({ diagnosis: 'mi', page_size: 1 }),
    [explicitPatientId],
  );

  const patientId = explicitPatientId ?? fallbackQ.data?.results?.[0]?.id ?? undefined;

  // Lightweight tab data — DB only, instant, no S3
  const recordsIndexQ = useApi(
    () =>
      patientId
        ? api.patients.recordsIndex(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  // Active record: use selected, else first from index
  const activeRecordId = useMemo(() => {
    if (selectedRecordId) return selectedRecordId;
    return recordsIndexQ.data?.records?.[0]?.id ?? undefined;
  }, [selectedRecordId, recordsIndexQ.data]);

  // Waveform fetch with session cache — S3 only on first view per record
  const activeRecordIdRef = useRef(activeRecordId);
  activeRecordIdRef.current = activeRecordId;

  useEffect(() => {
    if (!patientId || !activeRecordId) return;

    // Serve from cache if already fetched this session
    const cached = waveformCache.get(activeRecordId);
    if (cached) {
      setWaveformData(cached);
      setWaveformLoading(false);
      return;
    }

    setWaveformLoading(true);
    api.patients
      .waveform(patientId, { record_id: activeRecordId, downsample: 8, channels: 'ii' })
      .then((res) => {
        // Only update state if this record is still active
        if (activeRecordIdRef.current === activeRecordId) {
          waveformCache.set(activeRecordId, res);
          setWaveformData(res);
          setWaveformLoading(false);
        }
      })
      .catch(() => {
        if (activeRecordIdRef.current === activeRecordId) {
          setWaveformLoading(false);
        }
      });
  }, [patientId, activeRecordId]);

  // Clinical info — DB cache, fast
  const clinicalQ = useApi(
    () =>
      patientId && activeRecordId
        ? api.patients.clinicalInfo(patientId, { record_id: activeRecordId })
        : Promise.reject(new Error('No patient id')),
    [patientId, activeRecordId],
  );

  // Patient detail for header
  const detailQ = useApi(
    () =>
      patientId
        ? api.patients.detail(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2))), []);
  const resetZoom = useCallback(() => setZoom(1), []);
  const saveAnnotation = useCallback(() => setAnnotation(''), []);
  const selectRecord = useCallback((id: number) => setSelectedRecordId(id), []);

  const caseItem = useMemo(() => {
    const p = detailQ.data;
    if (!p) return null;
    const code = p.patient_code.replace(/\D/g, '').padStart(5, '0').slice(-5);
    const cls = p.diagnosis_class;
    const datasetLabel = p.dataset_source_display ||
      (p.dataset_source === 'ptb_xl' ? 'PTB-XL'
        : p.dataset_source === 'cpsc_2018' ? 'CPSC 2018'
        : p.dataset_source === 'georgia_12lead' ? 'Georgia 12-Lead'
        : p.dataset_source === 'ptb_diagnostic' ? 'PTB Diagnostic'
        : 'Unknown Dataset');
    return {
      caseId: `ZC-${code}`,
      datasetLabel,
      signalQ: 'Q—',
      severity: (cls === 'mi' ? 'CRITICAL' : cls === 'normal' ? 'ROUTINE' : 'URGENT') as Severity,
    };
  }, [detailQ.data]);

  const rhythm = useMemo(() => {
    const a = clinicalQ.data?.ecg_analysis ?? {};
    return {
      rate:     typeof a.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : 0,
      qrsWidth: typeof a.qrs_width_ms   === 'number' ? Math.round(a.qrs_width_ms)   : 0,
      qt:       typeof a.qt_ms          === 'number' ? Math.round(a.qt_ms)           : 0,
      qtc:      typeof a.qtc_ms         === 'number' ? Math.round(a.qtc_ms)          : 0,
      axis:     typeof a.axis_deg       === 'number' ? Math.round(a.axis_deg)        : 0,
      bookmarks: [] as { label: string; offset: string }[],
    };
  }, [clinicalQ.data]);

  return {
    caseItem,
    rhythm,
    // Waveform
    waveformData:          waveformData?.waveforms?.['ii'] ?? null,
    effectiveSamplingRate: waveformData?.effective_sampling_rate ?? 125,
    segments:              waveformData?.segments ?? {},
    // Tabs
    records:        recordsIndexQ.data?.records ?? [],
    totalRecords:   recordsIndexQ.data?.total_records ?? 0,
    activeRecordId,
    activeRecordIndex: waveformData?.record_index ?? 0,
    selectRecord,
    // UI
    zoom, zoomIn, zoomOut, resetZoom,
    annotation, setAnnotation, saveAnnotation,
    waveformLoading,
    loading: fallbackQ.loading || recordsIndexQ.loading,
    error:   patientId === undefined ? null : clinicalQ.error,
    refetch: async () => {
      await Promise.all([clinicalQ.refetch(), detailQ.refetch(), recordsIndexQ.refetch()]);
    },
  };
};