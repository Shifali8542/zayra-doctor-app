import type {
  AIAnalysisResult,
  AlynaMessageViewModel,
  CaseReview,
  CaseViewModel,
  ClinicalInfoResponse,
  DiagnosisClass,
  DoctorProfileViewModel,
  DoctorStatsViewModel,
  ImpactStatsViewModel,
  LifesavingMomentViewModel,
  PatientContextViewModel,
  PatientDetail,
  PatientListItem,
  PhysiologySnapshotViewModel,
  Severity,
  STStatus,
  STSummaryRow,
  TimelineEventViewModel,
  UserProfile,
} from '../types';

export const stStatusToSeverity = (status: STStatus): Severity => {
  switch (status) {
    case 'Critical - Possible STEMI':
      return 'CRITICAL';
    case 'Abnormal':
    case 'At Risk':
      return 'URGENT';
    case 'Normal':
    default:
      return 'ROUTINE';
  }
};

export const diagnosisClassToSeverity = (
  cls: DiagnosisClass | null | undefined,
): Severity => {
  switch (cls) {
    case 'mi':
      return 'CRITICAL';
    case 'mimic':
    case 'other':
      return 'URGENT';
    case 'normal':
    default:
      return 'ROUTINE';
  }
};

const sexToInitial = (sex: string | null | undefined): 'M' | 'F' | string => {
  if (!sex) return '—';
  const s = sex.trim().toLowerCase();
  if (s.startsWith('m')) return 'M';
  if (s.startsWith('f')) return 'F';
  return sex;
};

const formatCaseId = (patientCode: string): string => {
  const digits = patientCode.replace(/\D/g, '').padStart(5, '0').slice(-5);
  return `ZC-${digits}`;
};


// Returns a human-readable dataset label.
const formatDatasetLabel = (
  source: string | null | undefined,
  display: string | null | undefined,
): string => {
  if (display && display.trim()) return display;
  if (!source) return 'Unknown Dataset';
  switch (source) {
    case 'ptb_diagnostic':
      return 'PTB Diagnostic';
    case 'ptb_xl':
      return 'PTB-XL';
    case 'cpsc_2018':
      return 'CPSC 2018';
    case 'georgia_12lead':
      return 'Georgia 12-Lead';
    default:
      return source;
  }
};

const looksLikeCode = (s: string | null | undefined): boolean => {
  if (!s) return true;
  const trimmed = s.trim();
  if (!trimmed) return true;
  return /^[\d.,;\s]+$/.test(trimmed);
};

const pickReadableDiagnosis = (
  p: { display_diagnosis: string | null; diagnosis: string | null },
  fallback = 'Anomaly detected',
): string => {
  if (p.display_diagnosis && !looksLikeCode(p.display_diagnosis)) {
    return p.display_diagnosis;
  }
  if (p.diagnosis && !looksLikeCode(p.diagnosis)) {
    return p.diagnosis;
  }
  return fallback;
};

export const patientListItemToCase = (
  p: PatientListItem,
  opts: {
    ageMinutes?: number;
    viewing?: number;
    status?: 'live' | 'claimed' | 'completed';
  } = {},
): CaseViewModel => {
  const severity = diagnosisClassToSeverity(p.diagnosis_class);
  return {
    id: `${p.id}-list`,
    caseId: formatCaseId(p.patient_code),
    patientId: p.id,
    severity,
    anomaly: pickReadableDiagnosis(p),
    patientSex: sexToInitial(p.sex),
    patientAge: p.age ?? 0,
    patientCode: p.patient_code,
    hr: null,
    hrDelta: null,
    confidence: 0,
    signalQ: formatSignalQ(null),
    viewing: opts.viewing ?? 0,
    ageMinutes: opts.ageMinutes ?? 0,
    status: opts.status ?? 'live',
    datasetSource: p.dataset_source ?? undefined,
    datasetLabel: formatDatasetLabel(p.dataset_source, p.dataset_source_display),
  };
};

