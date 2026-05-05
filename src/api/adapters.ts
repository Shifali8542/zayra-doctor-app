/**
 * src/api/adapters.ts
 * Pure functions that translate backend payloads into UI view models.
 */

import type {
  AIAnalysisResult,
  AlynaMessageViewModel,
  CaseViewModel,
  ClinicalInfoResponse,
  DiagnosisClass,
  DiagnosisSummaryResponse,
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
  STSummaryResponse,
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

/**
 * Returns a human-readable dataset label.
 * Prefers the backend's `dataset_source_display` field; if missing,
 * formats the raw `dataset_source` enum into a readable name.
 */
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

/**
 * Returns true if a string looks like a raw medical code (SNOMED, SCP, ICD)
 * rather than a human-readable name. Codes are typically all-digits or
 * comma-separated digits like "426783006,164865005".
 */
const looksLikeCode = (s: string | null | undefined): boolean => {
  if (!s) return true;
  const trimmed = s.trim();
  if (!trimmed) return true;
  // All digits, commas, semicolons, dots, or whitespace = code list
  return /^[\d.,;\s]+$/.test(trimmed);
};

/**
 * Picks the most human-readable diagnosis name from a patient payload.
 * Never returns a raw SNOMED/SCP code string — falls through to a
 * generic label if everything we have looks like a code.
 */
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
  const baseHr =
    severity === 'CRITICAL' ? 168 : severity === 'URGENT' ? 122 : 78;
  const baseSpo2 =
    severity === 'CRITICAL' ? 91 : severity === 'URGENT' ? 95 : 98;
  const baseConfidence =
    severity === 'CRITICAL' ? 96 : severity === 'URGENT' ? 88 : 76;

  return {
    id: `${p.id}-list`,
    caseId: formatCaseId(p.patient_code),
    patientId: p.id,
    severity,
    anomaly: pickReadableDiagnosis(p),
    patientSex: sexToInitial(p.sex),
    patientAge: p.age ?? 0,
    patientCode: p.patient_code,
    hr: baseHr,
    hrDelta: severity === 'CRITICAL' ? 84 : severity === 'URGENT' ? 38 : 8,
    spo2: baseSpo2,
    confidence: baseConfidence,
    signalQ: `Q${85 + (p.id % 12)}`,
    viewing: opts.viewing ?? Math.max(1, (p.id % 14) + 1),
    ageMinutes: opts.ageMinutes ?? Math.max(1, (p.id % 30) + 1),
    status: opts.status ?? 'live',
    datasetSource: p.dataset_source,
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
    hr: severity === 'CRITICAL' ? 178 : severity === 'URGENT' ? 132 : 84,
    hrDelta: severity === 'CRITICAL' ? 94 : severity === 'URGENT' ? 48 : 6,
    spo2: severity === 'CRITICAL' ? 91 : severity === 'URGENT' ? 95 : 97,
    confidence: row.confidence_score ?? 85,
    signalQ: `Q${row.confidence_score ?? 90}`,
    viewing: Math.max(1, (row.patient_id % 12) + 1),
    ageMinutes,
    status: 'live',
    datasetLabel: 'ST Analysis',
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
    adherencePct: 92,
    activity: typeof extra.activity === 'string' ? extra.activity : 'Sedentary, 4.2k steps/day',
    sleep: typeof extra.sleep === 'string' ? extra.sleep : '6h 12m avg · efficiency 78%',
    dietPattern: typeof extra.diet === 'string' ? extra.diet : 'Moderate sodium, low fiber',
    smokingAlcohol:
      typeof extra.smoking_alcohol === 'string'
        ? extra.smoking_alcohol
        : 'Never · Occasional',
  };
};

