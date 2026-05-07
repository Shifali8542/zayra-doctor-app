import React from 'react';
import { Image, View, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../../components/Layout/Layout';
import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { useLoginForm } from '../../../features/auth/hooks/useAuthForm';
import { useAppTheme } from '../../../context/ThemeContext';
import { createLoginScreenStyles } from './LoginScreen.style';

const logo = require('../../../assets/icon.png');
interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createLoginScreenStyles(theme);
  const { email, password, setEmail, setPassword, loading, error, submit, skip } = useLoginForm();

  return (
    <Layout scroll padded edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
      >
        <View style={styles.brandRow}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <LinearGradient
          colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEyebrow}>VERIFIED CARDIOLOGISTS ONLY</Text>
          <Text style={styles.heroTitle}>Welcome back, Doctor.</Text>
          <Text style={styles.heroSubtitle}>
            Sign in to review live anomalies and continue your streak of saved lives.
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@hospital.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            iconLeft="search"
          />
          <View style={styles.gap} />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            iconLeft="shield"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.gapLg} />
          <Button
            label="Sign in"
            onPress={submit}
            loading={loading}
            fullWidth
            size="lg"
            iconRight="arrow-right"
          />

          <View style={styles.gap} />
          <Button
            label="Skip for now"
            variant="secondary"
            onPress={skip}
            fullWidth
            size="lg"
          />

          <Pressable
            onPress={() => navigation.navigate('Signup')}
            style={({ pressed }) => [styles.footerLink, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.footerText}>
              New to Zayra?{' '}
              <Text style={styles.footerStrong}>Create an account</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};
