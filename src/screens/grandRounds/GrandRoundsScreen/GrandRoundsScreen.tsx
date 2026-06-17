/**
 * GrandRoundsScreen.tsx
 * Matches doctor web's GrandRounds page exactly — same mock data, same layout.
 * Mock data only (web uses static data too).
 */
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../components/Header/Header';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { Icon } from '../../../components/Icon';
import { useAppTheme } from '../../../context/ThemeContext';
import { createGrandRoundsScreenStyles } from './GrandRoundsScreen.style';
import type { GrandRoundsThread } from '../../../types';

interface GrandRoundsScreenProps { navigation: any; }

// Same mock data as doctor web
const THREADS: GrandRoundsThread[] = [
  {
    id: '1', initials: 'SU', authorName: 'Dr. A. Subramaniam',
    specialty: 'Cardiac Electrophysiology', timeAgo: '3h',
    title: 'Repolarization heterogeneity preceding torsades — a 4-case series',
    replies: 38, saved: 142,
  },
  {
    id: '2', initials: 'OK', authorName: 'Dr. L. Okafor',
    specialty: 'Interventional Cardiology', timeAgo: '9h',
    title: 'AI-flagged silent ischemia: should the threshold be tighter?',
    replies: 24, saved: 87,
  },
  {
    id: '3', initials: 'CH', authorName: 'Dr. M. Chen',
    specialty: 'Heart Failure', timeAgo: '1d',
    title: 'Sleep-onset bradyarrhythmia patterns in HFpEF',
    replies: 17, saved: 64,
  },
  {
    id: '4', initials: 'PR', authorName: 'Dr. S. Prabhu',
    specialty: 'Pediatric Cardiology', timeAgo: '2d',
    title: 'Neonatal QT prolongation: screening thresholds revisited',
    replies: 11, saved: 43,
  },
  {
    id: '5', initials: 'WA', authorName: 'Dr. E. Watts',
    specialty: 'Cardiac Imaging', timeAgo: '3d',
    title: 'CMR vs echo in non-ischemic cardiomyopathy — when to escalate?',
    replies: 29, saved: 98,
  },
];

const ThreadCard: React.FC<{
  item: GrandRoundsThread;
  styles: ReturnType<typeof createGrandRoundsScreenStyles>;
  theme: ReturnType<typeof useAppTheme>;
}> = React.memo(({ item, styles, theme }) => (
  <View style={styles.card}>
    <View style={styles.authorRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.authorInfo}>
        <Text style={styles.authorName}>{item.authorName}</Text>
        <Text style={styles.authorMeta}>{item.specialty} · {item.timeAgo}</Text>
      </View>
    </View>

    <Text style={styles.title}>{item.title}</Text>

    <View style={styles.footerRow}>
      <View style={styles.metaChip}>
        <Icon name="cases" size={13} color={theme.colors.textTertiary} strokeWidth={1.8} />
        <Text style={styles.metaText}>{item.replies} replies</Text>
      </View>
      <View style={styles.metaChip}>
        <Icon name="bookmark" size={13} color={theme.colors.textTertiary} strokeWidth={1.8} />
        <Text style={styles.metaText}>{item.saved} saved</Text>
      </View>
      <Pressable style={({ pressed }) => [styles.openBtn, pressed && { opacity: 0.7 }]}>
        <Text style={styles.openBtnText}>Open thread</Text>
      </Pressable>
    </View>
  </View>
));

export const GrandRoundsScreen: React.FC<GrandRoundsScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createGrandRoundsScreenStyles(theme);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <Header onProfilePress={() => navigation.navigate('Profile')} />
        <SectionTitle
          title="Grand Rounds"
          subtitle="Discussions, pearls and protocol updates from peers."
          style={{ marginTop: theme.spacing.lg }}
        />
      </View>

      <FlatList
        data={THREADS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThreadCard item={item} styles={styles} theme={theme} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md }} />}
      />
    </View>
  );
};
