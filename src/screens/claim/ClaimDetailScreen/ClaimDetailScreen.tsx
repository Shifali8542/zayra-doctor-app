import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Card } from '../../../components/Card/Card';
import { Button } from '../../../components/Button/Button';
import { Tag } from '../../../components/Tag/Tag';
import { SeverityBadge } from '../../../components/SeverityBadge/SeverityBadge';
import { MetricCard } from '../../../components/MetricCard/MetricCard';
import { Icon } from '../../../components/Icon';
import { useClaim } from '../../../features/claim/hooks/useClaim';
import { useAppTheme } from '../../../context/ThemeContext';
import { createClaimDetailScreenStyles } from './ClaimDetailScreen.style';
import { formatRelativeMinutes } from '../../../utils/format';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '../../../utils/useResponsive';

interface ClaimDetailScreenProps {
  navigation: any;
  route: any;
}

const Row: React.FC<{ label: string; value: string; last?: boolean }> = ({
  label, value, last,
}) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  return (
    <View style={[styles.kvRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={styles.kvValue}>{value}</Text>
    </View>
  );
};

const TimelineItem: React.FC<{ when: string; description: string; isFirst?: boolean; isLast?: boolean }> = ({
  when, description, isFirst, isLast,
}) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineDotCol}>
        {!isFirst && <View style={styles.timelineLineTop} />}
        <View style={styles.timelineDot} />
        {!isLast && <View style={styles.timelineLineBottom} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineWhen}>{when}</Text>
        <Text style={styles.timelineDesc}>{description}</Text>
      </View>
    </View>
  );
};

const ActionPathButton: React.FC<{
  icon: any; label: string; onPress?: () => void;
}> = ({ icon, label, onPress }) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.actionIconCircle}>
        <Icon name={icon} size={18} color={theme.colors.textOnDark} strokeWidth={1.8} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Icon name="arrow-up-right" size={16} color={theme.colors.textOnDark} strokeWidth={1.8} />
    </Pressable>
  );
};

// ── Delta chip — shows +/- change vs previous record ──────────────────────────
const DeltaChip: React.FC<{
  label: string;
  value: number | null;
  unit?: string;
  higherIsBad?: boolean;
}> = ({ label, value, unit = '', higherIsBad = true }) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  if (value === null) return null;
  const isPositive = value > 0;
  const isBad = higherIsBad ? isPositive : !isPositive;
  const sign = isPositive ? '+' : '';
  const color = value === 0
    ? theme.colors.textSecondary
    : isBad ? theme.colors.danger : theme.colors.success;
  return (
    <View style={styles.deltaRow}>
      <Text style={styles.deltaLabel}>{label}</Text>
      <Text style={[
        value > 0 ? styles.deltaValuePositive : value < 0 ? styles.deltaValueNegative : styles.deltaValueNeutral,
        { color },
      ]}>
        {sign}{value}{unit}
      </Text>
    </View>
  );
};

// ── ST badge colour helper ─────────────────────────────────────────────────────
const stColor = (status: string | null, theme: any) => {
  if (!status) return theme.colors.surface;
  if (status.includes('STEMI') || status.includes('Critical')) return 'rgba(239,68,68,0.15)';
  if (status.includes('Risk') || status.includes('Abnormal')) return 'rgba(245,158,11,0.15)';
  if (status === 'Normal') return 'rgba(34,197,94,0.15)';
  return theme.colors.surface;
};
const stTextColor = (status: string | null, theme: any) => {
  if (!status) return theme.colors.textTertiary;
  if (status.includes('STEMI') || status.includes('Critical')) return theme.colors.danger;
  if (status.includes('Risk') || status.includes('Abnormal')) return '#F59E0B';
  if (status === 'Normal') return theme.colors.success;
  return theme.colors.textSecondary;
};

// ── AI risk dot colour ────────────────────────────────────────────────────────
const aiRiskColor = (level: string | null, theme: any) => {
  if (level === 'Critical') return theme.colors.danger;
  if (level === 'High') return '#F59E0B';
  if (level === 'Moderate') return '#3B82F6';
  if (level === 'Low') return theme.colors.success;
  return theme.colors.textTertiary;
};

// ── ECG Comparison — true horizontal table (rows = metrics, columns = ECG records) ──
import { ScrollView } from 'react-native';

type ECGRec = import('../../../types').ECGRecordComparison;

