import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, } from '../../../api/api';
import { caseHistoryToTimeline } from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';
import { waveformCache } from '../../traceview/waveformCache';
import type { BLEMIPrediction } from '../../../types';
import type {
  AIAnalysisResult,
  CaseDetailFull,
  CaseViewModel,
  ECGRecordComparison,
  ECGRecordHistoryItem,
  PatientContextViewModel,
  PhysiologySnapshotViewModel,
  STElevationResult,
  TimelineEventViewModel,
  WaveformResponse,
} from '../../../types';

export const useClaim = (caseId?: number) => {
  console.log('[useClaim] called with caseId:', caseId);
  const detailQ = useApi(
    () =>
      caseId
        ? api.cases.detailFull(caseId)
        : Promise.reject(new Error('No case id')),
    [caseId],
  );

  // Selected record
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  // Action mutation states 
  const [isActioning, setIsActioning] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Waveform state 
  const [waveformData, setWaveformData] = useState<WaveformResponse | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);

  const detail: CaseDetailFull | null = detailQ.data ?? null;
  const patientId = detail?.patient?.id;
  console.log('[useClaim] detail loading:', detailQ.loading, '| error:', detailQ.error, '| patientId:', patientId);

  // Active ECG record ID
  const currentRecordId = useMemo(
    () =>
      selectedRecordId ??
      detail?.records?.find((r) => r.is_current)?.id ??
      detail?.records?.[0]?.id,
    [selectedRecordId, detail],
  );

  // Waveform fetch 
  const recordIdRef = useRef(currentRecordId);
  recordIdRef.current = currentRecordId;

  useEffect(() => {
    if (!patientId || !currentRecordId) return;

    const cached = waveformCache.get(currentRecordId);
    if (cached) {
      setWaveformData(cached);
      setWaveformLoading(false);
      return;
    }

    setWaveformLoading(true);
    setWaveformData(null);

    api.patients
      .waveform(patientId, { record_id: currentRecordId, downsample: 8 })
      .then((res) => {
        if (recordIdRef.current === currentRecordId) {
          waveformCache.set(currentRecordId, res);
          setWaveformData(res);
          setWaveformLoading(false);
        }
      })
      .catch(() => {
        if (recordIdRef.current === currentRecordId) {
          setWaveformLoading(false);
        }
      });
  }, [patientId, currentRecordId]);

  // Primary samples — case-insensitive lead lookup
  const primarySamples = useMemo(() => {
    if (!waveformData?.waveforms) return null;
    const w = waveformData.waveforms;
    return (
      w['II']  ?? w['ii']  ??
      w['I']   ?? w['i']   ??
      Object.values(w)[0]  ?? null
    );
  }, [waveformData]);

  // Record switcher
  const handleSetSelectedRecordId = useCallback((id: number | null) => {
    setSelectedRecordId(id);
    setWaveformData(null);
    setWaveformLoading(true);
  }, []);

  const recordsQ = useApi<import('../../../types').PatientRecordsResponse>(
    () =>
      patientId
        ? api.patients.recordsHistory(patientId)
        : Promise.resolve({ patient_code: '', count: 0, records: [] } as import('../../../types').PatientRecordsResponse),
    [patientId],
  );

  const clinicalQ = useApi<import('../../../types').ClinicalInfoResponse>(
    () =>
      patientId && currentRecordId
        ? api.patients.clinicalInfo(patientId, { record_id: currentRecordId })
        : Promise.resolve(null as any),
    [patientId, currentRecordId],
  );

  const comparisonQ = useApi<import('../../../types').RecordComparisonResponse>(
    () =>
      patientId
        ? api.patients.recordComparison(patientId)
        : Promise.resolve({ patient_code: '', count: 0, records: [] } as import('../../../types').RecordComparisonResponse),
    [patientId],
  );

  const aiAnalysisQ = useApi<import('../../../types').AIAnalysisEnvelope>(
    () =>
      patientId && currentRecordId
        ? api.assessments.aiAnalysis(patientId, { record_id: currentRecordId })
        : Promise.resolve(null as any),
    [patientId, currentRecordId],
  );

  const stResultQ = useApi<{ patient: string; record: string; diagnosis: string | null; result: import('../../../types').STElevationResult }>(
    () =>
      patientId && currentRecordId
        ? new Promise((resolve) =>
            setTimeout(() =>
              api.assessments.stResult(patientId, currentRecordId).then(resolve), 2000))
        : Promise.resolve(null as any),
    [patientId, currentRecordId],
  );

  // View model: caseItem
  const caseItem: CaseViewModel | null = useMemo(() => {
    if (!detail) return null;
    const c = detail.case;
    const p = detail.patient;
    const v = detail.vitals;
    const digits = p.patient_code.replace(/\D/g, '').padStart(5, '0').slice(-5);
    const severityMap: Record<string, CaseViewModel['severity']> = {
      critical: 'CRITICAL', urgent: 'URGENT',
      routine: 'URGENT',   normal: 'ROUTINE',
    };
    return {
      id:         `case-${c.id}`,
      caseId:     `ZC-${digits}`,
      patientId:  p.id,
      recordId:   detail.records.find((r) => r.is_current)?.id,
      severity:   severityMap[c.severity] ?? 'ROUTINE',
      anomaly:    p.display_diagnosis || p.diagnosis || 'Anomaly detected',
      patientSex: p.sex ? (p.sex.toLowerCase().startsWith('m') ? 'M' : 'F') : '—',
      patientAge: p.age ?? 0,
      patientCode: p.patient_code,
      hr:         v.heart_rate_bpm ? Math.round(v.heart_rate_bpm) : null,
      hrDelta:    null,
      hrv:        v.hrv_ms ? Math.round(v.hrv_ms) : null,
      confidence: detail.orinn?.risk_score ?? c.confidence_score ?? 0,
      signalQ:    v.quality_score ? `Q${Math.round(v.quality_score)}` : 'Q—',
      viewing:    1,
      ageMinutes: c.created_at
        ? Math.round((Date.now() - new Date(c.created_at).getTime()) / 60000)
        : 0,
      status:      c.status as CaseViewModel['status'],
      datasetSource: p.dataset_source ?? undefined,
      datasetLabel:  p.dataset_source_display || '—',
      doctorName:    null,
      recordName:    null,
      notes:         null,
    };
  }, [detail]);

  // View model: patientContext
  const patientContext: PatientContextViewModel | null = useMemo(() => {
    if (!detail) return null;
    const p = detail.patient;
    const extra = p.extra_info ?? {};
    return {
      sex:           p.sex ?? '—',
      age:           p.age ?? 0,
      comorbidities: (extra.comorbidities as string) || '—',
      adherencePct:  (extra.adherence_pct as number) || 0,
      activity:      (extra.activity as string) || '—',
      sleep:         (extra.sleep as string) || '—',
      dietPattern:   (extra.diet_pattern as string) || '—',
      smokingAlcohol: (extra.smoking_alcohol as string) || '—',
    };
  }, [detail]);

  // View model: physiology
  const physiology: PhysiologySnapshotViewModel | null = useMemo(() => {
    const v = clinicalQ.data?.ecg_analysis ?? (clinicalQ.loading ? detail?.vitals : null);
    if (!v) return null;
    const hr = (v as any).heart_rate_bpm ?? 0;
    return {
      pulse:        { value: Math.round(hr), baseline: 0 },
      hrv:          { value: Math.round((v as any).hrv_ms ?? 0), baseline: 0, unit: 'ms' },
      recovery:     hr > 110 ? 'Low' : hr > 90 ? 'Moderate' : 'High',
      recoveryNote: (v as any).rhythm ?? '—',
    };
  }, [clinicalQ.data, detail]);

  // Timeline
  const timeline: TimelineEventViewModel[] = useMemo(
    () => caseHistoryToTimeline(detail?.history ?? []),
    [detail],
  );

  // Action mutations
  const claimCase = useCallback(async () => {
    if (!caseId) return;
    setIsActioning(true);
    setActionError(null);
    try {
      await api.cases.claim(caseId);
      await detailQ.refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to claim');
    } finally {
      setIsActioning(false);
    }
  }, [caseId, detailQ]);

  const completeCase = useCallback(async (notes: string) => {
    if (!caseId) return;
    setIsActioning(true);
    setActionError(null);
    try {
      await api.cases.complete(caseId, notes);
      await detailQ.refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to complete');
    } finally {
      setIsActioning(false);
    }
  }, [caseId, detailQ]);

  const escalateCase = useCallback(async (notes: string) => {
    if (!caseId) return;
    setIsActioning(true);
    setActionError(null);
    try {
      await api.cases.escalate(caseId, notes);
      await detailQ.refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to escalate');
    } finally {
      setIsActioning(false);
    }
  }, [caseId, detailQ]);

  // BLE predictions — poll every 30s for live MI predictions from this patient
  const patientCode = detail?.patient?.patient_code ?? null;
  const blePredictionsQ = useApi<import('../../../types').BLEMIPredictionListResponse>(
    () =>
      patientCode
        ? api.ble.getPredictions(patientCode, 10)
        : Promise.resolve({ count: 0, results: [] }),
    [patientCode],
  );

  // Return
  return {
    detail,
    caseItem,
    timeline,
    ecgRecords:        (recordsQ.data?.records ?? []) as ECGRecordHistoryItem[],
    comparisonRecords: (comparisonQ.data?.records ?? []) as ECGRecordComparison[],
    patientContext,
    physiology,

    // Record selection
    selectedRecordId,
    setSelectedRecordId: handleSetSelectedRecordId,
    currentRecordId,

    // Waveform
    primarySamples,
    waveformLoading,
    effectiveSamplingRate: waveformData?.effective_sampling_rate ?? 125,
    waveformGrid:          waveformData?.grid ?? null,

    // Loading / error
    clinicalLoading:   clinicalQ.loading,
    comparisonLoading: comparisonQ.loading,
    comparisonError:   comparisonQ.error,
    clinicalData:      clinicalQ.data,

    // Case data
    aiAnalysis:     detail?.orinn ?? null,
    stAnalysis:     detail?.st_analysis ?? null,
    allDiagnoses:   detail?.patient?.all_diagnoses ?? [],
    records:        detail?.records ?? [],
    caseStatus:     detail?.case?.status ?? null,
    caseCreatedAt:  detail?.case?.created_at ?? null,

    // Mutations
    claimCase,
    completeCase,
    escalateCase,
    isActioning,
    actionError,

    blePredictions: (blePredictionsQ.data?.results ?? []) as BLEMIPrediction[],
    blePredictionsLoading: blePredictionsQ.loading,

    loading: detailQ.loading,
    error:   detailQ.error,
    refetch: async () => {
      await Promise.all([
        detailQ.refetch(),
        recordsQ.refetch(),
        comparisonQ.refetch(),
        aiAnalysisQ.refetch(),
        stResultQ.refetch(),
      ]);
    },
  };
};