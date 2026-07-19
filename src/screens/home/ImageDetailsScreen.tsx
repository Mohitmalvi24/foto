import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { getDetailUrl, getThumbnailUrl } from '../../api/picsumApi';
import { FavoriteButton } from '../../components/gallery/FavoriteButton';
import { Button } from '../../components/common/Button';
import { useImageStore } from '../../store/imageStore';
import { useFavorites } from '../../hooks/useFavorites';
import type { ImageDetailsScreenProps } from '../../types/navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const ImageDetailsScreen: React.FC<ImageDetailsScreenProps> = ({ route, navigation }) => {
  const { imageId } = route.params;
  const images = useImageStore((s) => s.images);
  const image = images.find((img) => img.id === imageId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [downloading, setDownloading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  if (!image) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Image not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  const detailUrl = getDetailUrl(image.id);
  const isFav = isFavorite(image.id);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      // Request media library permission (new SDK 57 API)
      const { status } = await requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your media library to save images.');
        setDownloading(false);
        return;
      }

      // Download file using new File class API
      const destinationFile = new File(Paths.cache, `foto_${image.id}.jpg`);
      const downloadedFile = await File.downloadFileAsync(image.download_url, destinationFile);

      // Save to gallery using new Asset class API
      await Asset.create(downloadedFile.uri);

      Alert.alert('Downloaded! ✨', 'Image saved to your gallery.');
    } catch (e) {
      console.error('Download error:', e);
      Alert.alert('Download Failed', 'Could not save image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
        return;
      }

      // Download to cache for sharing
      const destinationFile = new File(Paths.cache, `foto_share_${image.id}.jpg`);
      const downloadedFile = await File.downloadFileAsync(detailUrl, destinationFile);
      await Sharing.shareAsync(downloadedFile.uri);
    } catch {
      Alert.alert('Share Failed', 'Could not share image.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setFullScreen(true)}
        >
          <Image
            source={{ uri: detailUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Tap to view full screen</Text>
          </View>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoLeft}>
              <Text style={styles.authorLabel}>Photographer</Text>
              <Text style={styles.authorName}>{image.author}</Text>
            </View>
            <FavoriteButton
              isFavorite={isFav}
              onToggle={() => toggleFavorite(image.id)}
              size={28}
            />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Image ID</Text>
              <Text style={styles.metaValue}>#{image.id}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Resolution</Text>
              <Text style={styles.metaValue}>{image.width} × {image.height}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title={downloading ? 'Saving...' : '⬇  Download'}
              onPress={handleDownload}
              loading={downloading}
              style={styles.downloadButton}
            />
            <Button
              title="🔗  Share"
              onPress={handleShare}
              variant="secondary"
              style={styles.shareButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Full-Screen Modal */}
      <Modal
        visible={fullScreen}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreen(false)}
      >
        <View style={styles.fullScreenOverlay}>
          <TouchableOpacity
            style={styles.fullScreenClose}
            onPress={() => setFullScreen(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: `https://picsum.photos/id/${image.id}/${image.width}/${image.height}` }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: colors.shimmer,
  },
  tapHint: {
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tapHintText: {
    ...typography.small,
    color: colors.white,
  },
  infoCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    ...shadows.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infoLeft: {
    flex: 1,
  },
  authorLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  authorName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.xxl,
  },
  metaItem: {},
  metaLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  metaValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  downloadButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '700',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: '80%',
  },
});
