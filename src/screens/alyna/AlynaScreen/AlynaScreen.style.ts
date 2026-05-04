import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createAlynaScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    kav: { flex: 1 },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    titleTextWrap: { flex: 1, marginLeft: theme.spacing.lg },
    title: {
      ...theme.typography.h1,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    convoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    bubbleAssistantWrap: {
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    bubbleAssistant: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.xl,
      padding: theme.spacing.lg,
      maxWidth: '92%',
    },
    bubbleAssistantText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      lineHeight: 22,
    },
    bubbleDivider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: theme.spacing.md,
    },
    bubbleConfidence: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    bubbleTagsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    bubbleTag: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },

    bubbleUserWrap: {
      alignItems: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    bubbleUser: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.xl,
      padding: theme.spacing.lg,
      maxWidth: '85%',
    },
    bubbleUserText: {
      ...theme.typography.body,
      color: theme.colors.textOnDark,
      lineHeight: 22,
    },

    suggestionsWrap: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    suggestionChip: {
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      alignSelf: 'flex-start',
    },
    suggestionText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      paddingLeft: theme.spacing.lg,
      paddingRight: 4,
      paddingVertical: 4,
      backgroundColor: theme.colors.surface,
    },
    input: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
      paddingVertical: theme.spacing.md,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
