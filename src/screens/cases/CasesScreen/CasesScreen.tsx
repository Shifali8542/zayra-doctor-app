/**
 * CasesScreen.tsx
 *
 * PERMANENT FIX — addViewAt: failed to insert view at index 16, count=1
 * ─────────────────────────────────────────────────────────────────────────────
 * ROOT CAUSE: Nested horizontal ScrollView (tabs, chips) inside
 * FlatList.ListHeaderComponent on Android causes RecyclerView to misalign
 * its internal native view index counter → always crashes at index=16, count=1.
 * This is a known Android/RN bug. No amount of useCallback/React.memo fixes it
 * because the native layer itself is miscounting.
 *
 * SOLUTION: Move ALL header content (tabs, chips, search bar) into a fixed
 * View ABOVE the FlatList. FlatList only renders list items — no
 * ListHeaderComponent, no nested ScrollViews, no crash.
 *
 * Layout:
 *   <View flex=1>
 *     <FixedHeader />        ← tabs, chips, search — NEVER inside FlatList
 *     <FlatList items />     ← items only, ListEmptyComponent for states
 *   </View>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../components/Header/Header';
import { SectionTitle } from '../../../components/SectionTitle/SectionTitle';
import { CaseCard } from '../../../components/CaseCard/CaseCard';
import { Card } from '../../../components/Card/Card';
import { Icon } from '../../../components/Icon';
import { SeverityBadge } from '../../../components/SeverityBadge/SeverityBadge';
import { useCases } from '../../../features/cases/hooks/useCases';
import { useAppTheme } from '../../../context/ThemeContext';
import { createCasesScreenStyles } from './CasesScreen.style';
import { formatRelativeTime } from '../../../utils/format';
import type { AppTheme } from '../../../theme/theme';
import type { CaseViewModel, CasesTab } from '../../../types';

const Tab: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createCasesScreenStyles>;
}> = ({ label, count, active, onPress, styles }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.tab,
      active && styles.tabActive,
      pressed && { opacity: 0.85 },
    ]}
  >
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
    <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
      <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
        {count}
      </Text>
    </View>
  </Pressable>
);

const SearchResultRow: React.FC<{
  item: CaseViewModel;
  onPress: () => void;
  theme: AppTheme;
}> = ({ item, onPress, theme }) => {
  const sevColor =
    item.severity === 'CRITICAL'
      ? theme.colors.danger
      : item.severity === 'URGENT'
        ? '#F59E0B'
        : theme.colors.success;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: sevColor,
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textPrimary,
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {item.anomaly}
        </Text>
        <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>
          {item.patientCode} · {item.patientSex} · {item.patientAge}y ·{' '}
          {item.datasetLabel}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: theme.colors.textTertiary,
          marginLeft: 8,
        }}
      >
        {item.status?.toUpperCase()}
      </Text>
    </Pressable>
  );
};

// CasesScreen
interface CasesScreenProps {
  navigation: any;
  unreadCount?: number;
  onBellPress?: () => void;
}

export const CasesScreen: React.FC<CasesScreenProps> = ({ navigation, unreadCount = 0, onBellPress }) => {
  const theme  = useAppTheme();
  const styles = createCasesScreenStyles(theme);
  const insets = useSafeAreaInsets();

  const {
    activeTab,
    setActiveTab,
    data,
    counts,
    loading,
    loadingMore,
    hasMore,
    error,
    search,
    onSearch,
    loadMore,
    refetch,
  } = useCases();

  // Derived values
  const isSearching = search.trim().length > 0;
  const isTableTab = activeTab !== 'live' && activeTab !== 'claimed';

  const tabs = useMemo<{ key: CasesTab; label: string; count: number }[]>(
    () => [
      { key: 'live', label: 'Live', count: counts.live },
      { key: 'claimed', label: 'Claimed', count: counts.claimed },
      { key: 'completed', label: 'Completed', count: counts.completed },
      { key: 'missed', label: 'Missed', count: counts.missed },
      { key: 'escalated', label: 'Escalated', count: counts.escalated },
    ],
    [
      counts.live,
      counts.claimed,
      counts.completed,
      counts.missed,
      counts.escalated,
    ],
  );

  // ── Row renderers ──────────────────────────────────────────────────────────

  const renderCaseCard = useCallback(
    ({ item }: { item: CaseViewModel }) => {
      if (isSearching) {
        return (
          <SearchResultRow
            item={item}
            theme={theme}
            onPress={() =>
              navigation.navigate('ClaimDetail', { caseId: item.patientId })
            }
          />
        );
      }
      return (
        <CaseCard
          caseItem={item}
          onPress={() =>
            navigation.navigate('ClaimDetail', { caseId: item.patientId })
          }
          onClaim={() =>
            navigation.navigate('ClaimDetail', { caseId: item.patientId })
          }
        />
      );
    },
    [navigation, isSearching, theme],
  );

  const renderCompletedRow = useCallback(
    ({ item, index }: { item: CaseViewModel; index: number }) => {
      if (isSearching) {
        return (
          <SearchResultRow
            item={item}
            theme={theme}
            onPress={() =>
              navigation.navigate('ClaimDetail', { caseId: item.patientId })
            }
          />
        );
      }
      return (
        <Pressable
          onPress={() =>
            navigation.navigate('ClaimDetail', { caseId: item.patientId })
          }
          style={({ pressed }) => [
            styles.completedRow,
            index === data.length - 1 && { borderBottomWidth: 0 },
            pressed && { opacity: 0.75 },
          ]}
        >
          <Text style={[styles.completedCaseId, { flex: 1 }]} numberOfLines={1}>
            {item.patientCode}
          </Text>

          <View style={{ flex: 1.6 }}>
            <Text style={styles.completedAnomaly} numberOfLines={1}>
              {item.anomaly}
            </Text>
            <Text style={styles.completedPatient} numberOfLines={1}>
              {item.patientSex} · {item.patientAge}y · {item.datasetLabel}
            </Text>
          </View>

          <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
            <SeverityBadge severity={item.severity} />
          </View>

          <Text
            style={[styles.completedCaseId, { flex: 0.8, textAlign: 'right' }]}
            numberOfLines={1}
          >
            {item.ageMinutes > 0
              ? formatRelativeTime(
                new Date(Date.now() - item.ageMinutes * 60000).toISOString(),
              )
              : '—'}
          </Text>

          <Text
            style={[styles.completedCaseId, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.notes || '—'}
          </Text>
        </Pressable>
      );
    },
    [data.length, styles, isSearching, navigation, theme],
  );

  // Footer

  const listFooter = useMemo(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }
    if (!hasMore && data.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>
            All {data.length} cases loaded
          </Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, data.length, styles, theme]);

  // ── Empty / loading / error ────────────────────────────────────────────────

  const listEmpty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.statusWrap}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.statusText}>Loading cases…</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.statusWrap}>
          <Text style={styles.errorText}>Couldn't load cases.</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      );
    }
    return <Text style={styles.empty}>No cases here yet.</Text>;
  }, [loading, error, styles, theme]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>

        <Header
          onProfilePress={() => navigation.navigate('Profile')}
          onBellPress={onBellPress}
          unreadCount={unreadCount}
        />

        <SectionTitle
          title="Cases"
          subtitle="Triage queue and complete review history."
          style={{ marginTop: theme.spacing.lg }}
        />

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Icon name="search" size={16} color={theme.colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by anomaly, dataset, patient code…"
            placeholderTextColor={theme.colors.textTertiary}
            value={search}
            onChangeText={onSearch}
            returnKeyType="search"
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={{ width: 28, alignItems: 'center' }}>
            {search.length > 0 ? (
              <Pressable onPress={() => onSearch('')} hitSlop={8}>
                <Icon
                  name="close-circle"
                  size={16}
                  color={theme.colors.textTertiary}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Status tabs */}
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
                styles={styles}
              />
            ))}
          </ScrollView>
        </View>

        {/* Search result */}
        {isSearching && data.length > 0 ? (
          <Text
            style={{
              ...theme.typography.eyebrow,
              color: theme.colors.textTertiary,
              letterSpacing: 1,
              marginBottom: theme.spacing.sm,
            }}
          >
            {data.length} result{data.length !== 1 ? 's' : ''} for "{search}"
          </Text>
        ) : null}

        {/* ── Table header row (completed / missed / escalated tab) ───── */}
        {!isSearching && isTableTab && data.length > 0 ? (
          <Card
            style={[
              styles.completedCard,
              {
                marginBottom: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
          >
            <View style={styles.completedHeaderRow}>
              <Text style={[styles.completedHeader, { flex: 1 }]}>CASE</Text>
              <Text style={[styles.completedHeader, { flex: 1.6 }]}>ANOMALY</Text>
              <Text style={[styles.completedHeader, { flex: 0.8 }]}>SEVERITY</Text>
              <Text style={[styles.completedHeader, { flex: 0.8, textAlign: 'right' }]}>WHEN</Text>
              <Text style={[styles.completedHeader, { flex: 1, textAlign: 'right' }]}>OUTCOME</Text>
            </View>
          </Card>
        ) : null}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={isTableTab ? renderCompletedRow : renderCaseCard}
        ListFooterComponent={listFooter}
        ListEmptyComponent={listEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        onRefresh={refetch}
        refreshing={loading && data.length === 0}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: 92 + insets.bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </View>
  );
};