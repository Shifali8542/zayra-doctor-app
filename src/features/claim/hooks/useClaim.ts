import { useMemo } from 'react';
import { api } from '../../../api/api';
import {
  aiAnalysisToTimeline,
  clinicalInfoToPhysiology,
  diagnosisClassToSeverity,
  patientDetailToContext,
  patientListItemToCase,
} from '../../../api/adapters';
import { useApi } from '../../../utils/useApi';
import type {
  CaseViewModel,
  PatientContextViewModel,
  PhysiologySnapshotViewModel,
  TimelineEventViewModel,
} from '../../../types';

const fallbackCase: CaseViewModel = {
  id: 'placeholder',
  caseId: 'ZC-00000',
  patientId: 0,
  severity: 'ROUTINE',
  anomaly: 'Loading…',
  patientSex: '—',
  patientAge: 0,
  patientCode: '',
  hr: null,
  spo2: null,
  confidence: 0,
  signalQ: 'Q—',
  viewing: 0,
  ageMinutes: 0,
  status: 'live',
  datasetLabel: ''
};

const fallbackContext: PatientContextViewModel = {
  sex: '—',
  age: 0,
  comorbidities: '—',
  adherencePct: 0,
  activity: '—',
  sleep: '—',
  dietPattern: '—',
  smokingAlcohol: '—',
};

const fallbackPhysiology: PhysiologySnapshotViewModel = {
  pulse: { value: 0, baseline: 78 },
  hrv: { value: 0, baseline: 48, unit: 'ms' },
  spo2: { value: 0, baseline: 97 },
  recovery: 'Moderate',
  recoveryNote: '—',
};

export const useClaim = (patientId?: number) => {
  const detailQ = useApi(
    () =>
      patientId
        ? api.patients.detail(patientId)
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

  const aiQ = useApi(
    () =>
      patientId
        ? api.assessments.aiAnalysis(patientId)
        : Promise.reject(new Error('No patient id')),
    [patientId],
  );

  const caseItem: CaseViewModel = useMemo(() => {
    const p = detailQ.data;
    if (!p) return fallbackCase;
    const base = patientListItemToCase(p);
    const a = clinicalQ.data?.ecg_analysis;
    return {
      ...base,
      severity: diagnosisClassToSeverity(p.diagnosis_class),
      hr: typeof a?.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : base.hr,
      hrv: typeof a?.hrv_ms === 'number' ? Math.round(a.hrv_ms) : null,
      confidence: aiQ.data?.analysis.risk_score ?? base.confidence,
    };
  }, [detailQ.data, clinicalQ.data, aiQ.data]);

  const patientContext: PatientContextViewModel = useMemo(
    () => (detailQ.data ? patientDetailToContext(detailQ.data) : fallbackContext),
    [detailQ.data],
  );

  const physiology: PhysiologySnapshotViewModel = useMemo(
    () =>
      clinicalQ.data
        ? clinicalInfoToPhysiology(clinicalQ.data)
        : fallbackPhysiology,
    [clinicalQ.data],
  );

  const timeline: TimelineEventViewModel[] = useMemo(
    () => aiAnalysisToTimeline(aiQ.data?.analysis),
    [aiQ.data],
  );

  const aiAnalysis = aiQ.data?.analysis ?? null;

  const loading = detailQ.loading || clinicalQ.loading;
  const error = detailQ.error || clinicalQ.error || aiQ.error;

  return {
    caseItem,
    timeline,
    patientContext,
    physiology,
    aiAnalysis,
    anomalyDetails: clinicalQ.data?.ecg_analysis,
    loading,
    error,
    refetch: async () => {
      await Promise.all([detailQ.refetch(), clinicalQ.refetch(), aiQ.refetch()]);
    },
  };
};