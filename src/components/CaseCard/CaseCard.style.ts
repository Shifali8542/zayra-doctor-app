import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createCaseCardStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      marginBottom: theme.spacing.lg,
    },
    pressed: { opacity: 0.95 },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    caseId: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.md,
      letterSpacing: 0.4,
      flex: 1,
    },
    timeWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    time: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.xs,
    },
    pulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: theme.colors.pulseRed,
      marginLeft: theme.spacing.sm,
    },
    anomalyTitle: {
      ...theme.typography.h3,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    patientLine: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.lg,
    },
    waveform: {
      marginBottom: theme.spacing.lg,
    },
    metricsRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    metricGap: {
      width: theme.spacing.sm,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.xs,
    },
  });
