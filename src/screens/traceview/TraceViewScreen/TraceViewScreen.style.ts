import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createTraceViewScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    titleWrap: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },

    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      marginBottom: theme.spacing.lg,
    },
    toolBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    zoomLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      paddingHorizontal: theme.spacing.sm,
    },
    toolDivider: {
      width: 1,
      height: 20,
      backgroundColor: theme.colors.divider,
      marginHorizontal: theme.spacing.sm,
    },

    strip: {
      borderRadius: theme.radii.lg,
      backgroundColor: '#0E1B2C',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
    },
    stripHighlight: {
      shadowColor: theme.colors.pulseRed,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(255,110,122,0.45)',
    },
    stripHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    stripLabel: {
      ...theme.typography.eyebrow,
      color: 'rgba(255,255,255,0.78)',
      letterSpacing: 1.2,
    },
    stripMeta: {
      ...theme.typography.eyebrow,
      color: 'rgba(255,255,255,0.6)',
      letterSpacing: 1.2,
    },

    cardTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.md,
    },
    kvRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    kvLabel: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    kvValue: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
    },

    bookmarkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    bookmarkLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    bookmarkJump: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
    },

    annotationBox: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      minHeight: 110,
    },
    annotationInput: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      minHeight: 90,
      textAlignVertical: 'top',
    },
  });