/** Returns colour for a numeric delta value */
const deltaColor = (val: number, higherIsBad: boolean, theme: any): string => {
  if (val === 0) return theme.colors.textTertiary;
  const isBad = higherIsBad ? val > 0 : val < 0;
  return isBad ? theme.colors.danger : theme.colors.success;
};

const ECGComparisonTable: React.FC<{
  records: ECGRec[];
  selectedRecordId: number | null;
  currentRecordId: number | undefined;
  onSelectRecord: (id: number) => void;
}> = ({ records, selectedRecordId, currentRecordId, onSelectRecord }) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);

  if (!records.length) return null;

  const isActive = (rec: ECGRec) =>
    selectedRecordId ? selectedRecordId === rec.id : currentRecordId === rec.id;

  // Fixed label column width + equal data columns
  const COL_LABEL = 88;
  const COL_DATA  = 96;

  // ── cell renderers ────────────────────────────────────────────────────────
  const HeaderCell = ({ rec, idx }: { rec: ECGRec; idx: number }) => {
    const active = isActive(rec);
    const d = rec.delta_vs_previous;
    return (
      <Pressable
        onPress={() => onSelectRecord(rec.id)}
        style={({ pressed }) => [
          styles.cmpHeaderCell,
          { width: COL_DATA },
          active && styles.cmpHeaderCellActive,
          pressed && { opacity: 0.8 },
        ]}
      >
        <View style={[styles.cmpEcgBadge, active && { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.cmpEcgBadgeText, active && { color: theme.colors.textOnDark }]}>
            ECG {idx + 1}
          </Text>
        </View>
        {idx === 0 && (
          <View style={styles.cmpBaselinePill}>
            <Text style={styles.cmpBaselinePillText}>Baseline</Text>
          </View>
        )}
        {idx > 0 && d?.rhythm_changed && (
          <View style={styles.cmpAlertPill}>
            <Text style={styles.cmpAlertPillText}>Rhythm ↑</Text>
          </View>
        )}
        {idx > 0 && d?.st_status_changed && (
          <View style={[styles.cmpAlertPill, { backgroundColor: 'rgba(239,68,68,0.13)' }]}>
            <Text style={[styles.cmpAlertPillText, { color: theme.colors.danger }]}>ST ↑</Text>
          </View>
        )}
      </Pressable>
    );
  };

  /** Renders a single metric value + optional delta below it */
  const MetricCell = ({
    rec, idx, getValue, higherIsBad = true,
  }: {
    rec: ECGRec;
    idx: number;
    getValue: (r: ECGRec) => { display: string; delta?: number | null };
    higherIsBad?: boolean;
  }) => {
    const active = isActive(rec);
    const { display, delta } = getValue(rec);
    const showDelta = idx > 0 && delta !== null && delta !== undefined;
    const dColor = showDelta ? deltaColor(delta as number, higherIsBad, theme) : undefined;
    const sign = showDelta && (delta as number) > 0 ? '+' : '';
    const arrow = showDelta
      ? (delta as number) === 0 ? '' : (delta as number) > 0 ? ' ↑' : ' ↓'
      : '';
    return (
      <View style={[
        styles.cmpDataCell,
        { width: COL_DATA },
        active && styles.cmpDataCellActive,
      ]}>
        <Text style={styles.cmpDataValue}>{display}</Text>
        {showDelta && (
          <Text style={[styles.cmpDelta, { color: dColor }]}>
            {sign}{Math.round(delta as number)}{arrow}
          </Text>
        )}
      </View>
    );
  };

  /** One full row: sticky label on left + scrollable data cells */
  const TableRow = ({
    label,
    renderCell,
    isLast,
    higherIsBad,
  }: {
    label: string;
    renderCell: (rec: ECGRec, idx: number) => React.ReactNode;
    isLast?: boolean;
    higherIsBad?: boolean;
  }) => (
    <View style={[styles.cmpRow, isLast && { borderBottomWidth: 0 }]}>
      {/* Sticky label */}
      <View style={[styles.cmpLabelCell, { width: COL_LABEL }]}>
        <Text style={styles.cmpLabel}>{label}</Text>
      </View>
      {/* Scrollable data — same ScrollView ref so they scroll together */}
      {records.map((rec, idx) => (
        <React.Fragment key={rec.id}>
          {renderCell(rec, idx)}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.cmpOuter}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* ── Sticky header row ── */}
          <View style={styles.cmpHeaderRow}>
            {/* Empty corner cell */}
            <View style={[styles.cmpCornerCell, { width: COL_LABEL }]}>
              <Text style={styles.cmpCornerText}>RECORD</Text>
            </View>
            {records.map((rec, idx) => (
              <HeaderCell key={rec.id} rec={rec} idx={idx} />
            ))}
          </View>

          {/* ── Data rows ── */}
          <TableRow
            label="Rhythm"
            renderCell={(rec, idx) => (
              <MetricCell
                rec={rec} idx={idx}
                getValue={(r) => ({ display: r.rhythm ?? '—' })}
              />
            )}
          />
          <TableRow
            label="Heart Rate"
            renderCell={(rec, idx) => (
              <MetricCell
                rec={rec} idx={idx} higherIsBad
                getValue={(r) => ({
                  display: r.heart_rate_bpm !== null ? `${Math.round(r.heart_rate_bpm)} bpm` : '—',
                  delta: rec.delta_vs_previous?.heart_rate_bpm,
                })}
              />
            )}
          />
          <TableRow
            label="HRV"
            renderCell={(rec, idx) => (
              <MetricCell
                rec={rec} idx={idx} higherIsBad={false}
                getValue={(r) => ({
                  display: r.hrv_ms !== null ? `${Math.round(r.hrv_ms)} ms` : '—',
                  delta: rec.delta_vs_previous?.hrv_ms,
                })}
              />
            )}
          />
          <TableRow
            label="QRS Width"
            renderCell={(rec, idx) => (
              <MetricCell
                rec={rec} idx={idx} higherIsBad
                getValue={(r) => ({
                  display: r.qrs_width_ms !== null ? `${Math.round(r.qrs_width_ms)} ms` : '—',
                  delta: rec.delta_vs_previous?.qrs_width_ms,
                })}
              />
            )}
          />
          <TableRow
            label="QT / QTc"
            renderCell={(rec, idx) => (
              <MetricCell
                rec={rec} idx={idx} higherIsBad
                getValue={(r) => ({
                  display: r.qt_ms !== null && r.qtc_ms !== null
                    ? `${Math.round(r.qt_ms)}/${Math.round(r.qtc_ms)}`
                    : '—',
                  delta: rec.delta_vs_previous?.qtc_ms,
                })}
              />
            )}
          />
          <TableRow
            label="Diagnosis"
            renderCell={(rec, idx) => {
              const stBg = stColor(rec.st_status, theme);
              const stTxt = stTextColor(rec.st_status, theme);
              return (
                <View style={[
                  styles.cmpDataCell,
                  { width: COL_DATA },
                  isActive(rec) && styles.cmpDataCellActive,
                ]}>
                  {rec.st_status ? (
                    <View style={[styles.cmpStPill, { backgroundColor: stBg }]}>
                      <Text style={[styles.cmpStPillText, { color: stTxt }]} numberOfLines={2}>
                        {rec.st_status}{rec.stemi_suspected ? '\nSTEMI' : ''}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.cmpDataValue}>—</Text>
                  )}
                </View>
              );
            }}
          />
          <TableRow
            label="AI Risk"
            isLast
            renderCell={(rec, idx) => {
              const aiColor = aiRiskColor(rec.ai_risk_level, theme);
              return (
                <View style={[
                  styles.cmpDataCell,
                  { width: COL_DATA },
                  isActive(rec) && styles.cmpDataCellActive,
                ]}>
                  {rec.ai_risk_level ? (
                    <>
                      <View style={[styles.cmpAiDot, { backgroundColor: aiColor }]} />
                      <Text style={[styles.cmpDataValue, { color: aiColor, marginTop: 2 }]}>
                        {rec.ai_risk_level}
                      </Text>
                      {rec.ai_risk_score !== null && (
                        <Text style={styles.cmpDelta}>{rec.ai_risk_score}%</Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.cmpDataValue}>—</Text>
                  )}
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export const ClaimDetailScreen: React.FC<ClaimDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  const caseId: number | undefined = route?.params?.caseId ?? route?.params?.patientId;
  const {
    caseItem, timeline, ecgRecords, comparisonRecords, patientContext,
    physiology, selectedRecordId, setSelectedRecordId,
    clinicalLoading, comparisonLoading, comparisonError,
    aiAnalysis, records, loading, error,
  } = useClaim(caseId);

  const patientId = caseItem?.patientId;

  const { width: screenWidth } = useResponsive();
  const ecgWidth = screenWidth - 80;

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={32}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.backRow, pressed && { opacity: 0.6 }]}
      >
        <Icon name="chevron-left" size={20} color={theme.colors.textPrimary} />
        <Text style={styles.backText}>Back to PulseDesk</Text>
      </Pressable>

      {loading || !caseItem ? (
        <View style={{ paddingVertical: 64, alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>
            Loading case…
          </Text>
        </View>
      ) : error ? (
        <View style={{ paddingVertical: 64, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.danger }}>{error}</Text>
        </View>
      ) : (
        <>
          <Card style={styles.headerCard}>
            <View style={styles.headerCardTop}>
              <SeverityBadge severity={caseItem.severity} />
              <Text style={styles.caseId} numberOfLines={1}>
                {caseItem.datasetLabel}
              </Text>
              <Text style={styles.elapsed}>
                · {formatRelativeMinutes(caseItem.ageMinutes + 3)}
              </Text>
            </View>
            <Text style={styles.caseTitle}>{caseItem.anomaly}</Text>
            <Text style={styles.caseSub}>
              {caseItem.patientSex} · {caseItem.patientAge}y · Patient {caseItem.patientCode} · Signal {caseItem.signalQ}
            </Text>

            <View style={styles.headerCtaRow}>
              <Button
                label="Ask Alyna"
                variant="secondary"
                iconLeft="sparkle"
                size="md"
                onPress={() =>
                  navigation.navigate('Tabs', {
                    screen: 'Alyna',
                    params: { patientId },
                  })
                }
              />
              <View style={{ width: theme.spacing.md }} />
              <Button
                label="Open TraceView"
                iconLeft="trace"
                size="md"
                onPress={() =>
                  navigation.navigate('Tabs', {
                    screen: 'TraceView',
                    params: { patientId, recordId: caseItem?.recordId },
                  })
                }
              />
            </View>

            <View style={styles.headerMetricsGrid}>
              <MetricCard label="HEART RATE" value={caseItem.hr ?? '—'} unit="bpm" icon="heart" large />
              <View style={styles.metricGap} />
              <MetricCard label="HRV" value={caseItem.hrv ?? '—'} unit="ms" icon="trace" large />
            </View>
            <View style={styles.headerMetricsGrid}>
              <MetricCard label="AI CONFIDENCE" value={caseItem.confidence} unit="%" icon="sparkle" large />
              <View style={styles.metricGap} />
              <MetricCard label="SIGNAL" value={caseItem.signalQ} icon="activity" large />
            </View>
          </Card>

          <Card style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Anomaly waveform</Text>
                <Text style={styles.sectionMeta}>Live capture · last 30 seconds</Text>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate('Tabs', {
                    screen: 'TraceView',
                    params: { patientId, recordId: caseItem?.recordId },
                  })
                }
                style={({ pressed }) => pressed && { opacity: 0.7 }}
              >
                <Text style={styles.sectionLink}>Inspect in TraceView →</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: theme.spacing.lg, paddingVertical: theme.spacing.lg, alignItems: 'center', borderRadius: theme.radii.lg, backgroundColor: '#0E1B2C' }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                Tap "Inspect in TraceView →" to view the full real ECG signal
              </Text>
            </View>
            <View style={styles.captureMetaRow}>
              <Text style={styles.captureMeta}>Lead II · 25mm/s · 10mm/mV</Text>
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Alyna summary</Text>
            <Text style={styles.sectionMeta}>Governed AI assessment</Text>
            <Text style={styles.summaryBody}>
              {caseItem.anomaly}. Pattern is{' '}
              <Text style={styles.bold}>significantly outside personal baseline</Text>{' '}
              for this patient. Concurrent SpO₂ and HRV trends corroborate physiologic stress.
              Recommend immediate clinician review and consideration of escalation.
            </Text>
            <View style={styles.tagsCol}>
              <Tag
                label={`Confidence ${caseItem.confidence}%`}
                leftIcon={<Icon name="alert-triangle" size={13} color={theme.colors.textPrimary} />}
                style={styles.summaryTag}
              />
              <Tag label="No prior event in 30d" style={styles.summaryTag} />
            </View>
          </Card>

          {/* ── ECG History comparison table — redesigned ── */}
          <Card style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>ECG history comparison</Text>
                <Text style={[styles.sectionMeta, { marginTop: 2 }]}>
                  {comparisonRecords.length > 1
                    ? `${comparisonRecords.length} recordings · tap to switch waveform`
                    : 'Recording details'}
                </Text>
              </View>
              {clinicalLoading && (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              )}
            </View>

            {(() => {
              console.log('[ClaimDetailScreen] ECG section render');
              console.log('[ClaimDetailScreen] comparisonRecords:', comparisonRecords.length);
              console.log('[ClaimDetailScreen] comparisonRecords data:', JSON.stringify(comparisonRecords, null, 2));
              console.log('[ClaimDetailScreen] records (from detail):', records.length);
              console.log('[ClaimDetailScreen] clinicalLoading:', clinicalLoading);
              return null;
            })()}
            {comparisonRecords.length > 0 ? (
              <ECGComparisonTable
                records={comparisonRecords}
                selectedRecordId={selectedRecordId}
                currentRecordId={records.find((r) => r.is_current)?.id}
                onSelectRecord={setSelectedRecordId}
              />
            ) : (
              <Text style={[styles.sectionMeta, { marginTop: theme.spacing.md }]}>
                {comparisonLoading
                  ? 'Loading ECG records…'
                  : comparisonError
                    ? `Error: ${comparisonError}`
                    : 'No ECG records available.'}
              </Text>
            )}

            {/* Case review timeline below table */}
            {timeline.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl, fontSize: 14 }]}>
                  Review events
                </Text>
                <View style={styles.timelineWrap}>
                  {timeline.map((t, i) => (
                    <TimelineItem
                      key={`${t.when}-${i}`}
                      when={t.when}
                      description={t.description}
                      isFirst={i === 0}
                      isLast={i === timeline.length - 1}
                    />
                  ))}
                </View>
              </>
            )}
          </Card>

          {patientContext && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Patient context</Text>
              <View style={styles.kvList}>
                <Row label="Sex / Age" value={`${patientContext.sex} · ${patientContext.age}y`} />
                <Row label="Comorbidities" value={patientContext.comorbidities} />
                <Row label="Adherence" value={`${patientContext.adherencePct}%`} />
                <Row label="Activity" value={patientContext.activity} />
                <Row label="Sleep" value={patientContext.sleep} />
                <Row label="Diet pattern" value={patientContext.dietPattern} />
                <Row label="Smoking / Alcohol" value={patientContext.smokingAlcohol} last />
              </View>
            </Card>
          )}
          {physiology && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Physiology snapshot</Text>
              <View style={styles.physRow}>
                <View style={styles.physLeft}>
                  <Text style={styles.physLabel}>Pulse</Text>
                  <Text style={styles.physBaseline}>vs {physiology.pulse.baseline} baseline</Text>
                </View>
                <Text style={styles.physValue}>{physiology.pulse.value}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.physRow}>
                <View style={styles.physLeft}>
                  <Text style={styles.physLabel}>HRV</Text>
                  <Text style={styles.physBaseline}>vs {physiology.hrv.baseline} baseline</Text>
                </View>
                <Text style={styles.physValue}>{physiology.hrv.value}{physiology.hrv.unit}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.physRow}>
                <View style={styles.physLeft}>
                  <Text style={styles.physLabel}>Recovery</Text>
                  <Text style={styles.physBaseline}>{physiology.recoveryNote}</Text>
                </View>
                <Text style={styles.physValue}>{physiology.recovery}</Text>
              </View>
            </Card>
          )}

          <LinearGradient
            colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionPathCard}
          >
            <Text style={styles.actionEyebrow}>ACTIONPATH</Text>
            <Text style={styles.actionTitle}>Make a decision</Text>

            <ActionPathButton icon="phone" label="Escalate to emergency response" />
            <View style={styles.actionGap} />
            <ActionPathButton icon="stethoscope" label="Connect to cardiologist on-call" />
            <View style={styles.actionGap} />
            <ActionPathButton icon="eye" label="Continue high observation" />
            <View style={styles.actionGap} />
            <ActionPathButton icon="check-circle" label="Continue monitoring" />
            <View style={styles.actionGap} />
            <ActionPathButton icon="close-circle" label="Mark as false positive" />
          </LinearGradient>
        </>
      )}
    </Layout>
  );
};