/**
 * src/types/index.ts
 * ==================================================================
 * SINGLE SOURCE OF TRUTH for every TypeScript interface used in the app.
 * Backend response shapes match Django REST Framework serializers exactly.
 * ==================================================================
 */

import type { ViewStyle, TextStyle } from 'react-native';

/* ── 1. Auth ─────────────────────────────────────────────────────── */

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiError {
  detail?: string;
  [field: string]: unknown;
}

/* ── 2. User profile (matches users/serializers.py) ─────────────── */

export type UserRole = 'doctor' | 'patient' | 'admin' | 'nurse';

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  specialization: string | null;
  license_number: string | null;
  hospital_name: string | null;
  years_of_experience: number | null;
  qualification: string | null;
  is_doctor: boolean;
  is_patient: boolean;
  patient_count?: number;
  ecg_record_count?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: UserProfile;
  access: string;
  refresh: string;
}

export interface DoctorRegistrationRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  specialization?: string;
  license_number?: string;
  hospital_name?: string;
  years_of_experience?: number;
  qualification?: string;
}

/* ── 3. Patient + ECG records ───────────────────────────────────── */

export type DatasetSource =
  | 'ptb_diagnostic'
  | 'ptb_xl'
  | 'cpsc_2018'
  | 'georgia_12lead';

export type DiagnosisClass = 'normal' | 'mi' | 'mimic' | 'other';
export type ECGSplit = 'train' | 'validation' | 'test';

export interface ECGRecord {
  id: number;
  record_name: string;
  sampling_rate: number | null;
  num_channels: number | null;
  channel_names: string[] | null;
  num_samples: number | null;
  duration_seconds: number | null;
  split: ECGSplit | null;
}

export interface PatientListItem {
  id: number;
  patient_code: string;
  age: number | null;
  sex: string | null;
  diagnosis: string | null;
  diagnosis_class: DiagnosisClass | null;
  record_count: number;
  dataset_source: DatasetSource | null;
  dataset_source_display: string;
  display_diagnosis: string | null;
}

