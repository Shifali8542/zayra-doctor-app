import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { StatBadge } from '../../../components/StatBadge/StatBadge';
import { CaseCard } from '../../../components/CaseCard/CaseCard';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { Icon } from '../../../components/Icon';
import { useDashboard } from '../../../features/dashboard/hooks/useDashboard';
import { useAppTheme } from '../../../context/ThemeContext';
import { createHomeScreenStyles } from './HomeScreen.style';
import { formatCurrency, formatPct, formatSeconds } from '../../../utils/format';
import Svg, { Polyline } from 'react-native-svg';

interface HomeScreenProps {
  navigation: any;
}

const MiniHeartbeat: React.FC = () => (
  <Svg width={36} height={120} viewBox="0 0 36 120" fill="none">
    <Polyline
      points="2,60 8,60 12,30 16,90 20,50 24,60 34,60"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createHomeScreenStyles(theme);
  const { stats, profile, liveCases, pendingCount, loading, error, refetch } =
    useDashboard();

  const [homeSearch, setHomeSearch] = useState('');
  const firstName = profile?.name ? profile.name.split(' ').slice(-1)[0] : 'Doctor';
  const goToClaim = (caseId: number) => {
    navigation.navigate('ClaimDetail', { caseId });
  };

  const filteredCases = useMemo(() => {
    if (!homeSearch.trim()) return liveCases;
    const q = homeSearch.toLowerCase();
    return liveCases.filter(
      (c) =>
        c.anomaly?.toLowerCase().includes(q) ||
        c.datasetLabel?.toLowerCase().includes(q) ||
        c.patientCode?.toLowerCase().includes(q) ||
        c.severity?.toLowerCase().includes(q),
    );
  }, [liveCases, homeSearch]);

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

      <LinearGradient
        colors={[
          theme.colors.heroGradientFrom,
          theme.colors.heroGradientMid,
          theme.colors.heroGradientTo,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroBeat}>
          <MiniHeartbeat />
        </View>

        <Text style={styles.heroEyebrow}>AVAILABLE · EMERGENCY REVIEW</Text>
        <Text style={styles.heroTitle}>
          Good evening,{'\n'}Dr. {firstName}.
        </Text>
        <Text style={styles.heroSubtitle}>
          {pendingCount} anomalies are awaiting clinician review. First to claim{' '}
          <Text style={styles.heroSubtitleHighlight}>becomes</Text> the primary
          reviewer.
        </Text>

        <View style={styles.statsCol}>
          <StatBadge icon="bolt" label="Avg response" value={formatSeconds(stats?.avgResponseSec || 0)} />
          <View style={styles.statGap} />
          <StatBadge icon="trending-up" label="Today" value={formatCurrency(stats?.todayEarningsUsd || 0)} />
          <View style={styles.statGap} />
          <StatBadge icon="activity" label="Confidence" value={formatPct(stats?.confidencePct || 0)} />
          <View style={styles.statGap} />
          <StatBadge icon="clock" label="Streak" value={`${stats?.streakDays || 0}d`} />
        </View>
      </LinearGradient>

      <View style={styles.casesHeader}>
        <SectionTitle
          title="Cases live now"
          subtitle="Sorted by severity and elapsed time. Claim within 60s for response bonus."
        />
      </View>

      {/* ── Search bar ── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.pill,
        borderWidth: 1,
        borderColor: theme.colors.divider,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm as any,
      }}>
        <Icon name="search" size={16} color={theme.colors.textTertiary} />
        <TextInput
          style={{
            ...theme.typography.body,
            color: theme.colors.textPrimary,
            flex: 1,
            paddingVertical: 4,
          }}
          placeholder="Search anomaly, dataset, patient…"
          placeholderTextColor={theme.colors.textTertiary}
          value={homeSearch}
          onChangeText={setHomeSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {homeSearch.length > 0 && (
          <Pressable onPress={() => setHomeSearch('')} style={{ padding: 4 }}>
            <Icon name="close-circle" size={16} color={theme.colors.textTertiary} />
          </Pressable>
        )}
      </View>

      {loading && liveCases.length === 0 ? (
        <View style={styles.statusWrap}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.statusText}>Loading live cases…</Text>
        </View>
      ) : error && liveCases.length === 0 ? (
        <View style={styles.statusWrap}>
          <Text style={styles.errorText}>
            Couldn't reach the server. Pull down to retry.
          </Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      ) : liveCases.length === 0 ? (
        <View style={styles.statusWrap}>
          <Text style={styles.statusText}>No live cases right now.</Text>
        </View>
      ) : filteredCases.length === 0 ? (
        <View style={styles.statusWrap}>
          <Text style={styles.statusText}>No cases match "{homeSearch}"</Text>
        </View>
      ) : (
        filteredCases.map((c) => (
          <CaseCard
            key={c.id}
            caseItem={c}
            onPress={() => goToClaim(c.patientId)}
            onClaim={() => goToClaim(c.patientId)}
          />
        ))
      )}
    </Layout>
  );
};