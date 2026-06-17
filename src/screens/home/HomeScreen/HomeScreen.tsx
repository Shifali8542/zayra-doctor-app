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
const ECG_PATH = `M 0 36
L 10 36 L 15 30 L 20 36
L 30 36 L 34 30 L 38 44 L 40 6 L 44 64 L 48 32 L 55 36
L 80 36 L 85 30 L 90 36
L 100 36 L 104 30 L 108 44 L 110 6 L 114 64 L 118 32 L 125 36
L 150 36 L 155 30 L 160 36
L 170 36 L 174 30 L 178 44 L 180 6 L 184 64 L 188 32 L 195 36
L 220 36 L 225 30 L 230 36
L 240 36 L 244 30 L 248 44 L 250 6 L 254 64 L 258 32 L 265 36
L 290 36 L 295 30 L 300 36
L 310 36 L 314 30 L 318 44 L 320 6 L 324 64 L 328 32 L 335 36
L 360 36 L 365 30 L 370 36
L 380 36 L 384 30 L 388 44 L 390 6 L 394 64 L 398 32 L 405 36
L 430 36 L 435 30 L 440 36
L 450 36 L 454 30 L 458 44 L 460 6 L 464 64 L 468 32 L 475 36
L 500 36 L 505 30 L 510 36
L 520 36 L 524 30 L 528 44 L 530 6 L 534 64 L 538 32 L 545 36
L 570 36 L 575 30 L 580 36
L 590 36 L 594 30 L 598 44 L 600 6 L 604 64 L 608 32 L 615 36
L 640 36 L 645 30 L 650 36
L 660 36 L 664 30 L 668 44 L 670 6 L 674 64 L 678 32 L 685 36
L 710 36 L 715 30 L 720 36
L 730 36 L 734 30 L 738 44 L 740 6 L 744 64 L 748 32 L 755 36
L 780 36 L 785 30 L 790 36
L 800 36 L 804 30 L 808 44 L 810 6 L 814 64 L 818 32 L 825 36
L 850 36 L 855 30 L 860 36
L 870 36 L 874 30 L 878 44 L 880 6 L 884 64 L 888 32 L 895 36
L 920 36 L 925 30 L 930 36
L 940 36 L 944 30 L 948 44 L 950 6 L 954 64 L 958 32 L 965 36
L 990 36 L 995 30 L 1000 36`;

const EcgWaveform: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  // revealWidth: 0 → screenWidth over 4s, instant reset, infinite loop
  const revealWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(revealWidth, {
          toValue:         screenWidth,
          duration:        4000,
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
    <Animated.View style={{ width: revealWidth, height: 72, overflow: 'hidden' }}>
      <Svg
        width={screenWidth}
        height={72}
        viewBox="0 0 1000 72"
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgLinearGradient id="ecgFade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%"   stopColor="rgba(180,210,230,0)"    />
            <Stop offset="3%"   stopColor="rgba(180,210,230,0.18)" />
            <Stop offset="50%"  stopColor="rgba(180,210,230,0.13)" />
            <Stop offset="82%"  stopColor="rgba(180,210,230,0.06)" />
            <Stop offset="100%" stopColor="rgba(180,210,230,0)"    />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={ECG_PATH}
          fill="none"
          stroke="url(#ecgFade)"
          strokeWidth="2.9"
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
        <View style={styles.ecgOverlay} pointerEvents="none">
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