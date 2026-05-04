import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
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
  const {
    caseItem, rhythm, zoom, zoomIn, zoomOut,
    annotation, setAnnotation, saveAnnotation,
    loading, error,
  } = useTraceView(patientId);

  const containerW = Math.min(getMaxContentWidth(deviceType), 600) - 80;
  const stripWidth = Math.max(220, containerW * zoom);
  const stripHeight = 130;

  const sev = caseItem.severity === 'CRITICAL'
    ? 'critical'
    : caseItem.severity === 'URGENT'
      ? 'urgent'
      : 'normal';

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={92}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <View style={styles.titleWrap}>
        <Text style={styles.title}>TraceView</Text>
        <Text style={styles.subtitle}>
          {caseItem.datasetLabel} · Lead II · 25 mm/s · 10 mm/mV · {caseItem.signalQ}
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

          <View style={styles.strip}>
            <View style={styles.stripHeader}>
              <Text style={styles.stripLabel}>BEFORE</Text>
              <Text style={styles.stripMeta}>II · 25MM/S</Text>
            </View>
            <EcgWaveform
              width={stripWidth}
              height={stripHeight}
              severity="normal"
              seed={11}
              cycles={Math.round(4 * zoom)}
            />
          </View>

          <View style={[styles.strip, styles.stripHighlight]}>
            <View style={styles.stripHeader}>
              <Text style={styles.stripLabel}>DURING ANOMALY</Text>
              <Text style={styles.stripMeta}>II · 25MM/S</Text>
            </View>
            <EcgWaveform
              width={stripWidth}
              height={stripHeight}
              severity={sev}
              seed={42}
              cycles={Math.round(6 * zoom)}
            />
          </View>

          <View style={styles.strip}>
            <View style={styles.stripHeader}>
              <Text style={styles.stripLabel}>AFTER</Text>
              <Text style={styles.stripMeta}>II · 25MM/S</Text>
            </View>
            <EcgWaveform
              width={stripWidth}
              height={stripHeight}
              severity="urgent"
              seed={73}
              cycles={Math.round(5 * zoom)}
            />
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