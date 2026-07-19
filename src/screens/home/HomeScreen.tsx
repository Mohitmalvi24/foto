import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { DEBOUNCE_MS } from '../../constants/config';
import { SearchBar } from '../../components/gallery/SearchBar';
import { FilterBar } from '../../components/gallery/FilterBar';
import { ImageCard } from '../../components/gallery/ImageCard';
import { ErrorState, EmptyState } from '../../components/common/StateViews';
import { useImages } from '../../hooks/useImages';
import { useFavorites } from '../../hooks/useFavorites';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { AuthorFilter, PicsumImage } from '../../types/image';
import type { HomeScreenProps } from '../../types/navigation';

const matchesFilter = (author: string, filter: AuthorFilter): boolean => {
  if (filter === 'All') return true;
  const firstChar = author.charAt(0).toUpperCase();
  if (filter === 'A-M') return firstChar >= 'A' && firstChar <= 'M';
  return firstChar >= 'N' && firstChar <= 'Z';
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AuthorFilter>('All');
  const debouncedSearch = useDebouncedValue(searchQuery, DEBOUNCE_MS);

  const {
    images,
    isLoading,
    isFetchingMore,
    isRefreshing,
    error,
    hasMore,
    fetchNextPage,
    refresh,
    fetchInitial,
  } = useImages();

  const { favoriteIds, toggleFavorite } = useFavorites();

  // Derive displayed list from search + filter (client-side)
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchSearch = debouncedSearch
        ? img.author.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchAuthorFilter = matchesFilter(img.author, activeFilter);
      return matchSearch && matchAuthorFilter;
    });
  }, [images, debouncedSearch, activeFilter]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isFetchingMore && !isLoading) {
      fetchNextPage();
    }
  }, [hasMore, isFetchingMore, isLoading, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <ImageCard
        image={item}
        isFavorite={favoriteIds.includes(item.id)}
        onPress={() => navigation.navigate('ImageDetails', { imageId: item.id })}
        onToggleFavorite={() => toggleFavorite(item.id)}
      />
    ),
    [favoriteIds, navigation, toggleFavorite],
  );

  const keyExtractor = useCallback((item: PicsumImage) => item.id, []);

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  if (isLoading && images.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && images.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ErrorState message={error} onRetry={fetchInitial} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.count}>{filteredImages.length} photos</Text>
      </View>

      {/* Search + Filter */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          subtitle="Try a different search term or filter."
        />
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
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
  titleContainer: {
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
