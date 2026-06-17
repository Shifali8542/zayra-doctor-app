/**
 * EarningsScreen.tsx
 * Matches doctor web's Earnings page exactly.
 * Mock summary/chart data (same as web) + real completed cases from API.
 */
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../../components/Header/Header';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { Card } from '../../../components/Card/Card';
import { SeverityBadge } from '../../../components/SeverityBadge/SeverityBadge';
import { useEarnings } from '../../../features/earnings/hooks/useEarnings';
import { useAppTheme } from '../../../context/ThemeContext';
import { createEarningsScreenStyles } from './EarningsScreen.style';
import type { EarningsBySeverity, RecentReviewRow } from '../../../types';

interface EarningsScreenProps { navigation: any; }

// Mock summary — same as web
const SUMMARY = { today: 184, thisWeek: 1240, thisMonth: 5320, pendingPayout: 412 };

// Mock severity chart — same as web
const BY_SEVERITY: EarningsBySeverity[] = [
  { label: 'Critical', amount: 720,  max: 1980 },
  { label: 'Urgent',   amount: 1840, max: 1980 },
  { label: 'Routine',  amount: 1980, max: 1980 },
  { label: 'Info',     amount: 780,  max: 1980 },
];

const SummaryCard: React.FC<{
  label: string; value: string; gradient?: boolean;
  styles: ReturnType<typeof createEarningsScreenStyles>;
  theme: ReturnType<typeof useAppTheme>;
}> = ({ label, value, gradient, styles, theme }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <Text style={[styles.summaryLabel, { color: 'rgba(255,255,255,0.8)' }]}>{label}</Text>
        <Text style={[styles.summaryValue, { color: '#fff' }]}>{value}</Text>
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
};

const BarRow: React.FC<{
  item: EarningsBySeverity;
  styles: ReturnType<typeof createEarningsScreenStyles>;
  theme: ReturnType<typeof useAppTheme>;
}> = ({ item, styles, theme }) => {
  const pct = (item.amount / item.max) * 100;
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{item.label}</Text>
        <Text style={styles.barAmount}>${item.amount.toLocaleString()}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` as any }]} />
      </View>
    </View>
  );
};

export const EarningsScreen: React.FC<EarningsScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createEarningsScreenStyles(theme);
  const insets = useSafeAreaInsets();
  const { completedCases, loading, error } = useEarnings();

  // Map completed cases → table rows (payout estimated from severity)
  const reviewRows: RecentReviewRow[] = useMemo(() =>
    completedCases.slice(0, 20).map((c) => ({
      caseId: c.caseId,
      anomaly: c.anomaly,
      severity: c.severity === 'CRITICAL' ? 'critical' : c.severity === 'URGENT' ? 'urgent' : 'routine',
      completedAt: c.ageMinutes > 0
        ? new Date(Date.now() - c.ageMinutes * 60000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—',
      payout: c.severity === 'CRITICAL' ? 36 : c.severity === 'URGENT' ? 24 : 16,
    })),
    [completedCases],
  );

  const ListHeader = (
    <>
      {/* Summary grid */}
      <View style={styles.summaryGrid}>
        <SummaryCard label="Today"          value={`$${SUMMARY.today}`}          gradient styles={styles} theme={theme} />
        <SummaryCard label="This week"      value={`$${SUMMARY.thisWeek.toLocaleString()}`}   styles={styles} theme={theme} />
        <SummaryCard label="This month"     value={`$${SUMMARY.thisMonth.toLocaleString()}`}  styles={styles} theme={theme} />
        <SummaryCard label="Pending payout" value={`$${SUMMARY.pendingPayout}`}  styles={styles} theme={theme} />
      </View>

      {/* Earnings by severity */}
      <Card style={{ marginTop: theme.spacing.lg }}>
        <Text style={styles.cardTitle}>Earnings by severity (30d)</Text>
        {BY_SEVERITY.map((item) => (
          <BarRow key={item.label} item={item} styles={styles} theme={theme} />
        ))}
      </Card>

      {/* Next payout */}
      <LinearGradient
        colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.payoutCard}
      >
        <Text style={styles.payoutTitle}>Next payout</Text>
        <Text style={styles.payoutSub}>Settlement on Friday</Text>
        <Text style={styles.payoutAmount}>${SUMMARY.pendingPayout}</Text>
      </LinearGradient>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={styles.sectionTitle}>Recent reviews</Text>
      </View>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCol, { flex: 1 }]}>CASE</Text>
        <Text style={[styles.tableCol, { flex: 2 }]}>ANOMALY</Text>
        <Text style={[styles.tableCol, { flex: 1 }]}>SEVERITY</Text>
        <Text style={[styles.tableCol, { flex: 0.8, textAlign: 'right' }]}>WHEN</Text>
        <Text style={[styles.tableCol, { flex: 0.6, textAlign: 'right' }]}>PAY</Text>
      </View>
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <Header onProfilePress={() => navigation.navigate('Profile')} />
        <SectionTitle title="Earnings" subtitle="Reviewed cases, payouts and settlements." style={{ marginTop: theme.spacing.lg }} />
      </View>

      <FlatList
        data={reviewRows}
        keyExtractor={(item, i) => `${item.caseId}-${i}`}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
          <View style={[styles.tableRow, index === reviewRows.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>{item.caseId}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{item.anomaly}</Text>
            <View style={{ flex: 1 }}>
              <SeverityBadge severity={item.severity === 'critical' ? 'CRITICAL' : item.severity === 'urgent' ? 'URGENT' : 'ROUTINE'} />
            </View>
            <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'right' }]}>{item.completedAt}</Text>
            <Text style={[styles.tableCell, { flex: 0.6, textAlign: 'right', color: theme.colors.success, fontWeight: '700' }]}>${item.payout}</Text>
          </View>
        )}
        ListEmptyComponent={
          loading
            ? <View style={styles.emptyWrap}><ActivityIndicator color={theme.colors.primary} /></View>
            : error
              ? <Text style={styles.emptyText}>Couldn't load completed cases.</Text>
              : <Text style={styles.emptyText}>No completed cases yet.</Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
