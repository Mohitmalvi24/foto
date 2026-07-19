import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { DEBOUNCE_MS } from '../../constants/config';
import { SearchBar } from '../../components/gallery/SearchBar';
import { ImageCard } from '../../components/gallery/ImageCard';
import { EmptyState } from '../../components/common/StateViews';
import { useImageStore } from '../../store/imageStore';
import { useFavorites } from '../../hooks/useFavorites';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { PicsumImage } from '../../types/image';
import type { FavoritesScreenProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../types/navigation';

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, DEBOUNCE_MS);

  const images = useImageStore((s) => s.images);
  const { favoriteIds, toggleFavorite } = useFavorites();

  // Get the parent navigator to navigate to ImageDetails
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // Build favorites list from the fetched images
  const favoriteImages = useMemo(() => {
    const favSet = new Set(favoriteIds);
    let favs = images.filter((img) => favSet.has(img.id));

    if (debouncedSearch) {
      favs = favs.filter((img) =>
        img.author.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    return favs;
  }, [images, favoriteIds, debouncedSearch]);

  const renderItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <ImageCard
        image={item}
        isFavorite={true}
        onPress={() => {
          // Navigate to Home tab's ImageDetails
          (navigation as any).navigate('HomeTab', {
            screen: 'ImageDetails',
            params: { imageId: item.id },
          });
        }}
        onToggleFavorite={() => toggleFavorite(item.id)}
      />
    ),
    [navigation, toggleFavorite],
  );

  const keyExtractor = useCallback((item: PicsumImage) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.count}>{favoriteIds.length} saved</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search favorites..."
      />

      {favoriteImages.length === 0 ? (
        <EmptyState
          icon="💜"
          title={favoriteIds.length === 0 ? 'No favorites yet' : 'No results'}
          subtitle={
            favoriteIds.length === 0
              ? 'Tap the heart on any photo to save it here.'
              : 'Try a different search term.'
          }
        />
      ) : (
        <FlatList
          data={favoriteImages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
  },
});
