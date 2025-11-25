import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { theme, typography, spacing, borderRadius } from '@/theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface LoginForm {
  email: string;
  password: string;
}

const getRoleConfig = (role: string) => {
  switch (role) {
    case 'student':
      return {
        title: 'Student Login',
        icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
        color: theme.colors.primary,
        subtitle: 'Access your academic dashboard',
      };
    case 'teacher':
      return {
        title: 'Teacher Login',
        icon: 'library-outline' as keyof typeof Ionicons.glyphMap,
        color: theme.colors.success,
        subtitle: 'Manage your classes and students',
      };
    case 'parent':
      return {
        title: 'Parent Login',
        icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
        color: theme.colors.warning,
        subtitle: 'Monitor your child\'s progress',
      };
    default:
      return {
        title: 'School ERP Login',
        icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
        color: theme.colors.primary,
        subtitle: 'Sign in to continue',
      };
  }
};

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const roleConfig = getRoleConfig(role || 'default');

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/role-selection');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.logoSection}>
              <View style={[styles.logoContainer, { backgroundColor: `${roleConfig.color}20` }]}>
                <Ionicons name={roleConfig.icon} size={32} color={roleConfig.color} />
              </View>
              <Text style={styles.brandName}>edumanage.</Text>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: roleConfig.color }]}>{roleConfig.title}</Text>
            <Text style={styles.subtitle}>{roleConfig.subtitle}</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.email}
                    style={styles.input}
                    outlineColor={theme.colors.surfaceVariant}
                    activeOutlineColor={roleConfig.color}
                    contentStyle={styles.inputContent}
                  />
                  {errors.email && (
                    <Text style={styles.error}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    mode="outlined"
                    secureTextEntry
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.password}
                    style={styles.input}
                    outlineColor={theme.colors.surfaceVariant}
                    activeOutlineColor={roleConfig.color}
                    contentStyle={styles.inputContent}
                  />
                  {errors.password && (
                    <Text style={styles.error}>{errors.password.message}</Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: roleConfig.color }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Signing In...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  inputContent: {
    fontSize: 16,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    padding: spacing.sm,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  loginButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});



