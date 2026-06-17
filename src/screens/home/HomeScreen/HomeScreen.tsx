import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { formatPct, formatSeconds, getTimeGreeting } from '../../../utils/format';
import { Animated, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

interface HomeScreenProps {
  navigation: any;
  unreadCount?: number;
  onBellPress?: () => void;
}
// Simplified ECG path — fewer points, optimized for mobile viewBox 0 0 300 72
const ECG_PATH = `M 0 36 L 30 36 L 34 30 L 38 44 L 40 6 L 44 64 L 48 36 L 80 36 L 84 30 L 88 44 L 90 6 L 94 64 L 98 36 L 130 36 L 134 30 L 138 44 L 140 6 L 144 64 L 148 36 L 180 36 L 184 30 L 188 44 L 190 6 L 194 64 L 198 36 L 230 36 L 234 30 L 238 44 L 240 6 L 244 64 L 248 36 L 280 36 L 284 30 L 288 44 L 290 6 L 294 64 L 298 36 L 300 36`;

const EcgWaveform: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const revealWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(revealWidth, {
          toValue:         screenWidth,
          duration:        5000,
          useNativeDriver: false,
        }),
        Animated.timing(revealWidth, {
          toValue:         0,
          duration:        0,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [revealWidth, screenWidth]);

  return (
    <Animated.View style={{ width: revealWidth, height: 64, overflow: 'hidden' }}>
      <Svg
        width={screenWidth}
        height={64}
        viewBox="0 0 300 72"
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgLinearGradient id="ecgFade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%"   stopColor="rgba(164,228,218,0)"    />
            <Stop offset="5%"   stopColor="rgba(164,228,218,0.22)" />
            <Stop offset="50%"  stopColor="rgba(164,228,218,0.15)" />
            <Stop offset="85%"  stopColor="rgba(164,228,218,0.06)" />
            <Stop offset="100%" stopColor="rgba(164,228,218,0)"    />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={ECG_PATH}
          fill="none"
          stroke="url(#ecgFade)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, unreadCount = 0, onBellPress }) => {
  console.log('[HomeScreen] render');
  const theme = useAppTheme();
  const styles = createHomeScreenStyles(theme);
  const { stats, profile, liveCases, pendingCount, loading, error, refetch } =
    useDashboard();

  useEffect(() => {
    console.log('[HomeScreen] mounted');
    return () => console.log('[HomeScreen] UNMOUNTED');
  }, []);

  useEffect(() => {
    console.log('[HomeScreen] liveCases count:', liveCases.length, '| loading:', loading, '| error:', error);
  }, [liveCases, loading, error]);

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
      <Header
        onProfilePress={() => navigation.navigate('Profile')}
        onBellPress={onBellPress}
        unreadCount={unreadCount}
      />

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
        {/* Full-width ECG waveform — sits above content, faded */}
        <View style={[styles.ecgOverlay, { height: 64 }]} pointerEvents="none">
          <EcgWaveform />
        </View>

        <Text style={styles.heroEyebrow}>AVAILABLE · EMERGENCY REVIEW</Text>
       <Text style={styles.heroTitle}>
          {getTimeGreeting()},{'\n'}Dr. {firstName}.
        </Text>
        <Text style={styles.heroSubtitle}>
          {pendingCount} anomalies are awaiting clinician review. First to claim{' '}
          <Text style={styles.heroSubtitleHighlight}>becomes</Text> the primary
          reviewer.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <StatBadge icon="bolt"        label="Avg response" value={formatSeconds(stats?.avgResponseSec || 0)} />
          </View>
          <View style={styles.statPill}>
            <StatBadge icon="trending-up" label="Today"        value={`$${stats?.todayEarningsUsd ?? 0}`} />
          </View>
          <View style={styles.statPill}>
            <StatBadge icon="activity"    label="Confidence"   value={formatPct(stats?.confidencePct || 0)} />
          </View>
          <View style={styles.statPill}>
            <StatBadge icon="clock"       label="Streak"       value={stats?.streakDays ? `${stats.streakDays}d` : '—'} />
          </View>
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
            showWaveform={false}
          />
        ))
      )}
    </Layout>
  );
};