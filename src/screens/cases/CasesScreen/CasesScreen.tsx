import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { CaseCard } from '../../../components/CaseCard/CaseCard';
import { Card } from '../../../components/Card/Card';
import { useCases } from '../../../features/cases/hooks/useCases';
import { useAppTheme } from '../../../context/ThemeContext';
import { createCasesScreenStyles } from './CasesScreen.style';
import { SeverityBadge } from '../../../components/SeverityBadge/SeverityBadge';
import type { CasesTab } from '../../../types';

interface CasesScreenProps {
  navigation: any;
}

const Tab: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}> = ({ label, count, active, onPress }) => {
  const theme = useAppTheme();
  const styles = createCasesScreenStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        active && styles.tabActive,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
        <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
};

export const CasesScreen: React.FC<CasesScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createCasesScreenStyles(theme);
  const { activeTab, setActiveTab, data, counts, loading, error, refetch } = useCases();

  const tabs: { key: CasesTab; label: string; count: number }[] = [
    { key: 'live',      label: 'Live',      count: counts.live },
    { key: 'claimed',   label: 'Claimed',   count: counts.claimed },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'missed',    label: 'Missed',    count: counts.missed },
    { key: 'escalated', label: 'Escalated', count: counts.escalated },
  ];

  return (
    <Layout
      scroll
      padded
      edges={['top']}
      bottomInsetExtra={92}
      onRefresh={refetch}
      refreshing={loading}
    >
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <SectionTitle
        title="Cases"
        subtitle="Triage queue and complete review history."
        style={{ marginTop: theme.spacing.lg }}
      />

      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {tabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              count={t.count}
              active={activeTab === t.key}
              onPress={() => setActiveTab(t.key)}
            />
          ))}
        </ScrollView>
      </View>

      {loading && data.length === 0 ? (
        <View style={styles.statusWrap}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.statusText}>Loading cases…</Text>
        </View>
      ) : error && data.length === 0 ? (
        <View style={styles.statusWrap}>
          <Text style={styles.errorText}>Couldn't load cases.</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      ) : activeTab === 'live' || activeTab === 'claimed' ? (
        data.length === 0 ? (
          <Text style={styles.empty}>No cases here yet.</Text>
        ) : (
          data.map((c) => (
            <CaseCard
              key={c.id}
              caseItem={c}
              onPress={() =>
                navigation.navigate('ClaimDetail', { caseId: c.id })
              }
              onClaim={() =>
                navigation.navigate('ClaimDetail', { caseId: c.id })
              }
            />
          ))
        )
      ) : (
        <Card style={styles.completedCard}>
          <View style={styles.completedHeaderRow}>
            <Text style={[styles.completedHeader, { flex: 1 }]}>DATASET</Text>
            <Text style={[styles.completedHeader, { flex: 1.6 }]}>ANOMALY</Text>
            <Text style={[styles.completedHeader, { flex: 1 }]}>SEVERITY</Text>
          </View>
          {data.map((c, i) => (
            <View
              key={c.id}
              style={[
                styles.completedRow,
                i === data.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.completedCaseId}>{c.datasetLabel}</Text>
              </View>
              <View style={{ flex: 1.6 }}>
                <Text style={styles.completedAnomaly}>{c.anomaly}</Text>
                <Text style={styles.completedPatient}>
                  {c.patientSex} · {c.patientAge}y · {c.patientCode}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <SeverityBadge severity={c.severity} />
              </View>
            </View>
          ))}
        </Card>
      )}
    </Layout>
  );
};