import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../constants/theme';
import { getThumbnailUrl } from '../../api/picsumApi';
import { FavoriteButton } from './FavoriteButton';
import type { PicsumImage } from '../../types/image';

const CARD_MARGIN = spacing.lg;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2;

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const ImageCardComponent: React.FC<ImageCardProps> = ({
  image,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: getThumbnailUrl(image.id) }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.favoriteOverlay}>
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} size={20} />
        </View>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{image.id}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.author} numberOfLines={1}>
          {image.author}
        </Text>
        <Text style={styles.dimensions}>
          {image.width}×{image.height}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ImageCard = memo(ImageCardComponent);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: colors.shimmer,
  },
  favoriteOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  idText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  info: {
    padding: spacing.md,
  },
  author: {
    ...typography.captionBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  dimensions: {
    ...typography.small,
    color: colors.textMuted,
  },
});
