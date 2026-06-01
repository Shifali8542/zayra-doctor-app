import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../api/api';
import { formatSignalQ } from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';
import { waveformCache } from '../waveformCache';
import type { CaseReview, Severity, WaveformResponse } from '../../../types';

export type TraceViewMode = 'strip' | '12lead';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const PICKER_PAGE_SIZE = 10;

export const useTraceView = (
  explicitPatientId?: number,
  initialRecordId?: number,
  caseId?: number,
) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>(
    initialRecordId,
  );
  const [waveformData, setWaveformData] = useState<WaveformResponse | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState('II');
  const [viewMode, setViewMode] = useState<TraceViewMode>('strip');

  // ── Case picker — shown when no patientId AND no caseId ───────────────────
  const showPicker = !explicitPatientId && !caseId;

  const [pickerMyCases, setPickerMyCases] = useState<CaseReview[]>([]);
  const [pickerLiveCases, setPickerLiveCases] = useState<CaseReview[]>([]);
  const [pickerMyCount, setPickerMyCount] = useState(0);
  const [pickerLiveCount, setPickerLiveCount] = useState(0);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerMyPage, setPickerMyPage] = useState(1);
  const [pickerLivePage, setPickerLivePage] = useState(1);

  useEffect(() => {
    if (!showPicker) return;
    setPickerLoading(true);
    Promise.all([
      api.cases.list({
        status: 'claimed',
        mine: true,
        page_size: PICKER_PAGE_SIZE,
        page: pickerMyPage,
      }),
      api.cases.list({
        status: 'live',
        page_size: PICKER_PAGE_SIZE,
        page: pickerLivePage,
      }),
    ])
      .then(([myRes, liveRes]) => {
        setPickerMyCases((prev) =>
          pickerMyPage === 1
            ? (myRes.results ?? [])
            : [...prev, ...(myRes.results ?? [])],
        );
        setPickerLiveCases((prev) =>
          pickerLivePage === 1
            ? (liveRes.results ?? [])
            : [...prev, ...(liveRes.results ?? [])],
        );
        setPickerMyCount(myRes.count ?? 0);
        setPickerLiveCount(liveRes.count ?? 0);
      })
      .catch(() => {})
      .finally(() => setPickerLoading(false));
  }, [showPicker, pickerMyPage, pickerLivePage]);

  // ── Resolve patientId from caseId when provided ───────────────────────────
  const caseDetailQ = useApi(
    () =>
      caseId
        ? api.cases.detailFull(caseId)
        : Promise.reject(new Error('no caseId')),
    [caseId],
  );

  const patientIdFromCase = caseDetailQ.data?.patient?.id;
  const patientId = explicitPatientId ?? patientIdFromCase ?? undefined;

  // ── Records index — lightweight DB call, no S3 ────────────────────────────
  const recordsIndexQ = useApi(
    () =>
      patientId
        ? api.patients.recordsIndex(patientId)
        : Promise.reject(new Error('no patientId')),
    [patientId],
  );

  // ── Active record ─────────────────────────────────────────────────────────
  const activeRecordId = useMemo(() => {
    if (selectedRecordId) return selectedRecordId;
    return recordsIndexQ.data?.records?.[0]?.id ?? undefined;
  }, [selectedRecordId, recordsIndexQ.data]);

  // ── Waveform fetch with session cache ─────────────────────────────────────
  // NOTE: No `channels` filter — backend uses mixed case per dataset
  // ('ii' PTB Diagnostic vs 'II' PTB-XL). Fetch all, pick best client-side.
  const activeRecordIdRef = useRef(activeRecordId);
  activeRecordIdRef.current = activeRecordId;

  useEffect(() => {
    if (!patientId || !activeRecordId) return;

    const cached = waveformCache.get(activeRecordId);
    if (cached) {
      setWaveformData(cached);
      setWaveformLoading(false);
      return;
    }

    setWaveformLoading(true);
    api.patients
      .waveform(patientId, { record_id: activeRecordId, downsample: 8 })
      .then((res) => {
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

  // Reset lead to II when record changes
  useEffect(() => {
    setSelectedLead('II');
  }, [activeRecordId]);

  // ── Clinical info ─────────────────────────────────────────────────────────
  const clinicalQ = useApi(
    () =>
      patientId && activeRecordId
        ? api.patients.clinicalInfo(patientId, { record_id: activeRecordId })
        : Promise.reject(new Error('no patientId')),
    [patientId, activeRecordId],
  );

  // ── Waveform analysis (wave intervals, beat counts) ───────────────────────
  const analysisQ = useApi(
    () =>
      patientId && activeRecordId
        ? api.patients.waveformAnalysis(patientId, { record_id: activeRecordId })
        : Promise.reject(new Error('no patientId')),
    [patientId, activeRecordId],
  );

  // ── Patient detail (header info) ──────────────────────────────────────────
  const detailQ = useApi(
    () =>
      patientId
        ? api.patients.detail(patientId)
        : Promise.reject(new Error('no patientId')),
    [patientId],
  );

  // ── Zoom / annotation helpers ─────────────────────────────────────────────
  const zoomIn  = useCallback(
    () => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2))),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2))),
    [],
  );
  const resetZoom = useCallback(() => setZoom(1), []);
  const saveAnnotation = useCallback(() => setAnnotation(''), []);

  const selectRecord = useCallback((id: number) => {
    setSelectedRecordId(id);
    setWaveformData(null);
    setWaveformLoading(true); // prevent "No signal" flash between records
    setZoom(1);
  }, []);

  const loadMoreMyCases   = useCallback(() => setPickerMyPage((p) => p + 1), []);
  const loadMoreLiveCases = useCallback(() => setPickerLivePage((p) => p + 1), []);

  // ── Case item view model ──────────────────────────────────────────────────
  const caseItem = useMemo(() => {
    const casePatient = caseDetailQ.data?.patient;
    const p = casePatient ?? detailQ.data;
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
    const caseCase = caseDetailQ.data?.case;
    return {
      caseId:       `ZC-${code}`,
      patientCode:  p.patient_code,
      age:          p.age,
      sex:          p.sex,
      diagnosis:    (p as any).display_diagnosis || (p as any).diagnosis,
      datasetLabel,
      signalQ:      formatSignalQ(clinicalQ.data?.ecg_analysis?.quality_score ?? null),
      severity:     (
        cls === 'mi' ? 'CRITICAL' : cls === 'normal' ? 'ROUTINE' : 'URGENT'
      ) as Severity,
      status:       caseCase?.status,
      heartRateBpm: caseCase?.heart_rate_bpm,
    };
  }, [caseDetailQ.data, detailQ.data]);

  // ── Rhythm summary ────────────────────────────────────────────────────────
  const rhythm = useMemo(() => {
    const a = clinicalQ.data?.ecg_analysis ?? {};
    return {
      rate:      typeof a.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : 0,
      qrsWidth:  typeof a.qrs_width_ms   === 'number' ? Math.round(a.qrs_width_ms)   : 0,
      qt:        typeof a.qt_ms          === 'number' ? Math.round(a.qt_ms)           : 0,
      qtc:       typeof a.qtc_ms         === 'number' ? Math.round(a.qtc_ms)          : 0,
      axis:      typeof a.axis_deg       === 'number' ? Math.round(a.axis_deg)        : 0,
      bookmarks: [] as { label: string; offset: string }[],
    };
  }, [clinicalQ.data]);

  // ── Available leads (from backend response) ────────────────────────────────
  const availableLeads = useMemo(() => {
    if (waveformData?.all_channel_names?.length) {
      return waveformData.all_channel_names;
    }
    return waveformData?.channel_names ?? ['II'];
  }, [waveformData]);

  // ── Primary samples — case-insensitive lead lookup ────────────────────────
  const primarySamples = useMemo(() => {
    if (!waveformData?.waveforms) return null;
    const w = waveformData.waveforms;
    return (
      w[selectedLead] ??
      w[selectedLead.toLowerCase()] ??
      w['II'] ??
      w['ii'] ??
      w['I']  ??
      w['i']  ??
      Object.values(w)[0] ??
      null
    );
  }, [waveformData, selectedLead]);

  // ── All lead samples for 12-lead grid ─────────────────────────────────────
  const allLeadSamples = useMemo(
    () => waveformData?.waveforms ?? {},
    [waveformData],
  );

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    // Case picker
    showPicker,
    pickerMyCases,
    pickerLiveCases,
    pickerMyCount,
    pickerLiveCount,
    pickerLoading,
    loadMoreMyCases,
    loadMoreLiveCases,
    hasMoreMyCases:   pickerMyCases.length < pickerMyCount,
    hasMoreLiveCases: pickerLiveCases.length < pickerLiveCount,

    // Case / patient info
    caseItem,
    rhythm,

    // Waveform data
    primarySamples,
    allLeadSamples,
    effectiveSamplingRate: waveformData?.effective_sampling_rate ?? 125,
    segments:              waveformData?.segments ?? {},
    waveformData,
    waveformLoading,

    // Lead selector
    selectedLead,
    setSelectedLead,
    availableLeads,

    // View mode (strip | 12lead)
    viewMode,
    setViewMode,

    // Record tabs
    records:           recordsIndexQ.data?.records ?? [],
    totalRecords:      recordsIndexQ.data?.total_records ?? 0,
    activeRecordId,
    activeRecordIndex: waveformData?.record_index ?? 0,
    selectRecord,

    // Waveform analysis card
    analysis:        analysisQ.data ?? null,
    analysisLoading: analysisQ.loading,

    // UI controls
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    annotation,
    setAnnotation,
    saveAnnotation,

    loading: (caseId ? caseDetailQ.loading : false) || recordsIndexQ.loading,
    error:   patientId === undefined ? null : clinicalQ.error,

    refetch: async () => {
      await Promise.all([
        clinicalQ.refetch(),
        detailQ.refetch(),
        recordsIndexQ.refetch(),
        analysisQ.refetch(),
        caseDetailQ.refetch(),
      ]);
    },
  };
};