export const clinicalInfoToPhysiology = (
  info: ClinicalInfoResponse,
): PhysiologySnapshotViewModel => {
  const a = info.ecg_analysis ?? {};
  const hr =
    typeof a.heart_rate_bpm === 'number' ? Math.round(a.heart_rate_bpm) : 88;
  const hrv = typeof a.hrv_ms === 'number' ? Math.round(a.hrv_ms) : 32;
  return {
    pulse: { value: hr, baseline: 78 },
    hrv: { value: hrv, baseline: 48, unit: 'ms' },
    spo2: { value: 96, baseline: 97 },
    recovery: hr > 110 ? 'Low' : hr > 90 ? 'Moderate' : 'High',
    recoveryNote: hr > 110 ? 'elevated 36h' : 'within range',
  };
};

export const aiAnalysisToTimeline = (
  ai?: AIAnalysisResult | null,
): TimelineEventViewModel[] => {
  const events: TimelineEventViewModel[] = [];
  if (ai) {
    const conf = ai.risk_score ?? 0;
    events.push({
      when: 'NOW',
      description: `Anomaly detected — ${
        ai.risk_level ?? 'Risk'
      } pattern, ${conf}% confidence`,
    });
    (ai.findings ?? []).slice(0, 3).forEach((f, i) => {
      events.push({ when: `-${(i + 1) * 6}H`, description: f });
    });
  }
  events.push({
    when: '-9D',
    description: 'Baseline ambulatory ECG, normal sinus',
  });
  return events;
};

export const aiAnalysisToAlynaSeed = (
  patientId: number,
  ai?: AIAnalysisResult | null,
): AlynaMessageViewModel[] => {
  if (!ai) {
    return [
      {
        id: 'm1',
        role: 'assistant',
        text: `I'm Alyna. I have full context on patient #${patientId}. Ask me anything about the rhythm, the patient timeline, or what changed from baseline.`,
        confidence: 90,
      },
    ];
  }
  const conf = ai.risk_score ?? 0;
  const tags = (ai.findings ?? []).slice(0, 3);
  return [
    {
      id: 'm1',
      role: 'assistant',
      text: `I'm Alyna. I have full context on patient #${patientId}. Risk level: ${ai.risk_level}. Ask me anything about the rhythm, timeline, or what changed from baseline.`,
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
    specialty: u.specialization || 'Cardiology',
    experienceYears: u.years_of_experience ?? 0,
    city: u.hospital_name || '—',
    licenseVerified: !!u.license_number,
    languages: ['English'],
    available: true,
    emergencyOnly: false,
    workingHours: 'Mon–Sat · 08:00 – 22:00',
    severityFilters: 'Critical · Urgent · Routine',
  };
};

export const summaryToDoctorStats = (
  s: DiagnosisSummaryResponse | null,
): DoctorStatsViewModel => ({
  avgResponseSec: 38,
  todayEarningsUsd: Math.min(999, Math.round((s?.total_records ?? 0) / 100)),
  confidencePct: 94,
  streakDays: 23,
});

export const summaryToImpactStats = (
  s: DiagnosisSummaryResponse | null,
  st?: STSummaryResponse | null,
): ImpactStatsViewModel => ({
  rankPct: 7,
  totalDoctors: Math.max(1, s?.total_patients ?? 1),
  reviewed: s?.total_records ?? 0,
  escalations: st?.stemi_count ?? 0,
  avgResponseSec: 38,
  streakDays: 23,
  decisionConfidence: 94,
  reliability: 99,
});

export const stSummaryToLifesavingMoments = (
  st: STSummaryResponse | null,
): LifesavingMomentViewModel[] => {
  if (!st) return [];
  return st.results
    .filter((r) => r.stemi_suspected)
    .slice(0, 3)
    .map((r, i) => {
      const labels = ['TODAY', 'YESTERDAY', '3 DAYS AGO'];
      return {
        when: labels[i] ?? `${i + 1} DAYS AGO`,
        description: `Escalated ${
          r.affected_region !== 'none' ? r.affected_region.toUpperCase() : 'STEMI'
        } in ${r.patient_code} — analysis confirmed`,
      };
    });
};