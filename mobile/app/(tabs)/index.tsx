import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dashboardService } from '@/services/api/dashboard';
import { theme } from '@/theme/theme';

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
        </View>
        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      {role === 'student' && <StudentDashboard data={dashboardData} />}
      {role === 'teacher' && <TeacherDashboard data={dashboardData} />}
      {role === 'parent' && <ParentDashboard data={dashboardData} />}
    </ScrollView>
  );
}

function StudentDashboard({ data }: { data: any }) {
  const stats = [
    {
      label: 'Attendance',
      value: data?.attendance_percentage || '0%',
      icon: 'calendar-check',
      color: '#4CAF50',
    },
    {
      label: 'Average Score',
      value: data?.average_score || 'N/A',
      icon: 'school',
      color: '#2196F3',
    },
    {
      label: 'Class Rank',
      value: data?.class_rank || 'N/A',
      icon: 'trophy',
      color: '#FF9800',
    },
    {
      label: 'Pending Fees',
      value: `₹${data?.pending_fees || 0}`,
      icon: 'cash',
      color: '#F44336',
    },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={32}
                color={stat.color}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      <Card style={styles.card}>
        <Card.Content>
          {data?.today_schedule?.length > 0 ? (
            data.today_schedule.map((item: any, index: number) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.scheduleSubject}>{item.subject}</Text>
                  <Text style={styles.scheduleTeacher}>{item.teacher}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No classes scheduled today</Text>
          )}
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Upcoming Exams</Text>
      <Card style={styles.card}>
        <Card.Content>
          {data?.upcoming_exams?.length > 0 ? (
            data.upcoming_exams.map((exam: any, index: number) => (
              <View key={index} style={styles.examItem}>
                <Text style={styles.examSubject}>{exam.subject}</Text>
                <Text style={styles.examDate}>{exam.date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming exams</Text>
          )}
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Pending Assignments</Text>
      <Card style={styles.card}>
        <Card.Content>
          {data?.pending_assignments?.length > 0 ? (
            data.pending_assignments.map((assignment: any, index: number) => (
              <View key={index} style={styles.assignmentItem}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentDue}>
                  Due: {assignment.due_date}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No pending assignments</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

function TeacherDashboard({ data }: { data: any }) {
  const stats = [
    {
      label: 'Classes',
      value: data?.classes_count || 0,
      icon: 'account-group',
      color: '#4CAF50',
    },
    {
      label: 'Students',
      value: data?.students_count || 0,
      icon: 'account-multiple',
      color: '#2196F3',
    },
    {
      label: 'Pending Grading',
      value: data?.pending_grading || 0,
      icon: 'file-document',
      color: '#FF9800',
    },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={32}
                color={stat.color}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      <Card style={styles.card}>
        <Card.Content>
          {data?.today_schedule?.length > 0 ? (
            data.today_schedule.map((item: any, index: number) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.scheduleSubject}>
                    {item.class} - {item.subject}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No classes scheduled today</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

function ParentDashboard({ data }: { data: any }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Children</Text>
      {data?.children?.map((child: any, index: number) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.childName}>
              {child.first_name} {child.last_name}
            </Text>
            <Text style={styles.childClass}>
              Class: {child.class} - {child.section}
            </Text>
            <View style={styles.childStats}>
              <Text>Attendance: {child.attendance_percentage}%</Text>
              <Text>Average: {child.average_score}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 20,
    color: '#1a1a1a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: '47%',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scheduleTeacher: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  examItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  examSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  examDate: {
    fontSize: 14,
    color: '#666',
  },
  assignmentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  assignmentDue: {
    fontSize: 14,
    color: '#F44336',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  childClass: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  childStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});



