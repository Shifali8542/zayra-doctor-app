import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createProfileScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    profileHero: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    profileAvatar: {
      borderColor: 'rgba(255,255,255,0.18)',
      borderWidth: 4,
      marginBottom: theme.spacing.lg,
    },
    verifiedEyebrow: {
      ...theme.typography.eyebrow,
      letterSpacing: 1.6,
      color: theme.colors.textOnDarkSubtle,
      marginBottom: theme.spacing.sm,
    },
    profileName: {
      ...theme.typography.h1,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    profileMeta: {
      ...theme.typography.body,
      color: theme.colors.textOnDarkSubtle,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    licenseTagWrap: {
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    licenseTag: {
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    languagesTag: {
      backgroundColor: 'rgba(255,255,255,0.10)',
      alignSelf: 'center',
    },

    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    rowLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      fontSize: theme.fonts.sizes.lg,
      marginBottom: 2,
    },
    rowDesc: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },

    kvRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      flex: 1.4,
      textAlign: 'right',
    },

    themeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
  });
