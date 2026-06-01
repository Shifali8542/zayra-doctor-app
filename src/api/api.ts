import type {
  AIAnalysisEnvelope,
  AlynaChatResponse,
  AlynaHistoryMessage,
  AuthTokens,
  CaseDetailFull,
  CaseReview,
  ClinicalInfoResponse,
  DatasetOverviewResponse,
  DoctorRegistrationRequest,
  ImpactMomentsResponse,
  ImpactStatsResponse,
  LoginRequest,
  LoginResponse,
  Paginated,
  PatientDetail,
  PatientListItem,
  SplitStatsResponse,
  STElevationResult,
  STSummaryResponse,
  UserProfile,
  WaveformResponse,
} from '../types';

export const API_BASE_URL = 'http://192.168.1.172:8000/api/v1';

export const ENDPOINTS = {
  // Auth
  login: '/auth/login/',
  logout: '/auth/logout/',
  registerDoctor: '/auth/register/doctor/',
  registerPatient: '/auth/register/user/',
  profile: '/auth/profile/',
  tokenRefresh: '/auth/token/refresh/',

  // Patients
  patients: '/patients/',
  patientSplitStats: '/patients/split-stats/',
  patientDatasetOverview: '/patients/dataset-overview/',
  patientDetail: (id: number) => `/patients/${id}/`,
  patientRecords: (id: number) => `/patients/${id}/records/`,
  patientRecordsIndex: (id: number) => `/patients/${id}/records/index/`,
  patientWaveform: (id: number) => `/patients/${id}/waveform/`,
  patientClinicalInfo: (id: number) => `/patients/${id}/clinical-info/`,
  patientReport: (id: number) => `/patients/${id}/report/`,
  patientWaveformAnalysis: (id: number) => `/patients/${id}/waveform-analysis/`,
  patientWaveformAnnotations: (id: number) =>
    `/patients/${id}/waveform-annotations/`,
  patientRecordComparison: (id: number) =>
    `/patients/${id}/record-comparison/`,

  // Cardio assessments
  aiAnalysisForPatient: (id: number) =>
    `/assessments/patients/${id}/ai-analysis/`,
  stSummary: '/assessments/st-elevation/summary/',
  stAnalyze: (id: number) => `/assessments/st-elevation/${id}/analyze/`,
  stResult: (id: number) => `/assessments/st-elevation/${id}/result/`,

  // Cases
  cases: '/cases/',
  caseCounts: '/cases/counts/',
  caseDetail: (id: number) => `/cases/${id}/`,
  caseDetailFull: (id: number) => `/cases/${id}/detail/`,
  caseClaim: (id: number) => `/cases/${id}/claim/`,
  caseComplete: (id: number) => `/cases/${id}/complete/`,
  caseEscalate: (id: number) => `/cases/${id}/escalate/`,
  caseAnalyze: (id: number) => `/cases/${id}/analyze/`,

  // Impact
  impactStats: '/impact/stats/',
  impactMoments: '/impact/moments/',

  // Alyna
  alynaChat:    '/alyna/chat/',
  alynaHistory: '/alyna/history/',
  alynaClear:   '/alyna/clear/',
} as const;

// Token store (in-memory)
export const SECURE_TOKEN_KEY = 'zayra_auth_tokens';

let _tokens: AuthTokens | null = null;

export const setAuthTokens = (tokens: AuthTokens | null): void => {
  _tokens = tokens;
};

export const getAccessToken = (): string | null => _tokens?.access ?? null;
export const getRefreshToken = (): string | null => _tokens?.refresh ?? null;

// Low-level request helper

export class ApiHttpError extends Error {
  constructor(
    public status: number,
    public payload: unknown,
    message: string,
  ) {
    super(message);
    this.name = 'ApiHttpError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Set false for endpoints that should NOT send the auth header. */
  auth?: boolean;
  /** Override response parser (e.g. for PDF blob downloads). */
  rawResponse?: boolean;
  /** Per-request timeout in ms. Default 20s. */
  timeoutMs?: number;
}

const buildUrl = (
  path: string,
  query?: RequestOptions['query'],
): string => {
  let url = `${API_BASE_URL}${path}`;
  if (query) {
    const parts: string[] = [];
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    });
    if (parts.length) url += `?${parts.join('&')}`;
  }
  return url;
};