export interface PatientDetail extends PatientListItem {
  extra_info: Record<string, unknown>;
  ecg_records: ECGRecord[];
  diagnoses: string[];
  dataset_source_display: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* ── 4. Waveform / Clinical info ─────────────────────────────────── */

export interface WaveformGrid {
  paper_speed_mm_per_sec: number;
  amplitude_mm_per_mv: number;
  small_box_ms: number;
  large_box_ms: number;
  small_box_mv: number;
  large_box_mv: number;
}

export interface WaveformResponse {
  patient_code: string;
  record_name: string;
  diagnosis: string | null;
  age: number | null;
  sex: string | null;
  sampling_rate: number;
  effective_sampling_rate: number;
  num_samples: number;
  duration_seconds: number | null;
  channel_names: string[];
  units: string[];
  waveforms: Record<string, number[]>;
  grid: WaveformGrid;
  recommended_display_seconds: number;
}

export interface EcgAnalysis {
  heart_rate_bpm?: number | null;
  rhythm?: string | null;
  hrv_ms?: number | null;
  qrs_width_ms?: number | null;
  qt_ms?: number | null;
  qtc_ms?: number | null;
  axis_deg?: number | null;
  pr_interval_ms?: number | null;
  st_elevation_mm?: number | null;
  error?: string;
  [k: string]: unknown;
}

export interface ClinicalInfoResponse {
  patient_code: string;
  record_name: string;
  demographics: {
    age: number | null;
    sex: string | null;
    diagnosis: string | null;
  };
  clinical_summary: Record<string, unknown>;
  ecg_analysis: EcgAnalysis;
  record_info: {
    sampling_rate: number | null;
    num_channels: number | null;
    duration_seconds: number | null;
    channel_names: string[] | null;
  };
  diagnoses: string[];
}

/* ── 5. AI Analysis + ST-Elevation ──────────────────────────────── */

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface AIAnalysisResult {
  id: number;
  risk_level: RiskLevel | null;
  risk_score: number | null;
  findings: string[];
  differential: string[];
  narrative: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface AIAnalysisEnvelope {
  source: 'cache' | 'orinn';
  analysis: AIAnalysisResult;
}

export type STStatus =
  | 'Normal'
  | 'At Risk'
  | 'Abnormal'
  | 'Critical - Possible STEMI';

export type STRegion =
  | 'anterior'
  | 'inferior'
  | 'lateral'
  | 'posterior'
  | 'septal'
  | 'diffuse'
  | 'none';

export interface STLeadResult {
  lead: string;
  elevation_mm: number | null;
  status: string;
  note: string;
  beats_measured: number;
}

export interface STElevationResult {
  id: number;
  overall_status: STStatus;
  overall_status_note: string;
  stemi_suspected: boolean;
  affected_region: STRegion;
  lead_results: STLeadResult[];
  reciprocal_leads: string[];
  reciprocal_note: string;
  confidence_score: number;
  data_source: string;
  analyzed_at: string;
  updated_at: string;
}

export interface STSummaryRow {
  patient_id: number;
  patient_code: string;
  record_name: string;
  diagnosis: string | null;
  overall_status: STStatus;
  stemi_suspected: boolean;
  affected_region: STRegion;
  confidence_score: number;
  analyzed_at: string;
}

export interface STSummaryResponse {
  total_analyzed: number;
  stemi_count: number;
  status_breakdown: { overall_status: STStatus; count: number }[];
  results: STSummaryRow[];
}

/* ── 6. Stats ───────────────────────────────────────────────────── */

export interface DiagnosisSummaryResponse {
  total_patients: number;
  total_records: number;
  by_diagnosis: { diagnosis: string | null; count: number }[];
  diagnosis_class_stats: Record<DiagnosisClass, number>;
}

export interface SplitStatsResponse {
  ecg_records: {
    total: number;
    train: { count: number; percent: number };
    validation: { count: number; percent: number };
    test: { count: number; percent: number };
    unassigned: number;
  };
  patient_diagnosis_classes: Record<DiagnosisClass, number>;
  per_dataset: {
    source: DatasetSource;
    source_display: string;
    patient_count: number;
    record_count: number;
    train: number;
    validation: number;
    test: number;
  }[];
}

export interface DatasetOverviewResponse {
  datasets: {
    source: DatasetSource;
    source_display: string;
    patient_count: number;
    record_count: number;
    classes: Record<DiagnosisClass, { count: number; percent: number }>;
  }[];
  grand_total_patients: number;
  grand_total_records: number;
}

/* ── 7. UI view models ──────────────────────────────────────────── */

export type Severity = 'CRITICAL' | 'URGENT' | 'ROUTINE';

export interface CaseViewModel {
  id: string;
  caseId: string;
  patientId: number;
  recordId?: number;
  severity: Severity;
  anomaly: string;
  patientSex: 'M' | 'F' | string;
  patientAge: number;
  patientCode: string;
  hr: number | null;
  hrDelta?: number | null;
  spo2: number | null;
  confidence: number;
  signalQ: string;
  viewing: number;
  ageMinutes: number;
  status: 'live' | 'claimed' | 'completed';
  hrv?: number | null;
  datasetSource?: DatasetSource | null;
  datasetLabel: string;
}

export interface DoctorStatsViewModel {
  avgResponseSec: number;
  todayEarningsUsd: number;
  confidencePct: number;
  streakDays: number;
}

export interface ImpactStatsViewModel {
  rankPct: number;
  totalDoctors: number;
  reviewed: number;
  escalations: number;
  avgResponseSec: number;
  streakDays: number;
  decisionConfidence: number;
  reliability: number;
}

export interface LifesavingMomentViewModel {
  when: string;
  description: string;
}

export interface DoctorProfileViewModel {
  name: string;
  initials: string;
  specialty: string;
  experienceYears: number;
  city: string;
  licenseVerified: boolean;
  languages: string[];
  available: boolean;
  emergencyOnly: boolean;
  workingHours: string;
  severityFilters: string;
}

export interface TimelineEventViewModel {
  when: string;
  description: string;
}

export interface AlynaMessageViewModel {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  confidence?: number;
  tags?: string[];
}

export interface PatientContextViewModel {
  sex: 'M' | 'F' | string;
  age: number;
  comorbidities: string;
  adherencePct: number;
  activity: string;
  sleep: string;
  dietPattern: string;
  smokingAlcohol: string;
}

export interface PhysiologySnapshotViewModel {
  pulse: { value: number; baseline: number };
  hrv: { value: number; baseline: number; unit: string };
  spo2: { value: number; baseline: number };
  recovery: 'Low' | 'Moderate' | 'High';
  recoveryNote: string;
}

/* ── 8. Component-local types ───────────────────────────────────── */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type IconName =
  | 'pulse' | 'pulse-line' | 'bell' | 'chevron-right' | 'chevron-left'
  | 'clock' | 'eye' | 'bolt' | 'trending-up' | 'activity' | 'cases'
  | 'trace' | 'sparkle' | 'trophy' | 'heart' | 'drop' | 'phone'
  | 'stethoscope' | 'check-circle' | 'close-circle' | 'alert-triangle'
  | 'arrow-up-right' | 'arrow-right' | 'send' | 'search' | 'share'
  | 'bookmark' | 'book' | 'plus' | 'minus' | 'expand' | 'check'
  | 'shield' | 'shield-check' | 'flame' | 'medal' | 'sun' | 'moon'
  | 'arrow-down';

export type CasesTab = 'live' | 'claimed' | 'completed';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  ClaimDetail: { patientId?: number };
  Profile: undefined;
};

export type AppTabsParamList = {
  PulseDesk: undefined;
  Cases: undefined;
  TraceView: { patientId?: number } | undefined;
  Alyna: { patientId?: number } | undefined;
  Impact: undefined;
};

/* ── 9. Theme ───────────────────────────────────────────────────── */

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  divider: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnDark: string;
  textOnDarkSubtle: string;
  textOnDarkMuted: string;
  primary: string;
  primaryHover: string;
  accent: string;
  accentSoft: string;
  heroGradientFrom: string;
  heroGradientMid: string;
  heroGradientTo: string;
  glassFill: string;
  glassBorder: string;
  success: string;
  warning: string;
  danger: string;
  pulseRed: string;
  severityCritical: string;
  severityUrgent: string;
  severityRoutine: string;
  tabBarBg: string;
  tabIconActive: string;
  tabIconInactive: string;
  tabActiveBg: string;
  avatarGradientFrom: string;
  avatarGradientTo: string;
}

export type StyleSheetStyles<T> = { [K in keyof T]: ViewStyle | TextStyle };
export type DeviceType = 'mobile' | 'tablet' | 'desktop';