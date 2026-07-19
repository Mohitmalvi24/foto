import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { RadioGroup } from '../../components/common/RadioGroup';
import { Dropdown } from '../../components/common/Dropdown';
import { useAuthStore } from '../../store/authStore';
import {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  passwordsMatch,
  isValidFullName,
  isValidAddress,
} from '../../utils/validators';
import { CITIES } from '../../constants/cities';
import type { Gender, RegisterInput } from '../../types/user';
import type { RegisterScreenProps } from '../../types/navigation';

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other'];

interface FormErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((s) => s.register);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!isValidFullName(fullName)) e.fullName = 'Full name must be at least 2 characters.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address.';
    if (!gender) e.gender = 'Please select a gender.';
    if (!mobileNumber.trim()) e.mobileNumber = 'Mobile number is required.';
    else if (!isValidMobile(mobileNumber)) e.mobileNumber = 'Must be exactly 10 digits.';
    if (!isValidAddress(address)) e.address = 'Address must be at least 5 characters.';
    if (!city) e.city = 'Please select a city.';
    if (!isValidPassword(password)) e.password = 'Password must be at least 6 characters.';
    if (!passwordsMatch(password, confirmPassword)) e.confirmPassword = 'Passwords do not match.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const data: RegisterInput = {
      fullName,
      email,
      gender: gender as Gender,
      mobileNumber,
      address,
      city,
      password,
      confirmPassword,
    };

    const result = await register(data);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Please try again.');
    }
    // On success, authStore auto-logs in → RootNavigator switches to App
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Foto and start your gallery</Text>
          </View>

          {/* Form Card */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={(v) => { setFullName(v); clearError('fullName'); }}
              error={errors.fullName}
              placeholder="John Doe"
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={(v) => { setEmail(v); clearError('email'); }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
            />

            <RadioGroup
              label="Gender"
              options={GENDER_OPTIONS}
              value={gender}
              onSelect={(v) => { setGender(v as Gender); clearError('gender'); }}
              error={errors.gender}
            />

            <Input
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={(v) => {
                // Only allow digits
                const digits = v.replace(/\D/g, '').slice(0, 10);
                setMobileNumber(digits);
                clearError('mobileNumber');
              }}
              error={errors.mobileNumber}
              keyboardType="number-pad"
              placeholder="9876543210"
              maxLength={10}
            />

            <Input
              label="Address"
              value={address}
              onChangeText={(v) => { setAddress(v); clearError('address'); }}
              error={errors.address}
              placeholder="123 Main Street, Apt 4B"
              multiline
              numberOfLines={3}
            />

            <Dropdown
              label="City"
              options={CITIES}
              value={city}
              onSelect={(v) => { setCity(v); clearError('city'); }}
              placeholder="Select your city"
              error={errors.city}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(v) => { setPassword(v); clearError('password'); }}
              error={errors.password}
              isPassword
              placeholder="Min 6 characters"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
              error={errors.confirmPassword}
              isPassword
              placeholder="Re-enter your password"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    paddingVertical: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    ...shadows.lg,
  },
  registerButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
