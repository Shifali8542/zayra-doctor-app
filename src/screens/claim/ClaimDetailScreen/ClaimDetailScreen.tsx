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
import { EcgWaveform } from '../../../components/EcgWaveform/EcgWaveform';
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

export const ClaimDetailScreen: React.FC<ClaimDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useAppTheme();
  const styles = createClaimDetailScreenStyles(theme);
  const caseId: number | undefined = route?.params?.caseId ?? route?.params?.patientId;
  const {
    caseItem, timeline, ecgRecords, patientContext,
    physiology, selectedRecordId, setSelectedRecordId,
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
                    params: { patientId },
                  })
                }
              />
            </View>

            <View style={styles.headerMetricsGrid}>
              <MetricCard label="HEART RATE" value={caseItem.hr ?? '—'} unit="bpm" icon="heart" large />
              <View style={styles.metricGap} />
              <MetricCard label="SPO" subscript="₂" value={caseItem.spo2 ?? '—'} unit="%" icon="drop" large />
            </View>
            <View style={styles.headerMetricsGrid}>
              <MetricCard label="HRV" value={caseItem.hrv ?? 24} unit="ms" icon="trace" large />
              <View style={styles.metricGap} />
              <MetricCard label="AI CONFIDENCE" value={caseItem.confidence} unit="%" icon="sparkle" large />
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
                    params: { patientId },
                  })
                }
                style={({ pressed }) => pressed && { opacity: 0.7 }}
              >
                <Text style={styles.sectionLink}>Inspect in TraceView →</Text>
              </Pressable>
            </View>

            <EcgWaveform
              width={ecgWidth > 60 ? ecgWidth : screenWidth - 80}
              height={120}
              severity={caseItem.severity === 'CRITICAL' ? 'critical' : caseItem.severity === 'URGENT' ? 'urgent' : 'normal'}
              seed={43}
              style={{ marginTop: theme.spacing.lg, alignSelf: 'center' }}
            />
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
              <Tag label="Corroborated by SpO₂ ↓" style={styles.summaryTag} />
              <Tag label="No prior event in 30d" style={styles.summaryTag} />
            </View>
          </Card>

          {/* ── ECG record switcher (only shown when patient has >1 record) ── */}
          {records.length > 1 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>ECG records</Text>
              <Text style={styles.sectionMeta}>{records.length} recordings — tap to switch</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {records.map((r) => {
                  const isActive = selectedRecordId
                    ? selectedRecordId === r.id
                    : r.is_current;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => setSelectedRecordId(r.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 20,
                        backgroundColor: isActive
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderWidth: 1,
                        borderColor: isActive
                          ? theme.colors.primary
                          : theme.colors.border,
                      }}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: isActive ? '600' : '400',
                        color: isActive
                          ? theme.colors.textOnDark
                          : theme.colors.textSecondary,
                      }}>
                        {r.record_name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          )}

          {/* ── History timeline — per ECG record breakdown ── */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>History timeline</Text>
            <Text style={styles.sectionMeta}>
              {ecgRecords.length > 0
                ? `${ecgRecords.length} ECG records — differences per recording`
                : 'Case review history'}
            </Text>

            {/* Per-record comparison table */}
            {ecgRecords.length > 1 && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                {/* Table header */}
                <View style={{
                  flexDirection: 'row',
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderColor: theme.colors.border,
                }}>
                  {['Record', 'HR', 'HRV', 'ST Status', 'STEMI'].map((h) => (
                    <Text key={h} style={{
                      flex: h === 'ST Status' ? 2 : 1,
                      fontSize: 10,
                      color: theme.colors.textSecondary,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>{h}</Text>
                  ))}
                </View>
                {/* Table rows */}
                {ecgRecords.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => setSelectedRecordId(r.id)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderColor: theme.colors.border,
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: selectedRecordId === r.id
                        ? theme.colors.surface
                        : 'transparent',
                    })}
                  >
                    <Text style={{ flex: 1, fontSize: 12, color: theme.colors.textPrimary, fontWeight: '500' }}>
                      {r.record_name}
                    </Text>
                    <Text style={{ flex: 1, fontSize: 12, color: theme.colors.textPrimary }}>
                      {r.heart_rate_bpm ? `${Math.round(r.heart_rate_bpm)}` : '—'}
                    </Text>
                    <Text style={{ flex: 1, fontSize: 12, color: theme.colors.textPrimary }}>
                      {r.hrv_ms ? `${Math.round(r.hrv_ms)}ms` : '—'}
                    </Text>
                    <Text style={{
                      flex: 2, fontSize: 11,
                      color: r.st_status?.includes('STEMI') || r.st_status?.includes('Critical')
                        ? theme.colors.danger
                        : r.st_status === 'Normal'
                          ? theme.colors.success
                          : theme.colors.textPrimary,
                    }}>
                      {r.st_status ?? '—'}
                    </Text>
                    <Text style={{
                      flex: 1, fontSize: 12,
                      color: r.stemi_suspected ? theme.colors.danger : theme.colors.success,
                      fontWeight: '600',
                    }}>
                      {r.stemi_suspected === null ? '—' : r.stemi_suspected ? 'YES' : 'No'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Standard timeline events */}
            <View style={styles.timelineWrap}>
              {timeline.map((t, i) => (
                <TimelineItem
                  key={`${t.when}-${i}`}
                  when={t.when}
                  description={
                    t.recordName
                      ? `[${t.recordName}] ${t.description}${t.heartRateBpm ? ` · HR ${Math.round(t.heartRateBpm)} bpm` : ''}${t.stStatus ? ` · ST: ${t.stStatus}` : ''}`
                      : t.description
                  }
                  isFirst={i === 0}
                  isLast={i === timeline.length - 1}
                />
              ))}
            </View>
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
                  <Text style={styles.physLabel}>SpO₂</Text>
                  <Text style={styles.physBaseline}>vs {physiology.spo2.baseline}% baseline</Text>
                </View>
                <Text style={styles.physValue}>{physiology.spo2.value}%</Text>
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