import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { RadioGroup } from '../../components/common/RadioGroup';
import { Dropdown } from '../../components/common/Dropdown';
import { useAuthStore } from '../../store/authStore';
import {
  isValidFullName,
  isValidMobile,
  isValidAddress,
} from '../../utils/validators';
import { CITIES } from '../../constants/cities';
import type { Gender } from '../../types/user';
import type { ProfileScreenProps } from '../../types/navigation';

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other'];

const AVATARS = ['👤', '👩', '👨', '🧑‍💻', '🧑‍🎨', '🧑‍🔬', '🦊', '🐱'];

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [gender, setGender] = useState<Gender>(currentUser?.gender || 'Male');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [avatarUri, setAvatarUri] = useState(currentUser?.avatarUri || '👤');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStartEdit = () => {
    // Reset edit state to current values
    setFullName(currentUser?.fullName || '');
    setGender(currentUser?.gender || 'Male');
    setMobileNumber(currentUser?.mobileNumber || '');
    setAddress(currentUser?.address || '');
    setCity(currentUser?.city || '');
    setAvatarUri(currentUser?.avatarUri || '👤');
    setErrors({});
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  const handleSave = async () => {
    const e: Record<string, string> = {};
    if (!isValidFullName(fullName)) e.fullName = 'Name must be at least 2 characters.';
    if (!isValidMobile(mobileNumber)) e.mobileNumber = 'Must be exactly 10 digits.';
    if (!isValidAddress(address)) e.address = 'Address must be at least 5 characters.';
    if (!city) e.city = 'Please select a city.';

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);
    await updateProfile({ fullName, gender, mobileNumber, address, city, avatarUri });
    setLoading(false);
    setEditing(false);
    Alert.alert('Profile Updated', 'Your changes have been saved.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (!currentUser) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            {!editing && (
              <TouchableOpacity onPress={handleStartEdit}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{avatarUri || '👤'}</Text>
            </View>
            {editing && (
              <View style={styles.avatarPicker}>
                {AVATARS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.avatarOption,
                      emoji === avatarUri && styles.avatarOptionSelected,
                    ]}
                    onPress={() => setAvatarUri(emoji)}
                  >
                    <Text style={styles.avatarOptionText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {!editing && (
              <>
                <Text style={styles.displayName}>{currentUser.fullName}</Text>
                <Text style={styles.displayEmail}>{currentUser.email}</Text>
              </>
            )}
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            {editing ? (
              <>
                <Input
                  label="Full Name"
                  value={fullName}
                  onChangeText={(v) => { setFullName(v); setErrors((e) => ({ ...e, fullName: '' })); }}
                  error={errors.fullName}
                  autoCapitalize="words"
                />
                <RadioGroup
                  label="Gender"
                  options={GENDER_OPTIONS}
                  value={gender}
                  onSelect={(v) => setGender(v as Gender)}
                />
                <Input
                  label="Mobile Number"
                  value={mobileNumber}
                  onChangeText={(v) => {
                    setMobileNumber(v.replace(/\D/g, '').slice(0, 10));
                    setErrors((e) => ({ ...e, mobileNumber: '' }));
                  }}
                  error={errors.mobileNumber}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                <Input
                  label="Address"
                  value={address}
                  onChangeText={(v) => { setAddress(v); setErrors((e) => ({ ...e, address: '' })); }}
                  error={errors.address}
                  multiline
                  numberOfLines={3}
                />
                <Dropdown
                  label="City"
                  options={CITIES}
                  value={city}
                  onSelect={(v) => { setCity(v); setErrors((e) => ({ ...e, city: '' })); }}
                  error={errors.city}
                />

                <View style={styles.editActions}>
                  <Button
                    title="Cancel"
                    onPress={handleCancel}
                    variant="secondary"
                    style={styles.editButton}
                  />
                  <Button
                    title="Save Changes"
                    onPress={handleSave}
                    loading={loading}
                    style={styles.editButton}
                  />
                </View>
              </>
            ) : (
              <>
                <ProfileRow label="Email" value={currentUser.email} />
                <ProfileRow label="Gender" value={currentUser.gender} />
                <ProfileRow label="Mobile" value={currentUser.mobileNumber} />
                <ProfileRow label="Address" value={currentUser.address} />
                <ProfileRow label="City" value={currentUser.city} isLast />
              </>
            )}
          </View>

          {/* Logout */}
          {!editing && (
            <Button
              title="Sign Out"
              onPress={handleLogout}
              variant="danger"
              style={styles.logoutButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ProfileRow: React.FC<{ label: string; value: string; isLast?: boolean }> = ({
  label,
  value,
  isLast,
}) => (
  <View style={[profileRowStyles.row, !isLast && profileRowStyles.border]}>
    <Text style={profileRowStyles.label}>{label}</Text>
    <Text style={profileRowStyles.value}>{value}</Text>
  </View>
);

const profileRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.lg,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  editLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarEmoji: {
    fontSize: 38,
  },
  avatarPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  avatarOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGhost,
  },
  avatarOptionText: {
    fontSize: 22,
  },
  displayName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  displayEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    ...shadows.lg,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  editButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: spacing.xxl,
  },
});
