import { useMemo, useState } from 'react';
import { api } from '../../../api/api';
import {
  caseHistoryToTimeline,
  clinicalInfoToPhysiology,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';
import type {
  CaseDetailFull,
  CaseViewModel,
  ECGRecordHistoryItem,
  PatientContextViewModel,
  PhysiologySnapshotViewModel,
  TimelineEventViewModel,
} from '../../../types';

const fallbackCase: CaseViewModel = null as unknown as CaseViewModel;

const fallbackContext: PatientContextViewModel | null = null;

const fallbackPhysiology: PhysiologySnapshotViewModel | null = null;

export const useClaim = (caseId?: number) => {
  // Single call — replaces 3 separate calls
  const detailQ = useApi(
    () =>
      caseId
        ? api.cases.detailFull(caseId)
        : Promise.reject(new Error('No case id')),
    [caseId],
  );

  // Selected record id — null means current case record (default)
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  const detail: CaseDetailFull | null = detailQ.data ?? null;

  // Records enriched history — loaded once patient is known
  const patientId = detail?.patient?.id;
  const recordsQ = useApi(
    () =>
      patientId
        ? api.patients.recordsHistory(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  // Per-record waveform/clinical — only fetched when doctor switches record
  const activeRecordId = selectedRecordId ?? detail?.case?.id ?? undefined;
  const clinicalQ = useApi(
    () =>
      patientId && selectedRecordId
        ? api.patients.clinicalInfo(patientId, { record_id: selectedRecordId })
        : Promise.reject(new Error('no switch yet')),
    [patientId, selectedRecordId],
  );

  // ── View model assembly 
const caseItem: CaseViewModel | null = useMemo(() => {
    if (!detail) return null;
    const c = detail.case;
    const p = detail.patient;
    const v = detail.vitals;
    const digits = p.patient_code.replace(/\D/g, '').padStart(5, '0').slice(-5);
    const severityMap: Record<string, CaseViewModel['severity']> = {
      critical: 'CRITICAL', urgent: 'URGENT',
      routine: 'URGENT', normal: 'ROUTINE',
    };
    return {
      id: `case-${c.id}`,
      caseId: `ZC-${digits}`,
      patientId: p.id,
      recordId: detail.records.find((r) => r.is_current)?.id,
      severity: severityMap[c.severity] ?? 'ROUTINE',
      anomaly: p.display_diagnosis || p.diagnosis || 'Anomaly detected',
      patientSex: p.sex ? (p.sex.toLowerCase().startsWith('m') ? 'M' : 'F') : '—',
      patientAge: p.age ?? 0,
      patientCode: p.patient_code,
      hr: v.heart_rate_bpm ? Math.round(v.heart_rate_bpm) : null,
      hrv: v.hrv_ms ? Math.round(v.hrv_ms) : null,
      spo2: null,
      confidence: detail.orinn?.risk_score ?? c.confidence_score ?? 0,
      signalQ: v.quality_score ? `Q${Math.round(v.quality_score)}` : 'Q—',
      viewing: 1,
      ageMinutes: c.created_at
        ? Math.round((Date.now() - new Date(c.created_at).getTime()) / 60000)
        : 0,
      status: c.status as CaseViewModel['status'],
      datasetSource: p.dataset_source,
      datasetLabel: p.dataset_source_display || '—',
    };
  }, [detail]);

  const patientContext: PatientContextViewModel | null = useMemo(() => {
    if (!detail) return null;
    const p = detail.patient;
    const extra = p.extra_info ?? {};
    return {
      sex: p.sex ?? '—',
      age: p.age ?? 0,
      comorbidities: (extra.comorbidities as string) || '—',
      adherencePct: (extra.adherence_pct as number) || 0,
      activity: (extra.activity as string) || '—',
      sleep: (extra.sleep as string) || '—',
      dietPattern: (extra.diet_pattern as string) || '—',
      smokingAlcohol: (extra.smoking_alcohol as string) || '—',
    };
  }, [detail]);

  const physiology: PhysiologySnapshotViewModel | null = useMemo(() => {
    const v = clinicalQ.data?.ecg_analysis ?? detail?.vitals;
    if (!v) return null;
    const hr = (v as any).heart_rate_bpm;
    return {
      pulse: { value: Math.round(hr ?? 0), baseline: 0 },
      hrv: { value: Math.round((v as any).hrv_ms ?? 0), baseline: 0, unit: 'ms' },
      spo2: { value: 0, baseline: 0 },
      recovery: hr > 110 ? 'Low' : hr > 90 ? 'Moderate' : 'High',
      recoveryNote: (v as any).rhythm ?? '—',
    };
  }, [clinicalQ.data, detail]);

  // Real history timeline from backend — one row per case review event
  const timeline: TimelineEventViewModel[] = useMemo(
    () => caseHistoryToTimeline(detail?.history ?? []),
    [detail],
  );

  // ECG records with enriched ST/AI/HR per record
  const ecgRecords: ECGRecordHistoryItem[] = recordsQ.data?.records ?? [];

  return {
    caseItem,
    timeline,
    ecgRecords,
    patientContext,
    physiology,
    selectedRecordId,
    setSelectedRecordId,
    aiAnalysis: detail?.orinn ?? null,
    stAnalysis: detail?.st_analysis ?? null,
    allDiagnoses: detail?.patient?.all_diagnoses ?? [],
    records: detail?.records ?? [],
    loading: detailQ.loading,
    error: detailQ.error,
    refetch: async () => {
      await Promise.all([detailQ.refetch(), recordsQ.refetch()]);
    },
  };
};