export const stSummaryRowToCase = (
  row: STSummaryRow,
  ageMinutesNow = Date.now(),
): CaseViewModel => {
  const severity = stStatusToSeverity(row.overall_status);
  const ageMinutes = Math.max(
    0,
    Math.round((ageMinutesNow - new Date(row.analyzed_at).getTime()) / 60000),
  );
  return {
    id: `${row.patient_id}-st`,
    caseId: formatCaseId(row.patient_code),
    patientId: row.patient_id,
    severity,
    anomaly: !looksLikeCode(row.diagnosis)
      ? (row.diagnosis as string)
      : `${row.affected_region.toUpperCase()} ST change`,
    patientSex: '—',
    patientAge: 0,
    patientCode: row.patient_code,
    hr: null,
    hrDelta: null,
    confidence: row.confidence_score ?? 0,
    signalQ: formatSignalQ(row.quality_score ?? null),
    ageMinutes,
    viewing: 0,
    status: 'live',
    datasetLabel: 'ST Analysis',
  };
};

export const caseReviewToViewModel = (c: CaseReview): CaseViewModel => {
  const severityMap: Record<string, CaseViewModel['severity']> = {
    critical: 'CRITICAL',
    urgent: 'URGENT',
    routine: 'URGENT',
    normal: 'ROUTINE',
  };
  const digits = c.patient_code.replace(/\D/g, '').padStart(5, '0').slice(-5);
  const ageMinutes = c.created_at
    ? Math.max(0, Math.round((Date.now() - new Date(c.created_at).getTime()) / 60000))
    : 0;
  return {
    id: `case-${c.id}`,
    caseId: `ZC-${digits}`,
    patientId: c.id,
    recordId: undefined,
    severity: severityMap[c.severity] ?? 'ROUTINE',
    anomaly: c.display_diagnosis || c.diagnosis || 'Anomaly detected',
    patientSex: c.sex ? (c.sex.toLowerCase().startsWith('m') ? 'M' : 'F') : '—',
    patientAge: c.age ?? 0,
    patientCode: c.patient_code,
    hr: c.heart_rate_bpm ?? null,
    hrDelta: null,
    confidence: c.confidence_score ?? 0,
    signalQ: formatSignalQ(null),
    viewing: 1,
    ageMinutes,
    status: (c.status === 'missed' || c.status === 'escalated' ? 'completed' : c.status) as CaseViewModel['status'],
    hrv: c.hrv_ms ?? null,
    datasetSource: c.dataset_source ?? undefined,
    datasetLabel: c.dataset_source_display || '—',
    doctorName: c.doctor_name ?? null,
    recordName: c.record_name ?? null,
    notes: c.notes ?? null,
  };
};

export const patientDetailToContext = (
  p: PatientDetail,
): PatientContextViewModel => {
  const extra = (p.extra_info || {}) as Record<string, unknown>;
  const comorbidities =
    p.diagnoses && p.diagnoses.length
      ? p.diagnoses.slice(0, 3).join(', ')
      : !looksLikeCode(p.diagnosis)
        ? (p.diagnosis as string)
        : '—';
  return {
    sex: sexToInitial(p.sex),
    age: p.age ?? 0,
    comorbidities,
    adherencePct: typeof extra.adherence_pct === 'number' ? extra.adherence_pct : 0,
    activity: typeof extra.activity === 'string' ? extra.activity : '—',
    sleep: typeof extra.sleep === 'string' ? extra.sleep : '—',
    dietPattern: typeof extra.diet === 'string' ? extra.diet : '—',
    smokingAlcohol:
      typeof extra.smoking_alcohol === 'string'
        ? extra.smoking_alcohol
        : '—',
  };
};

export const clinicalInfoToPhysiology = (
  info: ClinicalInfoResponse,
): PhysiologySnapshotViewModel => {
  const a = info.ecg_analysis ?? {};
  const hr =
    typeof a.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : null;
  const hrv = typeof a.hrv_ms === 'number' ? Math.round(a.hrv_ms) : null;
  return {
    pulse: { value: hr ?? 0, baseline: 0 },
    hrv: { value: hrv ?? 0, baseline: 0, unit: 'ms' },
    recovery: hr !== null && hr > 0 ? (hr > 110 ? 'Low' : hr > 90 ? 'Moderate' : 'High') : 'Moderate',
    recoveryNote: '—',
  };
};

export const aiAnalysisToTimeline = (
  ai?: AIAnalysisResult | null,
): TimelineEventViewModel[] => {
  // kept as fallback only — real data comes from caseHistoryToTimeline
  const events: TimelineEventViewModel[] = [];
  if (ai?.findings?.length) {
    (ai.findings).slice(0, 3).forEach((f, i) => {
      events.push({ when: `-${(i + 1) * 6}H`, description: f });
    });
  }
  return events;
};

