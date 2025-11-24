import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api/auth';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

interface ProfileForm {
  first_name: string;
  last_name: string;
  phone: string;
}

export default function ProfileScreen() {
  const { user, refreshUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || user?.mobile_no || '',
    },
  });

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{
            uri: user?.profile_picture || 'https://via.placeholder.com/80',
          }}
        />
        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>
          {user?.roles?.[0] || user?.usergroup_id || 'User'}
        </Text>
      </View>

      <Card style={styles.card}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  role: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  card: {
    margin: 20,
    marginTop: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});


