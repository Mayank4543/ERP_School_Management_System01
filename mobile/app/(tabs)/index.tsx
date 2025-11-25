import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { dashboardService } from '@/services/api/dashboard';
import { theme } from '@/theme/theme';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { ParentDashboard } from '@/components/dashboard/ParentDashboard';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const role = user?.roles?.[0] || user?.usergroup_id;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboard(role, user?.id);
      setDashboardData(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
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
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {role === 'student' && (
            <StudentDashboard
              user={user}
              data={dashboardData}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          )}
          {role === 'teacher' && (
            <TeacherDashboard
              user={user}
              data={dashboardData}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          )}
          {role === 'parent' && (
            <ParentDashboard
              user={user}
              data={dashboardData}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



