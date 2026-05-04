import React from 'react';
import { Text, View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../../components/Layout/Layout';
import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { Icon } from '../../../components/Icon';
import { useSignupForm } from '../../../features/auth/hooks/useAuthForm';
import { useAppTheme } from '../../../context/ThemeContext';
import { createSignupScreenStyles } from './SignupScreen.style';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createSignupScreenStyles(theme);
  const {
    name, email, password,
    setName, setEmail, setPassword,
    loading, error, submit, skip,
  } = useSignupForm();

  return (
    <Layout scroll padded edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backRow, pressed && { opacity: 0.6 }]}
        >
          <Icon name="chevron-left" size={20} color={theme.colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <LinearGradient
          colors={[theme.colors.heroGradientFrom, theme.colors.heroGradientMid, theme.colors.heroGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEyebrow}>JOIN THE ZAYRA NETWORK</Text>
          <Text style={styles.heroTitle}>Create your account</Text>
          <Text style={styles.heroSubtitle}>
            Verified cardiologists review high-stakes anomalies in seconds.
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <Input
            label="Full name"
            placeholder="Dr. Sanjana Rao"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.gap} />
          <Input
            label="Email"
            placeholder="you@hospital.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.gap} />
          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.gapLg} />
          <Button
            label="Create account"
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
            onPress={() => navigation.navigate('Login')}
            style={({ pressed }) => [styles.footerLink, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerStrong}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};
