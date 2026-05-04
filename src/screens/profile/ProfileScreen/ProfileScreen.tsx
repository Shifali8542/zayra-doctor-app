import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Card } from '../../../components/Card/Card';
import { Tag } from '../../../components/Tag/Tag';
import { Toggle } from '../../../components/Toggle/Toggle';
import { Avatar } from '../../../components/Avatar/Avatar';
import { Icon } from '../../../components/Icon';
import { Button } from '../../../components/Button/Button';
import { useProfile } from '../../../features/profile/hooks/useProfile';
import { useAppTheme, useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { createProfileScreenStyles } from './ProfileScreen.style';

interface ProfileScreenProps {
  navigation: any;
}

const Row: React.FC<{
  label: string;
  description?: string;
  rightSlot: React.ReactNode;
  borderless?: boolean;
}> = ({ label, description, rightSlot, borderless }) => {
  const theme = useAppTheme();
  const styles = createProfileScreenStyles(theme);
  return (
    <View style={[styles.row, borderless && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? <Text style={styles.rowDesc}>{description}</Text> : null}
      </View>
      <View>{rightSlot}</View>
    </View>
  );
};

const KvRow: React.FC<{ label: string; value: string; borderless?: boolean }> = ({
  label, value, borderless,
}) => {
  const theme = useAppTheme();
  const styles = createProfileScreenStyles(theme);
  return (
    <View style={[styles.kvRow, borderless && { borderBottomWidth: 0 }]}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={styles.kvValue}>{value}</Text>
    </View>
  );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const { mode, toggleMode } = useTheme();
  const styles = createProfileScreenStyles(theme);
  const {
    profile, available, emergencyOnly,
    lockScreenAlerts, hapticSound,
    toggleAvailable, toggleEmergency,
    setLockScreenAlerts, setHapticSound,
  } = useProfile();
  const { logout } = useAuth();

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={32}>
      <Header />

      {/* Profile hero */}
      <LinearGradient
        colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHero}
      >
        <Avatar
          initials={profile.initials}
          size={112}
          style={styles.profileAvatar}
        />
        <Text style={styles.verifiedEyebrow}>VERIFIED CARDIOLOGIST</Text>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileMeta}>
          {profile.specialty} · {profile.experienceYears} years · {profile.city}
        </Text>

        <View style={styles.licenseTagWrap}>
          <Tag
            onDark
            label="License verified"
            leftIcon={<Icon name="shield-check" size={13} color={theme.colors.textOnDark} />}
            style={styles.licenseTag}
          />
        </View>
        <Tag
          onDark
          label={profile.languages.join(' · ')}
          style={styles.languagesTag}
        />
      </LinearGradient>

      {/* Availability */}
      <Card style={{ marginTop: theme.spacing.xl }}>
        <Text style={styles.sectionTitle}>Availability</Text>

        <Row
          label="Available for review"
          description="Receive live anomaly alerts"
          rightSlot={
            <Toggle value={available} onValueChange={toggleAvailable} />
          }
        />
        <Row
          label="Emergency-only mode"
          description="Only critical-tier cases"
          rightSlot={
            <Toggle value={emergencyOnly} onValueChange={toggleEmergency} />
          }
        />
        <KvRow label="Working hours" value={profile.workingHours} />
        <KvRow label="Severity filter" value={profile.severityFilters} borderless />
      </Card>

      {/* Notifications */}
      <Card style={{ marginTop: theme.spacing.lg }}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Row
          label="Lock-screen medical alerts"
          description="High-priority banner"
          rightSlot={
            <Toggle value={lockScreenAlerts} onValueChange={setLockScreenAlerts} />
          }
        />
        <Row
          label="Haptic + sound"
          description="Distinct tone per severity tier"
          rightSlot={<Toggle value={hapticSound} onValueChange={setHapticSound} />}
        />
        <KvRow label="Sound profile" value="Pulse · Soft" />
        <KvRow label="Quiet hours" value="23:00 – 07:00 (emergency override)" borderless />
      </Card>

      {/* App preferences */}
      <Card style={{ marginTop: theme.spacing.lg }}>
        <Text style={styles.sectionTitle}>App preferences</Text>
        <Row
          label="Theme"
          description={mode === 'light' ? 'Light · matches system' : 'Dark mode'}
          rightSlot={
            <Pressable
              onPress={toggleMode}
              style={({ pressed }) => [styles.themeBtn, pressed && { opacity: 0.7 }]}
            >
              <Icon
                name={mode === 'light' ? 'sun' : 'moon'}
                size={18}
                color={theme.colors.textPrimary}
                strokeWidth={1.8}
              />
            </Pressable>
          }
        />
        <KvRow label="AI transparency" value="Show evidence cards by default" />
        <KvRow label="Data policy" value="HIPAA · GDPR · DPDP compliant" />
        <KvRow label="Case history export" value="Download CSV / PDF" borderless />
      </Card>

      <View style={{ marginTop: theme.spacing.xl }}>
        <Button
          label="Sign out"
          variant="secondary"
          fullWidth
          size="lg"
          onPress={logout}
        />
      </View>
    </Layout>
  );
};
