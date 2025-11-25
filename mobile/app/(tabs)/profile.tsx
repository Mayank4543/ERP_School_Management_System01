import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Avatar,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api/auth';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH > 768;

interface ProfileForm {
  first_name: string;
  last_name: string;
  phone: string;
}

export default function ProfileScreen() {
  const { user, refreshUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_picture || null);
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || user?.mobile_no || '',
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permission to select profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageLoading(true);
      try {
        // Here you would typically upload the image to your server
        // For now, we'll just update the local state
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Profile picture updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile picture');
      } finally {
        setImageLoading(false);
      }
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setLoading(true);
      await authService.updateProfile(data);
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    Alert.prompt(
      'Change Password',
      'Enter your new password',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async (newPassword) => {
            if (!newPassword || newPassword.length < 6) {
              Alert.alert('Error', 'Password must be at least 6 characters');
              return;
            }
            try {
              setChangingPassword(true);
              // Note: This requires old password - you might want to add a prompt for that
              Alert.alert('Info', 'Password change requires old password. Please contact admin.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to change password');
            } finally {
              setChangingPassword(false);
            }
          },
        },
      ],
      'secure-text'
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const getRoleColor = () => {
    const role = user?.roles?.[0] || user?.usergroup_id;
    switch (role) {
      case 'student': return '#4CAF50';
      case 'teacher': return '#2196F3';
      case 'parent': return '#9C27B0';
      default: return theme.colors.primary;
    }
  };

  const getRoleDisplayName = () => {
    const role = user?.roles?.[0] || user?.usergroup_id;
    switch (role) {
      case 'student': return 'Student';
      case 'teacher': return 'Teacher';
      case 'parent': return 'Parent';
      default: return 'User';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: getRoleColor() }]}>
                  <Text style={styles.avatarText}>
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </Text>
                </View>
              )}
              <View style={styles.editImageBadge}>
                {imageLoading ? (
                  <ActivityIndicator size={16} color={theme.colors.onPrimary} />
                ) : (
                  <Ionicons name="camera" size={16} color={theme.colors.onPrimary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.name}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.roleContainer}>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
                <Text style={styles.roleText}>{getRoleDisplayName()}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.contentContainer, isTablet && styles.contentTablet]}>
          <Card style={[styles.card, isTablet && styles.cardTablet]}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <Controller
                control={control}
                name="first_name"
                rules={{ required: 'First name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="First Name"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.first_name}
                    style={styles.input}
                  />
                )}
              />
              {errors.first_name && (
                <Text style={styles.error}>{errors.first_name.message}</Text>
              )}

              <Controller
                control={control}
                name="last_name"
                rules={{ required: 'Last name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Last Name"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.last_name}
                    style={styles.input}
                  />
                )}
              />
              {errors.last_name && (
                <Text style={styles.error}>{errors.last_name.message}</Text>
              )}

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Phone"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.phone}
                    style={styles.input}
                  />
                )}
              />
              {errors.phone && (
                <Text style={styles.error}>{errors.phone.message}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Update Profile
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <Button
                mode="outlined"
                onPress={handleChangePassword}
                loading={changingPassword}
                disabled={changingPassword}
                style={styles.button}
              >
                Change Password
              </Button>
              <Button
                mode="outlined"
                onPress={handleLogout}
                textColor={theme.colors.error}
                style={[styles.button, styles.logoutButton]}
              >
                Logout
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTablet: {
    paddingHorizontal: 48,
    paddingVertical: 40,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
    elevation: 4,
  },
  userDetails: {
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleContainer: {
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 20,
  },
  contentTablet: {
    paddingHorizontal: 48,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
  },
  cardTablet: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 16,
  },
  button: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  logoutButton: {
    borderColor: theme.colors.error,
    marginTop: 8,
  },
});


