import React, { useCallback, useMemo, useRef } from 'react';
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
import type { CaseViewModel, CasesTab } from '../../../types';

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

// ── Compact search result row ──────────────────────────────────────────────
const SearchResultRow: React.FC<{
  item: CaseViewModel;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const theme = useAppTheme();
  const sevColor = item.severity === 'CRITICAL'
    ? theme.colors.danger
    : item.severity === 'URGENT' ? '#F59E0B' : theme.colors.success;
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
      <View style={{
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: sevColor, marginRight: 12,
      }} />
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 14, fontWeight: '600',
          color: theme.colors.textPrimary, marginBottom: 2,
        }} numberOfLines={1}>
          {item.anomaly}
        </Text>
        <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>
          {item.patientCode} · {item.patientSex} · {item.patientAge}y · {item.datasetLabel}
        </Text>
      </View>
      <Text style={{
        fontSize: 11, fontWeight: '600',
        color: theme.colors.textTertiary, marginLeft: 8,
      }}>
        {item.status?.toUpperCase()}
      </Text>
    </Pressable>
  );
};

export const CasesScreen: React.FC<CasesScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createCasesScreenStyles(theme);
  const insets = useSafeAreaInsets();
  const {
    activeTab, setActiveTab,
    data, counts,
    loading, loadingMore, hasMore,
    error, search, onSearch, loadMore, refetch,
  } = useCases();

  const searchRef = useRef<TextInput>(null);

  const tabs = useMemo<{ key: CasesTab; label: string; count: number }[]>(() => [
    { key: 'live',      label: 'Live',      count: counts.live },
    { key: 'claimed',   label: 'Claimed',   count: counts.claimed },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'missed',    label: 'Missed',    count: counts.missed },
    { key: 'escalated', label: 'Escalated', count: counts.escalated },
  ], [counts.live, counts.claimed, counts.completed, counts.missed, counts.escalated]);

  // Render helpers 
  const isSearching = search.trim().length > 0;

  const renderCaseCard = useCallback(({ item }: { item: CaseViewModel }) => {
    if (isSearching) {
      return (
        <SearchResultRow
          item={item}
          onPress={() => navigation.navigate('ClaimDetail', { caseId: item.patientId })}
        />
      );
    }
    return (
      <CaseCard
        caseItem={item}
        onPress={() => navigation.navigate('ClaimDetail', { caseId: item.patientId })}
        onClaim={() => navigation.navigate('ClaimDetail', { caseId: item.patientId })}
      />
    );
  }, [navigation, isSearching]);

  const renderCompletedRow = useCallback(({ item, index }: { item: CaseViewModel; index: number }) => {
    if (isSearching) {
      return (
        <SearchResultRow
          item={item}
          onPress={() => navigation.navigate('ClaimDetail', { caseId: item.patientId })}
        />
      );
    }
    return (
      <View
        style={[
          styles.completedRow,
          index === data.length - 1 && { borderBottomWidth: 0 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.completedCaseId}>{item.datasetLabel}</Text>
        </View>
        <View style={{ flex: 1.6 }}>
          <Text style={styles.completedAnomaly}>{item.anomaly}</Text>
          <Text style={styles.completedPatient}>
            {item.patientSex} · {item.patientAge}y · {item.patientCode}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <SeverityBadge severity={item.severity} />
        </View>
      </View>
    );
  }, [data.length, styles, isSearching, navigation]);

  const ListHeader = useCallback(() => (
    <View style={{ paddingHorizontal: 0 }}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />
      <SectionTitle
        title="Cases"
        subtitle="Triage queue and complete review history."
        style={{ marginTop: theme.spacing.lg }}
      />
      {/* ── Tab row ── */}
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
      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Icon name="search" size={16} color={theme.colors.textTertiary} />
        <TextInput
          ref={searchRef}
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
        {search.length > 0 && (
          <Pressable style={styles.searchClear} onPress={() => onSearch('')}>
            <Icon name="close-circle" size={16} color={theme.colors.textTertiary} />
          </Pressable>
        )}
      </View>
      {/* Search results wrapper */}
      {isSearching && data.length > 0 && (
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.xl,
          borderWidth: 1,
          borderColor: theme.colors.divider,
          paddingHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.sm,
          overflow: 'hidden',
        }}>
          <Text style={{
            ...theme.typography.eyebrow,
            color: theme.colors.textTertiary,
            letterSpacing: 1,
            paddingVertical: theme.spacing.sm,
          }}>
            {data.length} result{data.length !== 1 ? 's' : ''} for "{search}"
          </Text>
        </View>
      )}

      {/* Completed/missed/escalated table header */}
      {!isSearching && activeTab !== 'live' && activeTab !== 'claimed' && data.length > 0 && (
        <Card style={[styles.completedCard, { marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
          <View style={styles.completedHeaderRow}>
            <Text style={[styles.completedHeader, { flex: 1 }]}>DATASET</Text>
            <Text style={[styles.completedHeader, { flex: 1.6 }]}>ANOMALY</Text>
            <Text style={[styles.completedHeader, { flex: 1 }]}>SEVERITY</Text>
          </View>
        </Card>
      )}
      {/* Initial loading */}
      {loading && data.length === 0 && (
        <View style={styles.statusWrap}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.statusText}>Loading cases…</Text>
        </View>
      )}
      {error && data.length === 0 && (
        <View style={styles.statusWrap}>
          <Text style={styles.errorText}>Couldn't load cases.</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      )}
      {!loading && data.length === 0 && !error && (
        <Text style={styles.empty}>No cases here yet.</Text>
      )}
    </View>
  ), [
    activeTab, tabs, search, onSearch, data.length,
    loading, error, theme, styles, navigation,
  ]);

  const ListFooter = useCallback(() => {
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
          <Text style={styles.footerEndText}>All {data.length} cases loaded</Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, data.length, theme, styles]);

  const isTableTab = activeTab !== 'live' && activeTab !== 'claimed';

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `${activeTab}-${item.id}`}
      renderItem={isTableTab ? renderCompletedRow : renderCaseCard}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      onRefresh={refetch}
      refreshing={loading && data.length === 0}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.lg,
        paddingTop: insets.top,
        paddingBottom: 92 + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={!isSearching}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
};