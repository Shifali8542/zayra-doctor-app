import React from 'react';
import {
  Modal, Pressable, ScrollView, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon } from '../Icon';
import { Button } from '../Button/Button';
import { createMIAlertModalStyles } from './MIAlertModal.style';
import type { WSMIAlert } from '../../types';

interface MIAlertModalProps {
  alerts: WSMIAlert[];
  onClaim: (alertId: string) => void;
  onDismiss: (index: number) => void;
}

const SEV_COLORS = {
  CRITICAL: { bg: '#FEF2F2', border: '#FECACA', dot: '#EF4444', text: '#DC2626', label: 'CRITICAL · MI ALERT' },
  WARNING:  { bg: '#FFF7ED', border: '#FED7AA', dot: '#F97316', text: '#EA580C', label: 'WARNING · MI ALERT' },
  NORMAL:   { bg: '#F0FDF4', border: '#BBF7D0', dot: '#22C55E', text: '#16A34A', label: 'NORMAL · MI ALERT' },
} as const;

export const MIAlertModal: React.FC<MIAlertModalProps> = ({ alerts, onClaim, onDismiss }) => {
  const theme  = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createMIAlertModalStyles(theme);

  if (alerts.length === 0) return null;

  return (
    <Modal
      visible={alerts.length > 0}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Backdrop */}
      <View style={[styles.backdrop, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {alerts.map((alert, i) => {
            const sev    = alert.severity ?? 'WARNING';
            const colors = SEV_COLORS[sev];
            const confPct = Math.round((alert.confidence ?? 0) * 100);

            return (
              <View
                key={alert.alert_id ?? i}
                style={[styles.card, { borderTopColor: colors.dot, backgroundColor: theme.colors.surface }]}
              >
                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: colors.dot }]} />

                <View style={styles.cardBody}>
                  {/* Header row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.eyebrowRow}>
                      {/* Pulse dot */}
                      <View style={styles.pulseWrap}>
                        <View style={[styles.pulseDot, { backgroundColor: colors.dot }]} />
                      </View>
                      <Text style={[styles.eyebrow, { color: colors.text }]}>{colors.label}</Text>
                    </View>
                    <Pressable
                      onPress={() => onDismiss(i)}
                      style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
                    >
                      <Icon name="close-circle" size={18} color={theme.colors.textTertiary} />
                    </Pressable>
                  </View>

                  {/* Patient code */}
                  <View style={styles.patientRow}>
                    <Icon name="stethoscope" size={11} color={theme.colors.textTertiary} strokeWidth={1.8} />
                    <Text style={styles.patientLabel}>PATIENT</Text>
                  </View>
                  <Text style={styles.patientCode}>{alert.patient_code ?? '—'}</Text>

                  {/* Metrics */}
                  <View style={styles.metricsRow}>
                    <View style={[styles.metricChip, { borderColor: theme.colors.border }]}>
                      <Text style={styles.metricLabel}>CONFIDENCE</Text>
                      <Text style={[styles.metricValue, { color: colors.text }]}>{confPct}%</Text>
                    </View>
                    <View style={[styles.metricChip, { borderColor: theme.colors.border }]}>
                      <Text style={styles.metricLabel}>DETECTED</Text>
                      <Text style={styles.metricValue}>
                        {alert.timestamp
                          ? new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </Text>
                    </View>
                  </View>

                  {/* Recommendation */}
                  {alert.recommendation ? (
                    <View style={[styles.recommendBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundAlt }]}>
                      <Text style={styles.recommendText}>{alert.recommendation}</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  <View style={styles.actions}>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Claim & Report"
                        variant="primary"
                        size="sm"
                        iconLeft="stethoscope"
                        fullWidth
                        onPress={() => alert.alert_id && onClaim(alert.alert_id)}
                        disabled={!alert.alert_id}
                      />
                    </View>
                    <View style={{ width: theme.spacing.sm }} />
                    <Button
                      label="Dismiss"
                      variant="secondary"
                      size="sm"
                      onPress={() => onDismiss(i)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};