// Maps real backend history[] (from /cases/:id/detail/) → timeline rows
export const caseHistoryToTimeline = (
  history: import('../types').CaseDetailFull['history'],
): TimelineEventViewModel[] => {
  if (!history?.length) return [];
  return history.map((h) => ({
    when: h.when
      ? new Date(h.when).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
      : '—',
    description: h.description,
    recordId: (h as any).record_id ?? undefined,
    recordName: (h as any).record_name ?? undefined,
    status: h.status,
    severity: (h as any).severity ?? undefined,
    heartRateBpm: (h as any).heart_rate_bpm ?? null,
    hrvMs: (h as any).hrv_ms ?? null,
    stStatus: (h as any).st_status ?? null,
    stemiSuspected: (h as any).stemi_suspected ?? null,
    doctorName: h.doctor_name ?? null,
  }));
};

export const aiAnalysisToAlynaSeed = (
  patientId: number,
  ai?: AIAnalysisResult | null,
): AlynaMessageViewModel[] => {
  // No Orinn result yet or analysis failed — show neutral intro with no confidence score.
  // Never fabricate a confidence value; omit it entirely so the UI renders no badge.
  if (!ai) {
    return [
      {
        id: 'm1',
        role: 'assistant',
        text: `I'm Alyna. I have full context on patient #${patientId}. Ask me anything about the rhythm, the patient timeline, or what changed from baseline.`,
        // confidence intentionally omitted — no real data available
      },
    ];
  }

  // risk_score is a real value from Orinn AI (0–100). Only attach it when present.
  const conf = ai.risk_score ?? undefined;
  const tags = (ai.findings ?? []).slice(0, 3);

  return [
    {
      id: 'm1',
      role: 'assistant',
      text: `I'm Alyna. I have full context on patient #${patientId}. Risk level: ${ai.risk_level ?? 'unknown'}. Ask me anything about the rhythm, timeline, or what changed from baseline.`,
      confidence: conf,
    },
    ...(ai.narrative
      ? [
        {
          id: 'm2',
          role: 'assistant' as const,
          text: ai.narrative,
          confidence: conf,
          tags,
        },
      ]
      : []),
  ];
};

export const formatSignalQ = (qualityScore: number | null | undefined): string => {
  if (qualityScore == null) return 'Q—';
  return `Q${Math.round(qualityScore)}`;
};

export const userProfileToDoctorView = (
  u: UserProfile,
): DoctorProfileViewModel => {
  const fullName = `${u.first_name} ${u.last_name}`.trim() || u.email;
  const initials = (
    (u.first_name?.[0] ?? u.email[0]) + (u.last_name?.[0] ?? '')
  ).toUpperCase();
  return {
    name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
    initials,
    specialty: u.specialization || '—',
    experienceYears: u.years_of_experience ?? 0,
    city: u.hospital_name || '—',
    licenseVerified: !!u.license_number,
    languages: [],
    available: false,
    emergencyOnly: false,
    workingHours: '—',
    severityFilters: '—',
  };
};

export const impactStatsToDoctorStats = (
  s: import('../types').ImpactStatsResponse | null,
): DoctorStatsViewModel => ({
  avgResponseSec: s?.avg_response_sec ?? 0,
  todayEarningsUsd: s?.reviewed_count ?? 0,
  confidencePct: s?.confidence_score ?? 0,
  streakDays: s?.streak_days ?? 0,
});

export const impactStatsToViewModel = (
  s: import('../types').ImpactStatsResponse | null,
): ImpactStatsViewModel => ({
  rankPct: s?.rank_pct ?? 0,
  totalDoctors: s?.total_doctors ?? 0,
  reviewed: s?.reviewed_count ?? 0,
  escalations: s?.escalated_count ?? 0,
  avgResponseSec: s?.avg_response_sec ?? 0,
  streakDays: s?.streak_days ?? 0,
  decisionConfidence: s?.confidence_score ?? 0,
  reliability: s?.reliability_pct ?? 0,
});

export const impactMomentsToViewModel = (
  response: import('../types').ImpactMomentsResponse | null,
): LifesavingMomentViewModel[] => {
  if (!response) return [];
  return response.moments.map((m) => ({
    when: m.when
      ? new Date(m.when).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
      : '—',
    description: m.description,
  }));
};
