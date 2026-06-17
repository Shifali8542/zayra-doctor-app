/**
 * EcgAtlasScreen.tsx
 * Matches doctor web's ECG Atlas page exactly.
 * Same mock data, same ECG SVG paths, same hero + card layout.
 */
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Header } from '../../../components/Header/Header';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { Icon } from '../../../components/Icon';
import { useAppTheme } from '../../../context/ThemeContext';
import { createEcgAtlasScreenStyles } from './EcgAtlasScreen.style';
import type { AtlasCase } from '../../../types';

interface EcgAtlasScreenProps { navigation: any; }

// Same ECG path as doctor web
const ECG_PATH_NORMAL = 'M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30';
const ECG_PATH_VT = 'M 0 30 L 4 30 L 6 26 L 8 34 L 10 4.8 L 12 46.8 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 4.8 L 42 46.8 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 4.8 L 72 46.8 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 4.8 L 102 46.8 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 4.8 L 132 46.8 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 4.8 L 162 46.8 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 4.8 L 192 46.8 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 4.8 L 222 46.8 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 4.8 L 252 46.8 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 4.8 L 282 46.8 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30';

// Same mock data as doctor web's "Continue learning" section
const ATLAS_CASES: AtlasCase[] = [
  {
    id: '1', tag: 'VT', durationMin: 6,
    title: 'Wide-complex tachycardia: VT vs SVT-aberrant',
    difficulty: 'Advanced', strokeColor: '#D04E5C',
    ecgPath: ECG_PATH_VT,
  },
  {
    id: '2', tag: 'STEMI', durationMin: 4,
    title: 'Subtle posterior STEMI in lead V2',
    difficulty: 'Intermediate', strokeColor: '#E0A23A',
    ecgPath: ECG_PATH_NORMAL,
  },
  {
    id: '3', tag: 'AV Block', durationMin: 5,
    title: 'Mobitz II with 2:1 conduction',
    difficulty: 'Advanced', strokeColor: '#E0A23A',
    ecgPath: ECG_PATH_NORMAL,
  },
  {
    id: '4', tag: 'AFib', durationMin: 3,
    title: 'Atrial fibrillation with rapid ventricular response',
    difficulty: 'Beginner', strokeColor: '#1FA59B',
    ecgPath: ECG_PATH_NORMAL,
  },
  {
    id: '5', tag: 'LBBB', durationMin: 5,
    title: 'New LBBB — ischemia equivalent?',
    difficulty: 'Intermediate', strokeColor: '#E0A23A',
    ecgPath: ECG_PATH_NORMAL,
  },
  {
    id: '6', tag: 'WPW', durationMin: 6,
    title: 'Delta waves and pre-excitation in WPW',
    difficulty: 'Advanced', strokeColor: '#D04E5C',
    ecgPath: ECG_PATH_VT,
  },
] as (AtlasCase & { ecgPath: string })[];

const MiniEcg: React.FC<{ path: string; stroke: string }> = ({ path, stroke }) => (
  <Svg width="100%" height={70} viewBox="0 0 300 60" preserveAspectRatio="none">
    <Path d={path} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
  </Svg>
);

const AtlasCaseCard: React.FC<{
  item: AtlasCase & { ecgPath: string };
  styles: ReturnType<typeof createEcgAtlasScreenStyles>;
  theme: ReturnType<typeof useAppTheme>;
}> = React.memo(({ item, styles, theme }) => (
  <View style={styles.card}>
    <View style={styles.cardWaveform}>
      <MiniEcg path={item.ecgPath} stroke={item.strokeColor} />
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardMeta}>
        <Text style={styles.cardTag}>{item.tag}</Text>
        <Text style={styles.cardDuration}>{item.durationMin} min</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.openBtn, pressed && { opacity: 0.7 }]}>
          <Text style={styles.openBtnText}>Open →</Text>
        </Pressable>
      </View>
    </View>
  </View>
));

export const EcgAtlasScreen: React.FC<EcgAtlasScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createEcgAtlasScreenStyles(theme);
  const insets = useSafeAreaInsets();

  const ListHeader = (
    <>
      {/* Stats row — same as web */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Icon name="trophy" size={13} color={theme.colors.accent} strokeWidth={1.8} />
          <Text style={styles.statText}>84% accuracy</Text>
        </View>
        <View style={styles.statChip}>
          <Icon name="bolt" size={13} color={theme.colors.warning} strokeWidth={1.8} />
          <Text style={styles.statText}>142 solved</Text>
        </View>
      </View>

      {/* Hero — "Case of the day" */}
      <View style={styles.heroCard}>
        <View style={styles.heroWaveform}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>CASE OF THE DAY</Text>
          </View>
          <MiniEcg path={ECG_PATH_NORMAL} stroke={theme.colors.warning} />
          <Text style={styles.heroMeta}>Anonymized · 58F · ambulatory · lead V2</Text>
        </View>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Subtle posterior STEMI in lead V2</Text>
          <Text style={styles.heroDesc}>
            Reciprocal changes seen as ST depression and tall R-waves in V1–V3. Walk through the diagnostic reasoning with 4 expert annotations.
          </Text>
          <View style={styles.heroTags}>
            {['STEMI', 'POSTERIOR', '4 MIN', 'INTERMEDIATE'].map((tag) => (
              <View key={tag} style={styles.heroTag}>
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Pressable style={({ pressed }) => [styles.beginBtn, pressed && { opacity: 0.85 }]}>
            <Icon name="book" size={16} color={theme.colors.textOnDark} strokeWidth={1.8} />
            <Text style={styles.beginBtnText}>Begin case</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.continueTitle}>Continue learning</Text>
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <Header onProfilePress={() => navigation.navigate('Profile')} />
        <SectionTitle
          title="ECG Atlas"
          subtitle="Case-based learning · expert-reviewed · anonymized"
          style={{ marginTop: theme.spacing.lg }}
        />
      </View>

      <FlatList
        data={ATLAS_CASES as (AtlasCase & { ecgPath: string })[]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <AtlasCaseCard item={item as AtlasCase & { ecgPath: string }} styles={styles} theme={theme} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
