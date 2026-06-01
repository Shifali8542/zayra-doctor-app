import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Card } from '../../../components/Card/Card';
import { Button } from '../../../components/Button/Button';
import { Icon } from '../../../components/Icon';
import { EcgWaveform } from '../../../components/EcgWaveform/EcgWaveform';
import { CasePicker } from '../../../components/CasePicker/CasePicker';
import { useTraceView } from '../../../features/traceview/hooks/useTraceView';
import { useAppTheme } from '../../../context/ThemeContext';
import { createTraceViewScreenStyles } from './TraceViewScreen.style';
import { useResponsive } from '../../../utils/useResponsive';
import { getMaxContentWidth } from '../../../utils/responsive';
import type { CaseReview } from '../../../types';
interface TraceViewScreenProps {
  navigation: any;
  route?: any;
}

export const TraceViewScreen: React.FC<TraceViewScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useAppTheme();
  const styles = createTraceViewScreenStyles(theme);
  const { deviceType, width: screenWidth } = useResponsive();
  const patientId: number | undefined = route?.params?.patientId;
  const caseId: number | undefined = route?.params?.caseId;
  const recordId: number | undefined = route?.params?.recordId;
  const hookKey = `${patientId ?? 'x'}-${caseId ?? 'x'}-${recordId ?? 'x'}`;

  const {
    showPicker,
    pickerMyCases, pickerLiveCases,
    pickerMyCount, pickerLiveCount,
    pickerLoading, hasMoreMyCases, hasMoreLiveCases,
    loadMoreMyCases, loadMoreLiveCases,
    caseItem, rhythm,
    primarySamples, allLeadSamples,
    effectiveSamplingRate, segments, waveformData,
    records, totalRecords, activeRecordId, activeRecordIndex, selectRecord,
    selectedLead, setSelectedLead, availableLeads,
    viewMode, setViewMode,
    zoom, zoomIn, zoomOut,
    annotation, setAnnotation, saveAnnotation,
    analysis,
    loading, waveformLoading, error,
  } = useTraceView(patientId, recordId, caseId);

  const containerW = Math.min(getMaxContentWidth(deviceType), screenWidth) - 48;
  const stripWidth = Math.max(220, containerW * zoom);
  const stripHeight = 130;
  const handlePickerSelect = useCallback((c: CaseReview) => {
    navigation.getParent()?.navigate('Tabs', {
      screen: 'TraceView',
      params: { caseId: c.id },
    });
  }, [navigation]);

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={92} key={hookKey}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <View style={styles.titleWrap}>
        <Text style={styles.title}>TraceView</Text>
        <Text style={styles.subtitle}>
          {showPicker
            ? 'Select a case to inspect its ECG signal'
            : `${caseItem?.datasetLabel ?? '—'} · Lead ${selectedLead} · 25 mm/s`}
        </Text>
      </View>

      {/* Case picker mode  */}
      {showPicker && (
        <CasePicker
          myCases={pickerMyCases}
          liveCases={pickerLiveCases}
          myCount={pickerMyCount}
          liveCount={pickerLiveCount}
          loading={pickerLoading}
          hasMoreMy={hasMoreMyCases}
          hasMoreLive={hasMoreLiveCases}
          onLoadMoreMy={loadMoreMyCases}
          onLoadMoreLive={loadMoreLiveCases}
          onSelect={handlePickerSelect}
        />
      )}

      {/* Waveform mode */}
      {!showPicker && loading ? (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>
            Loading case…
          </Text>
        </View>
      ) : !showPicker && error ? (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.danger, textAlign: 'center', marginBottom: 12 }}>
            {error}
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.divider }}
          >
            <Text style={{ color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' }}>Go back</Text>
          </Pressable>
        </View>
      ) : !showPicker ? (
        <>
          {/* Page header row — back + severity + view toggle */}
          <View style={styles.pageHeaderRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            >
              <Icon name="chevron-left" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
            <View style={{ flex: 1 }} />
            {/* Strip / 12-lead toggle */}
            <View style={styles.viewToggleWrap}>
              {(['strip', '12lead'] as const).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setViewMode(m)}
                  style={[styles.viewToggleBtn, viewMode === m && styles.viewToggleBtnActive]}
                >
                  <Text style={[styles.viewToggleBtnText, viewMode === m && styles.viewToggleBtnTextActive]}>
                    {m === 'strip' ? 'Strip' : '12-lead'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Case info sub-title */}
          {caseItem && (
            <Text style={styles.caseInfoMeta} numberOfLines={2}>
              {caseItem.patientCode ?? ''}
              {caseItem.age ? ` · ${caseItem.age}y` : ''}
              {caseItem.sex ? ` ${caseItem.sex}` : ''}
              {` · Lead ${selectedLead} · ${rhythm.rate > 0 ? `${rhythm.rate} bpm` : '—'}`}
            </Text>
          )}

          {/* Toolbar */}
          <View style={styles.toolbar}>
            <Pressable onPress={zoomOut} style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="minus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={styles.zoomLabel}>{zoom.toFixed(2)}x</Text>
            <Pressable onPress={zoomIn} style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="plus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <View style={styles.toolDivider} />
            <Pressable style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="expand" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="bookmark" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="share" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.toolBtn, pressed && { opacity: 0.7 }]}>
              <Icon name="book" size={16} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          {/* ECG Record Tabs */}
          {records.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: theme.spacing.md }}
              contentContainerStyle={{ paddingHorizontal: 2, flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
              {records.map((rec) => {
                const isActive = rec.id === activeRecordId;
                return (
                  <Pressable
                    key={rec.id}
                    onPress={() => selectRecord(rec.id)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: theme.radii.pill,
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                      borderWidth: 1,
                      borderColor: isActive ? theme.colors.primary : theme.colors.divider,
                      opacity: pressed ? 0.75 : 1,
                    })}
                  >
                    <Text style={{
                      ...theme.typography.bodyStrong,
                      color: isActive ? '#fff' : theme.colors.textSecondary,
                      fontSize: 13,
                    }}>
                      {rec.label}
                      {rec.duration_seconds ? ` · ${rec.duration_seconds.toFixed(0)}s` : ''}
                    </Text>
                  </Pressable>
                );
              })}
              {records.length > 0 && (
                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginLeft: 4 }}>
                  {activeRecordIndex + 1} of {totalRecords}
                </Text>
              )}
            </ScrollView>
          )}

          {/* Lead selector — strip mode only */}
          {viewMode === 'strip' && availableLeads.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: theme.spacing.md }}
              contentContainerStyle={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}
            >
              <Text style={{
                fontSize: 11, textTransform: 'uppercase',
                letterSpacing: 1, color: theme.colors.textTertiary, marginRight: 4,
              }}>
                Lead
              </Text>
              {availableLeads.map((lead: string) => {
                const isActive = lead === selectedLead;
                return (
                  <Pressable
                    key={lead}
                    onPress={() => setSelectedLead(lead)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: theme.radii.pill,
                      borderWidth: 1,
                      borderColor: isActive ? theme.colors.primary : theme.colors.divider,
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{
                      fontSize: 11, fontWeight: '700',
                      color: isActive ? '#fff' : theme.colors.textSecondary,
                    }}>
                      {lead}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* 12-lead grid view */}
          {viewMode === '12lead' && (
            <>
              {waveformLoading ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.lg }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={{
                      width: (containerW - 8) / 2, height: 90,
                      borderRadius: theme.radii.lg,
                      backgroundColor: '#0E1B2C',
                    }} />
                  ))}
                </View>
              ) : Object.keys(allLeadSamples).length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.lg }}>
                  {availableLeads.map((lead: string) => {
                    const samples = allLeadSamples[lead] ?? allLeadSamples[lead.toLowerCase()];
                    if (!samples) return null;
                    const isAnomalyLead = lead.toUpperCase() === 'II';
                    const cellW = (containerW - 8) / 2;
                    return (
                      <Pressable
                        key={lead}
                        onPress={() => { setSelectedLead(lead); setViewMode('strip'); }}
                        style={({ pressed }) => ({
                          width: cellW, borderRadius: theme.radii.lg,
                          backgroundColor: '#0E1B2C', overflow: 'hidden',
                          opacity: pressed ? 0.8 : 1,
                        })}
                      >
                        <View style={{
                          flexDirection: 'row', justifyContent: 'space-between',
                          paddingHorizontal: 8, paddingTop: 6, paddingBottom: 4,
                        }}>
                          <Text style={{
                            fontSize: 10, fontWeight: '700', letterSpacing: 1.1,
                            color: isAnomalyLead ? '#FF6E7A' : 'rgba(255,255,255,0.6)',
                          }}>
                            {lead}{isAnomalyLead ? ' ★' : ''}
                          </Text>
                          <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>25mm/s</Text>
                        </View>
                        <EcgWaveform
                          width={cellW}
                          height={70}
                          data={samples}
                          effectiveSamplingRate={effectiveSamplingRate}
                          displaySeconds={10}
                          strokeColor={isAnomalyLead ? '#FF6E7A' : '#4EECD8'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <Card style={{ marginBottom: theme.spacing.lg }}>
                  <Text style={{ color: theme.colors.textTertiary, textAlign: 'center', paddingVertical: 24 }}>
                    No waveform data available.
                  </Text>
                </Card>
              )}
            </>
          )}

          {/* Strip view */}
          {viewMode === 'strip' && (
            <>
              {/* BEFORE strip */}
              <View style={styles.strip}>
                <View style={styles.stripHeader}>
                  <Text style={styles.stripLabel}>BEFORE</Text>
                  <Text style={styles.stripMeta}>
                    {segments.before
                      ? `${segments.before.start_sec}s – ${segments.before.end_sec}s`
                      : 'II · 25MM/S'}
                  </Text>
                </View>
                {waveformLoading ? (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={theme.colors.primary} size="small" />
                  </View>
                ) : segments.before ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <EcgWaveform
                      width={Math.max(stripWidth, 500)}
                      height={stripHeight}
                      data={segments.before.samples}
                      effectiveSamplingRate={effectiveSamplingRate}
                      displaySeconds={30}
                    />
                  </ScrollView>
                ) : (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>No data</Text>
                  </View>
                )}
              </View>

              {/* DURING ANOMALY strip */}
              <View style={[styles.strip, styles.stripHighlight]}>
                <View style={styles.stripHeader}>
                  <Text style={styles.stripLabel}>DURING ANOMALY</Text>
                  <Text style={styles.stripMeta}>
                    {segments.anomaly
                      ? `${segments.anomaly.start_sec}s – ${segments.anomaly.end_sec}s`
                      : 'II · 25MM/S'}
                  </Text>
                </View>
                {waveformLoading ? (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={theme.colors.primary} size="small" />
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6 }}>
                      {`ECG ${activeRecordIndex + 1} of ${totalRecords} · Loading…`}
                    </Text>
                  </View>
                ) : segments.anomaly ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <EcgWaveform
                      width={Math.max(stripWidth, 500)}
                      height={stripHeight}
                      data={segments.anomaly.samples}
                      effectiveSamplingRate={effectiveSamplingRate}
                      displaySeconds={30}
                      strokeColor={theme.colors.pulseRed}
                    />
                  </ScrollView>
                ) : (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>No data</Text>
                  </View>
                )}
              </View>

              {/* AFTER strip */}
              <View style={styles.strip}>
                <View style={styles.stripHeader}>
                  <Text style={styles.stripLabel}>AFTER</Text>
                  <Text style={styles.stripMeta}>
                    {segments.after
                      ? `${segments.after.start_sec}s – ${segments.after.end_sec}s`
                      : 'II · 25MM/S'}
                  </Text>
                </View>
                {waveformLoading ? (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={theme.colors.primary} size="small" />
                  </View>
                ) : segments.after ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <EcgWaveform
                      width={Math.max(stripWidth, 500)}
                      height={stripHeight}
                      data={segments.after.samples}
                      effectiveSamplingRate={effectiveSamplingRate}
                      displaySeconds={30}
                    />
                  </ScrollView>
                ) : (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>No data</Text>
                  </View>
                )}
              </View>

              <View style={styles.strip}>
                <View style={styles.stripHeader}>
                  <Text style={styles.stripLabel}>
                    {totalRecords > 0
                      ? `ECG ${activeRecordIndex + 1} OF ${totalRecords} · LEAD ${selectedLead}`
                      : `LEAD ${selectedLead}`}
                  </Text>
                  <Text style={styles.stripMeta}>25MM/S · 10MM/MV</Text>
                </View>

                {waveformLoading ? (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={theme.colors.primary} size="small" />
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6 }}>
                      Loading signal…
                    </Text>
                  </View>
                ) : primarySamples ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <EcgWaveform
                      width={Math.max(stripWidth, 600)}
                      height={stripHeight}
                      data={primarySamples}
                      effectiveSamplingRate={effectiveSamplingRate}
                      displaySeconds={10 * zoom}
                    />
                  </ScrollView>
                ) : (
                  <View style={{ height: stripHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      No signal data available
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Waveform analysis card */}
          {analysis && (
            <Card style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <Text style={styles.cardTitle}>Waveform analysis</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {analysis.heart_rate_bpm != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>HEART RATE</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.heart_rate_bpm)} <Text style={styles.analysisCellUnit}>bpm</Text></Text>
                  </View>
                )}
                {analysis.hrv_ms != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>HRV (RMSSD)</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.hrv_ms)} <Text style={styles.analysisCellUnit}>ms</Text></Text>
                  </View>
                )}
                {analysis.rhythm && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>RHYTHM</Text>
                    <Text style={styles.analysisCellValue}>{analysis.rhythm}</Text>
                  </View>
                )}
                {analysis.quality_score != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>SIGNAL QUALITY</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.quality_score * 100)}<Text style={styles.analysisCellUnit}>%</Text></Text>
                  </View>
                )}
                {analysis.wave_intervals?.pr_interval_ms != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>PR INTERVAL</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.wave_intervals.pr_interval_ms)} <Text style={styles.analysisCellUnit}>ms</Text></Text>
                  </View>
                )}
                {analysis.wave_intervals?.qrs_duration_ms != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>QRS DURATION</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.wave_intervals.qrs_duration_ms)} <Text style={styles.analysisCellUnit}>ms</Text></Text>
                  </View>
                )}
                {analysis.wave_intervals?.qt_interval_ms != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>QT INTERVAL</Text>
                    <Text style={styles.analysisCellValue}>{Math.round(analysis.wave_intervals.qt_interval_ms)} <Text style={styles.analysisCellUnit}>ms</Text></Text>
                  </View>
                )}
                {analysis.num_beats != null && (
                  <View style={styles.analysisCell}>
                    <Text style={styles.analysisCellLabel}>BEATS DETECTED</Text>
                    <Text style={styles.analysisCellValue}>{analysis.num_beats}</Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {(segments.before || segments.anomaly || segments.after) && (() => {
            const onsetSec = segments.anomaly?.start_sec ?? null;
            const peakSec = onsetSec !== null && segments.anomaly?.end_sec != null
              ? Math.round((onsetSec + segments.anomaly.end_sec) / 2)
              : null;
            const resolSec = segments.after?.start_sec ?? segments.anomaly?.end_sec ?? null;

            const bookmarks: { label: string; offsetSec: number | null }[] = [
              { label: 'Onset', offsetSec: onsetSec },
              { label: 'Peak', offsetSec: peakSec },
              { label: 'Resolution', offsetSec: resolSec },
            ].filter((b) => b.offsetSec !== null);

            if (bookmarks.length === 0) return null;

            return (
              <Card style={{ marginTop: theme.spacing.lg }}>
                <Text style={styles.cardTitle}>Event bookmarks</Text>
                {bookmarks.map((b, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [styles.bookmarkRow, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.bookmarkLabel}>
                      {b.label}{' '}
                      <Text style={{ color: theme.colors.textTertiary }}>
                        T+{b.offsetSec}s
                      </Text>
                    </Text>
                    <Text style={styles.bookmarkJump}>jump →</Text>
                  </Pressable>
                ))}
              </Card>
            );
          })()}

          <Card style={{ marginTop: theme.spacing.lg }}>
            <Text style={styles.cardTitle}>Annotation</Text>
            <View style={styles.annotationBox}>
              <TextInput
                placeholder="Add a clinician note for this strip…"
                placeholderTextColor={theme.colors.textTertiary}
                value={annotation}
                onChangeText={setAnnotation}
                multiline
                style={styles.annotationInput}
              />
            </View>
            <Button
              label="Save annotation"
              onPress={saveAnnotation}
              fullWidth
              size="lg"
              style={{ marginTop: theme.spacing.md }}
            />
          </Card>
        </>
      ) : null}
    </Layout>
  );
};