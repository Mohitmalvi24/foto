import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAuthStore } from '../store/authStore';
import { colors, typography, spacing, shadows } from '../constants/theme';

export const RootNavigator: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const hydrateSession = useAuthStore((s) => s.hydrateSession);

  useEffect(() => {
    hydrateSession();
  }, []);

  // Splash screen while checking session
  if (isHydrating) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}>
          <Text style={styles.splashIcon}>📸</Text>
        </View>
        <Text style={styles.splashTitle}>Foto</Text>
        <Text style={styles.splashSubtitle}>Your personal gallery</Text>
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.splashLoader}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  splashIcon: {
    fontSize: 44,
  },
  splashTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  splashSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  splashLoader: {
    marginTop: spacing.xxl,
  },
});
