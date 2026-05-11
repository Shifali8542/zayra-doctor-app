import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Card } from '../../../components/Card/Card';
import { Button } from '../../../components/Button/Button';
import { Icon } from '../../../components/Icon';
import { EcgWaveform } from '../../../components/EcgWaveform/EcgWaveform';
import { useTraceView } from '../../../features/traceview/hooks/useTraceView';
import { useAppTheme } from '../../../context/ThemeContext';
import { createTraceViewScreenStyles } from './TraceViewScreen.style';
import { useResponsive } from '../../../utils/useResponsive';
import { getMaxContentWidth } from '../../../utils/responsive';

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
  const { deviceType } = useResponsive();
  const patientId: number | undefined = route?.params?.patientId;
  const recordId: number | undefined  = route?.params?.recordId;
  const {
    caseItem, rhythm,
    waveformData, effectiveSamplingRate, segments,
    records, totalRecords, activeRecordId, activeRecordIndex, selectRecord,
    zoom, zoomIn, zoomOut,
    annotation, setAnnotation, saveAnnotation,
    loading, waveformLoading, error,
  } = useTraceView(patientId, recordId);

  const containerW = Math.min(getMaxContentWidth(deviceType), 600) - 80;
  const stripWidth = Math.max(220, containerW * zoom);
  const stripHeight = 130;

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={92}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <View style={styles.titleWrap}>
        <Text style={styles.title}>TraceView</Text>
        <Text style={styles.subtitle}>
          {caseItem?.datasetLabel ?? '—'} · Lead II · 25 mm/s · 10 mm/mV · {caseItem?.signalQ ?? '—'}
        </Text>
      </View>

      {loading ? (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>
            Loading waveform…
          </Text>
        </View>
      ) : error ? (
        <Text style={{ color: theme.colors.danger, textAlign: 'center', paddingVertical: 24 }}>
          {error}
        </Text>
      ) : (
        <>
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
              contentContainerStyle={{ paddingHorizontal: 2, flexDirection: 'row', gap: 8 }}
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
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

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
                  ? `ECG ${activeRecordIndex + 1} OF ${totalRecords} · LEAD II`
                  : 'LEAD II'}
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
            ) : waveformData ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <EcgWaveform
                  width={Math.max(stripWidth, 600)}
                  height={stripHeight}
                  data={waveformData}
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
          <Card style={{ marginTop: theme.spacing.xxl }}>
            <Text style={styles.cardTitle}>Rhythm summary</Text>
            <View style={styles.kvRow}><Text style={styles.kvLabel}>Rate</Text><Text style={styles.kvValue}>{rhythm.rate} bpm</Text></View>
            <View style={styles.kvRow}><Text style={styles.kvLabel}>QRS width</Text><Text style={styles.kvValue}>{rhythm.qrsWidth} ms</Text></View>
            <View style={styles.kvRow}><Text style={styles.kvLabel}>QT / QTc</Text><Text style={styles.kvValue}>{rhythm.qt} / {rhythm.qtc} ms</Text></View>
            <View style={[styles.kvRow, { borderBottomWidth: 0 }]}><Text style={styles.kvLabel}>Axis</Text><Text style={styles.kvValue}>{rhythm.axis}°</Text></View>
          </Card>

          <Card style={{ marginTop: theme.spacing.lg }}>
            <Text style={styles.cardTitle}>Event bookmarks</Text>
            {rhythm.bookmarks.map((b) => (
              <Pressable
                key={b.label}
                style={({ pressed }) => [styles.bookmarkRow, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.bookmarkLabel}>{b.label} {b.offset}</Text>
                <Text style={styles.bookmarkJump}>jump →</Text>
              </Pressable>
            ))}
          </Card>

          <Card style={{ marginTop: theme.spacing.lg }}>
            <Text style={styles.cardTitle}>Annotations</Text>
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
      )}
    </Layout>
  );
};