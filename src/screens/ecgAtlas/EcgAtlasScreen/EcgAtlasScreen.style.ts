import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../../theme/theme';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

export const createEcgAtlasScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    headerWrap: { paddingHorizontal: theme.spacing.xl },
    list: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.massive,
    },
    row: { gap: theme.spacing.md, marginBottom: theme.spacing.md },

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignSelf: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    statChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
    },
    statText: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, fontWeight: '600' },

    // Hero card
    heroCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      marginBottom: theme.spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    heroWaveform: {
      backgroundColor: '#0D1B2A',
      padding: theme.spacing.lg,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: `${theme.colors.accent}25`,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 3,
      marginBottom: theme.spacing.sm,
    },
    heroBadgeText: {
      ...theme.typography.eyebrow,
      color: theme.colors.accent,
      letterSpacing: 1.3,
    },
    heroMeta: {
      ...theme.typography.bodySmall,
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'monospace',
      marginTop: theme.spacing.sm,
    },
    heroContent: { padding: theme.spacing.xl },
    heroTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
    },
    heroDesc: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
    heroTag: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 3,
    },
    heroTagText: { ...theme.typography.eyebrow, color: theme.colors.textSecondary, letterSpacing: 1.1 },
    beginBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    beginBtnText: { ...theme.typography.bodyStrong, color: theme.colors.textOnDark },

    continueTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.md,
    },

    // Atlas case card (2-column grid)
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    cardWaveform: {
      backgroundColor: '#0D1B2A',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      height: 76,
      justifyContent: 'center',
    },
    cardBody: { padding: theme.spacing.md },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    cardTag: { ...theme.typography.eyebrow, color: theme.colors.textTertiary, letterSpacing: 1.1 },
    cardDuration: { ...theme.typography.eyebrow, color: theme.colors.textTertiary, letterSpacing: 1.1 },
    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      lineHeight: 18,
      marginBottom: theme.spacing.md,
      minHeight: 36,
    },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    difficultyBadge: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    difficultyText: { ...theme.typography.eyebrow, color: theme.colors.textTertiary, letterSpacing: 1 },
    openBtn: { padding: theme.spacing.xs },
    openBtnText: { ...theme.typography.bodySmall, color: theme.colors.primary, fontWeight: '700' },
  });
