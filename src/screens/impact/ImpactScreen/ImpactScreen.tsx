import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Card } from '../../../components/Card/Card';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { Icon } from '../../../components/Icon';
import { useImpact } from '../../../features/impact/hooks/useImpact';
import { useAppTheme } from '../../../context/ThemeContext';
import { createImpactScreenStyles } from './ImpactScreen.style';
import { formatSeconds } from '../../../utils/format';

interface ImpactScreenProps {
  navigation: any;
}

interface ImpactStatProps {
  icon: any;
  label: string;
  value: string | number;
}

const ImpactStat: React.FC<ImpactStatProps> = ({ icon, label, value }) => {
  const theme = useAppTheme();
  const styles = createImpactScreenStyles(theme);
  return (
    <View style={styles.statTile}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={16} color={theme.colors.textOnDarkSubtle} strokeWidth={1.8} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
};

const ProgressBar: React.FC<{ value: number; max: number }> = ({
  value, max,
}) => {
  const theme = useAppTheme();
  const styles = createImpactScreenStyles(theme);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
};

export const ImpactScreen: React.FC<ImpactScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createImpactScreenStyles(theme);
  const { stats, moments, loading, refetch } = useImpact();

  return (
<Layout scroll padded edges={['top']} bottomInsetExtra={92} onRefresh={refetch} refreshing={loading}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <SectionTitle
        title="Impact"
        subtitle="Your contribution to cardiac vigilance."
        style={{ marginTop: theme.spacing.lg }}
      />

      {/* Hero rank card */}
      <LinearGradient
        colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroEyebrow}>YOU RANK</Text>
        <Text style={styles.heroBig}>Top {stats.rankPct}%</Text>
        <Text style={styles.heroDesc}>
          Among {stats.totalDoctors.toLocaleString()} active cardiologists in the Zayra network this quarter.
        </Text>

        <View style={styles.statsGrid}>
          <ImpactStat icon="heart" label="REVIEWED" value={stats.reviewed.toLocaleString()} />
          <View style={styles.gridGap} />
          <ImpactStat icon="trace" label="ESCALATIONS" value={stats.escalations} />
        </View>
        <View style={styles.statsGrid}>
          <ImpactStat icon="medal" label="AVG RESPONSE" value={formatSeconds(stats.avgResponseSec)} />
          <View style={styles.gridGap} />
          <ImpactStat icon="flame" label="STREAK" value={`${stats.streakDays}d`} />
        </View>
      </LinearGradient>

      {/* Decision confidence */}
      <Card style={{ marginTop: theme.spacing.xl }}>
        <Text style={styles.cardEyebrow}>DECISION CONFIDENCE</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNumber}>{stats.decisionConfidence}</Text>
          <Text style={styles.scoreSlash}>/ 100</Text>
        </View>
        <ProgressBar value={stats.decisionConfidence} max={100} />
      </Card>

      {/* Reliability */}
      <Card style={{ marginTop: theme.spacing.lg }}>
        <Text style={styles.cardEyebrow}>RELIABILITY</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNumber}>{stats.reliability}</Text>
          <Text style={styles.scoreSlash}>/ 100</Text>
        </View>
        <ProgressBar value={stats.reliability} max={100} />
      </Card>

      {/* Lifesaving moments */}
      <Card style={{ marginTop: theme.spacing.lg }}>
        <View style={styles.lifesavingHeader}>
          <Icon name="shield-check" size={18} color={theme.colors.textPrimary} strokeWidth={1.8} />
          <Text style={styles.lifesavingTitle}>Lifesaving moments</Text>
        </View>
        {moments.map((m, i) => (
          <View
            key={`${m.when}-${i}`}
            style={styles.momentRow}
          >
            <Text style={styles.momentWhen}>{m.when}</Text>
            <Text style={styles.momentDesc}>{m.description}</Text>
          </View>
        ))}
      </Card>
    </Layout>
  );
};