const request = async <T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> => {
  const {
    method = 'GET',
    body,
    query,
    auth = true,
    rawResponse = false,
    timeoutMs = 20000,
  } = opts;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && _tokens?.access) {
    headers.Authorization = `Bearer ${_tokens.access}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const msg =
      err instanceof Error ? err.message : 'Network request failed';
    throw new ApiHttpError(0, null, msg);
  }
  clearTimeout(timer);

  if (rawResponse) return response as unknown as T;

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === 'object' &&
        ((payload as { detail?: string }).detail ||
          JSON.stringify(payload))) ||
      `Request failed with status ${response.status}`;
    throw new ApiHttpError(response.status, payload, String(message));
  }

  return payload as T;
};

/* ──────────────────────────────────────────────────────────────────
 * AUTH API
 * ────────────────────────────────────────────────────────────────── */

export const authApi = {
  login: (req: LoginRequest) =>
    request<LoginResponse>(ENDPOINTS.login, {
      method: 'POST',
      body: req,
      auth: false,
    }),

  registerDoctor: (req: DoctorRegistrationRequest) =>
    request<LoginResponse>(ENDPOINTS.registerDoctor, {
      method: 'POST',
      body: req,
      auth: false,
    }),

  logout: (refresh: string) =>
    request<{ message: string }>(ENDPOINTS.logout, {
      method: 'POST',
      body: { refresh },
    }),

  profile: () => request<UserProfile>(ENDPOINTS.profile),

  refreshToken: (refresh: string) =>
    request<{ access: string }>(ENDPOINTS.tokenRefresh, {
      method: 'POST',
      body: { refresh },
      auth: false,
    }),
};


// PATIENT API

export interface PatientListQuery {
  search?: string;
  diagnosis?: string;
  sex?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export const patientsApi = {
  list: (query?: PatientListQuery) =>
    request<Paginated<PatientListItem>>(ENDPOINTS.patients, { query }),

  detail: (id: number) =>
    request<PatientDetail>(ENDPOINTS.patientDetail(id)),

  records: (id: number) =>
    request<{ patient_code: string; count: number; records: import('../types').ECGRecord[] }>(
      ENDPOINTS.patientRecords(id),
    ),

  waveform: (
    id: number,
    opts?: { record_id?: number; channels?: string; downsample?: number },
  ) =>
    request<WaveformResponse>(ENDPOINTS.patientWaveform(id), {
      query: opts,
      timeoutMs: 90_000,
    }),

  recordsIndex: (id: number) =>
    request<import('../types').RecordsIndexResponse>(
      ENDPOINTS.patientRecordsIndex(id),
    ),

  clinicalInfo: (id: number, opts?: { record_id?: number }) =>
    request<ClinicalInfoResponse>(ENDPOINTS.patientClinicalInfo(id), {
      query: opts,
    }),

  recordsHistory: (id: number) =>
    request<import('../types').PatientRecordsResponse>(
      ENDPOINTS.patientRecords(id),
      { query: { history: 'true' } },
    ),

  recordComparison: (id: number) =>
    request<import('../types').RecordComparisonResponse>(
      ENDPOINTS.patientRecordComparison(id),
      { timeoutMs: 120_000 },
    ),

  waveformAnalysis: (id: number, opts?: { record_id?: number }) =>
    request<import('../types').WaveformAnalysisResponse>(
      ENDPOINTS.patientWaveformAnalysis(id),
      { query: opts },
    ),
};

// CARDIO ASSESSMENT API

export const assessmentsApi = {
  aiAnalysis: (id: number, opts?: { record_id?: number; refresh?: boolean }) =>
    request<AIAnalysisEnvelope>(ENDPOINTS.aiAnalysisForPatient(id), {
      query: opts,
    }),

  stSummary: (opts?: { stemi?: boolean; status?: string }) =>
    request<STSummaryResponse>(ENDPOINTS.stSummary, { query: opts }),

  stResult: (id: number, recordId?: number) =>
    request<{
      patient: string;
      record: string;
      diagnosis: string | null;
      result: STElevationResult;
    }>(ENDPOINTS.stResult(id), { query: { record_id: recordId } }),

  stAnalyze: (id: number, recordId?: number) =>
    request<{
      message: string;
      patient: string;
      record: string;
      diagnosis: string | null;
      result: STElevationResult;
    }>(ENDPOINTS.stAnalyze(id), {
      method: 'POST',
      query: { record_id: recordId },
    }),
};


// CASES API
export interface CaseListQuery {
  status?: 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';
  severity?: 'normal' | 'routine' | 'urgent' | 'critical';
  mine?: boolean;
  search?: string;
  dataset_source?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export const casesApi = {
  list: (query?: CaseListQuery) =>
    request<Paginated<CaseReview>>(ENDPOINTS.cases, { query }),

  counts: () =>
    request<import('../types').CaseCounts>(ENDPOINTS.caseCounts),
  detail: (id: number) =>
    request<CaseReview>(ENDPOINTS.caseDetail(id)),

  detailFull: (id: number) =>
    request<CaseDetailFull>(ENDPOINTS.caseDetailFull(id)),

  claim: (id: number) =>
    request<CaseReview>(ENDPOINTS.caseClaim(id), { method: 'POST' }),

  complete: (id: number, notes?: string) =>
    request<CaseReview>(ENDPOINTS.caseComplete(id), {
      method: 'POST',
      body: notes ? { notes } : undefined,
    }),

  escalate: (id: number, notes?: string) =>
    request<CaseReview>(ENDPOINTS.caseEscalate(id), {
      method: 'POST',
      body: notes ? { notes } : undefined,
    }),

  analyze: (id: number) =>
    request<{
      message: string;
      risk_level: string | null;
      risk_score: number | null;
      narrative: string | null;
      recommendation: string | null;
      findings: string[];
      differential: string[];
    }>(ENDPOINTS.caseAnalyze(id), { method: 'POST' }),
};


// IMPACT API
export const impactApi = {
  stats: () => request<ImpactStatsResponse>(ENDPOINTS.impactStats),
  moments: () => request<ImpactMomentsResponse>(ENDPOINTS.impactMoments),
};

// ALYNA API
export const alynaApi = {
  chat: (
    message: string,
    opts?: { patient_id?: number; case_id?: number },
  ) =>
    request<AlynaChatResponse>(ENDPOINTS.alynaChat, {
      method: 'POST',
      body: {
        message,
        ...(opts?.patient_id ? { patient_id: opts.patient_id } : {}),
        ...(opts?.case_id    ? { case_id:    opts.case_id    } : {}),
      },
    }),

  history: (opts?: { patient_id?: number; case_id?: number }) =>
    request<AlynaHistoryMessage[]>(ENDPOINTS.alynaHistory, {
      query: {
        ...(opts?.patient_id ? { patient_id: opts.patient_id } : {}),
        ...(opts?.case_id    ? { case_id:    opts.case_id    } : {}),
      },
    }),

  clear: () =>
    request<{ cleared: number }>(ENDPOINTS.alynaClear, { method: 'DELETE' }),
};

// STATS API
export const statsApi = {
  splitStats: () => request<SplitStatsResponse>(ENDPOINTS.patientSplitStats),
  datasetOverview: () =>
    request<DatasetOverviewResponse>(ENDPOINTS.patientDatasetOverview),
};

// Default export
export const api = {
  auth: authApi,
  patients: patientsApi,
  assessments: assessmentsApi,
  cases: casesApi,
  impact: impactApi,
  stats: statsApi,
  alyna: alynaApi,
  setAuthTokens,
  getAccessToken,
  getRefreshToken,
};

export default api;