import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ImageDetailsScreen } from '../screens/home/ImageDetailsScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import type { HomeStackParamList, AppTabParamList } from '../types/navigation';
import { colors, typography, spacing } from '../constants/theme';

// Home stack (HomeGallery → ImageDetails)
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { ...typography.bodyBold },
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <HomeStackNav.Screen
        name="HomeGallery"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStackNav.Screen
        name="ImageDetails"
        component={ImageDetailsScreen}
        options={{
          title: 'Photo Details',
          headerBackTitle: 'Back',
        }}
      />
    </HomeStackNav.Navigator>
  );
};

// Bottom Tabs
const Tab = createBottomTabNavigator<AppTabParamList>();

const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => (
  <View style={[tabIconStyles.container, focused && tabIconStyles.focused]}>
    <Text style={tabIconStyles.emoji}>{emoji}</Text>
  </View>
);

const tabIconStyles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focused: {
    backgroundColor: colors.primaryGhost,
  },
  emoji: {
    fontSize: 20,
  },
});

export const AppStack: React.FC = () => {
  return (
    <SafeAreaView style={appStyles.safeArea} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            ...typography.small,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesScreen}
          options={{
            title: 'Favorites',
            tabBarIcon: ({ focused }) => <TabIcon emoji="❤️" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const appStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
