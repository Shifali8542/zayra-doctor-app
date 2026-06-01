import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { CaseViewModel } from '../../types';
import { Card } from '../Card/Card';
import { SeverityBadge } from '../SeverityBadge/SeverityBadge';
import { MetricCard } from '../MetricCard/MetricCard';
import { WaveformPlaceholder } from '../WaveformPlaceholder/WaveformPlaceholder';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import { createCaseCardStyles } from './CaseCard.style';
import { formatRelativeMinutes } from '../../utils/format';

interface CaseCardProps {
  caseItem: CaseViewModel;
  onPress?: () => void;
  onClaim?: () => void;
  showClaim?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = React.memo(({
  caseItem,
  onPress,
  onClaim,
  showClaim = true,
}) => {

  const theme = useAppTheme();
  const styles = createCaseCardStyles(theme);

  const seedFromId = caseItem.caseId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <SeverityBadge severity={caseItem.severity} />
          <Text style={styles.caseId} numberOfLines={1}>
            {caseItem.patientCode}
          </Text>
          <View style={styles.timeWrap}>
            <Icon name="clock" size={13} color={theme.colors.textTertiary} strokeWidth={1.8} />
            <Text style={styles.time}>{formatRelativeMinutes(caseItem.ageMinutes)}</Text>
            {caseItem.severity === 'CRITICAL' && (
              <View style={styles.pulseDot} />
            )}
          </View>
        </View>

        <Text style={styles.anomalyTitle}>{caseItem.anomaly}</Text>
        <Text style={styles.patientLine}>
          {caseItem.patientSex} · {caseItem.patientAge}y · {caseItem.patientCode}
        </Text>

        <WaveformPlaceholder seed={seedFromId} style={styles.waveform} />

        <View style={styles.metricsRow}>
          <MetricCard
            label="HR"
            value={caseItem.hr ?? '—'}
            unit="bpm"
            delta={
              caseItem.hrDelta != null
                ? `${caseItem.hrDelta > 0 ? '+' : ''}${caseItem.hrDelta}`
                : undefined
            }
          />
          <View style={styles.metricGap} />
          <MetricCard
            label="HRV"
            value={caseItem.hrv ?? '—'}
            unit="ms"
          />
          <View style={styles.metricGap} />
          <MetricCard
            label="CONFIDENCE"
            value={caseItem.confidence}
            unit="%"
          />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <View style={styles.datasetPill}>
              <Text style={styles.datasetPillText} numberOfLines={1}>
                {caseItem.datasetLabel}
              </Text>
            </View>
            {caseItem.recordName ? (
              <View style={[styles.iconRow, { marginLeft: 10 }]}>
                <Icon name="trace" size={13} color={theme.colors.textTertiary} strokeWidth={1.8} />
                <Text style={styles.footerText} numberOfLines={1}>{caseItem.recordName}</Text>
              </View>
            ) : null}
          </View>
          {showClaim && caseItem.status === 'live' ? (
            <Button
              label="Claim"
              size="sm"
              onPress={onClaim}
              iconRight="chevron-right"
            />
          ) : caseItem.status === 'claimed' ? (
            <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: '700' }]}>
              {caseItem.doctorName ? `Dr. ${caseItem.doctorName}` : 'Claimed'}
            </Text>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
});