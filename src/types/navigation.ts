import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Home stack (nested inside tab)
export type HomeStackParamList = {
  HomeGallery: undefined;
  ImageDetails: { imageId: string };
};

// Bottom tabs
export type AppTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

// Root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

// Screen props
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeGallery'>,
  BottomTabScreenProps<AppTabParamList>
>;

export type ImageDetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'ImageDetails'>;

export type FavoritesScreenProps = BottomTabScreenProps<AppTabParamList, 'FavoritesTab'>;
export type ProfileScreenProps = BottomTabScreenProps<AppTabParamList, 'ProfileTab'>;
