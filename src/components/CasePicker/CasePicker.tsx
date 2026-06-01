/**
 * CasePicker
 * Shown in TraceView when no case is selected.
 * Mirrors the web's CasePickerSection — two groups: My Claimed + Live.
 */
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { createCasePickerStyles, SEVERITY_COLORS } from './CasePicker.style';
import type { CaseReview } from '../../types';

const SEVERITY_BG: Record<string, string> = {
  critical: 'rgba(208,78,92,0.12)',
  urgent:   'rgba(224,162,58,0.12)',
  routine:  'rgba(31,165,155,0.12)',
  normal:   'rgba(122,138,152,0.12)',
};

interface PickerSectionProps {
  title: string;
  cases: CaseReview[];
  onSelect: (c: CaseReview) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  loading?: boolean;
}

const PickerSection: React.FC<PickerSectionProps> = ({
  title,
  cases,
  onSelect,
  hasMore,
  onLoadMore,
  loading,
}) => {
  const theme = useAppTheme();
  const styles = createCasePickerStyles(theme);

  if (cases.length === 0 && !loading) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {cases.map((c, i) => {
        const isLast = i === cases.length - 1 && !hasMore;
        const dotColor = SEVERITY_COLORS[c.severity] ?? SEVERITY_COLORS.normal;
        const bgColor  = SEVERITY_BG[c.severity]    ?? SEVERITY_BG.normal;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c)}
            style={({ pressed }) => [
              styles.row,
              isLast && styles.rowLast,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={[styles.severityDot, { backgroundColor: dotColor }]} />
            <View style={styles.rowContent}>
              <Text style={styles.rowDiagnosis} numberOfLines={1}>
                {c.display_diagnosis || c.diagnosis || 'Anomaly detected'}
              </Text>
              <Text style={styles.rowMeta} numberOfLines={1}>
                {c.patient_code}
                {c.age ? ` · ${c.age}y` : ''}
                {c.sex ? ` ${c.sex}` : ''}
                {c.dataset_source_display ? ` · ${c.dataset_source_display}` : ''}
                {c.heart_rate_bpm ? ` · ${Math.round(c.heart_rate_bpm)} bpm` : ''}
              </Text>
            </View>
            <View style={[styles.severityPill, { backgroundColor: bgColor }]}>
              <Text style={[styles.severityPillText, { color: dotColor }]}>
                {c.severity}
              </Text>
            </View>
          </Pressable>
        );
      })}

      {hasMore && (
        <Pressable
          onPress={onLoadMore}
          disabled={loading}
          style={({ pressed }) => [styles.loadMoreBtn, pressed && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.loadMoreText}>View more</Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

interface CasePickerProps {
  myCases: CaseReview[];
  liveCases: CaseReview[];
  myCount: number;
  liveCount: number;
  loading: boolean;
  hasMoreMy: boolean;
  hasMoreLive: boolean;
  onLoadMoreMy: () => void;
  onLoadMoreLive: () => void;
  onSelect: (c: CaseReview) => void;
}

export const CasePicker: React.FC<CasePickerProps> = ({
  myCases,
  liveCases,
  myCount,
  liveCount,
  loading,
  hasMoreMy,
  hasMoreLive,
  onLoadMoreMy,
  onLoadMoreLive,
  onSelect,
}) => {
  const theme = useAppTheme();
  const styles = createCasePickerStyles(theme);

  if (loading && myCases.length === 0 && liveCases.length === 0) {
    return (
      <View style={{ paddingVertical: 48, alignItems: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!loading && myCases.length === 0 && liveCases.length === 0) {
    return (
      <Text style={styles.emptyText}>No active cases right now.</Text>
    );
  }

  return (
    <View style={styles.container}>
      <PickerSection
        title={`My claimed cases · ${myCount}`}
        cases={myCases}
        onSelect={onSelect}
        hasMore={hasMoreMy}
        onLoadMore={onLoadMoreMy}
        loading={loading && myCases.length > 0}
      />
      <PickerSection
        title={`Live · unclaimed · ${liveCount}`}
        cases={liveCases}
        onSelect={onSelect}
        hasMore={hasMoreLive}
        onLoadMore={onLoadMoreLive}
        loading={loading && liveCases.length > 0}
      />
    </View>
  );
};