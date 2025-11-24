import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, ActivityIndicator, Chip } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { studentsService } from '@/services/api/students';
import { teachersService } from '@/services/api/teachers';
import { parentsService } from '@/services/api/parents';
import { format } from 'date-fns';
import { theme } from '@/theme/theme';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const role = user?.roles?.[0] || user?.usergroup_id;

  useEffect(() => {
    loadAttendance();
  }, [selectedChild]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      let data: any[] = [];

      if (role === 'student') {
        const student = await studentsService.getStudentByUserId(user?.id || '');
        if (student?._id) {
          const attendanceData = await studentsService.getAttendance(student._id);
          data = attendanceData?.data || attendanceData || [];
        }
      } else if (role === 'teacher') {
        // Teacher can view attendance for their classes
        // This would need class selection
        data = [];
      } else if (role === 'parent') {
        if (selectedChild) {
          const attendanceData = await parentsService.getChildAttendance(selectedChild);
          data = attendanceData?.data || attendanceData || [];
        }
      }

      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendance();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      case 'late':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent, percentage };
  };

  const stats = calculateStats();

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
        <Text style={styles.title}>Attendance</Text>
        {role === 'parent' && (
          <Text style={styles.subtitle}>Select a child to view attendance</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Attendance Rate</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Recent Attendance</Text>
      {attendance.length > 0 ? (
        attendance.slice(0, 30).map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.attendanceRow}>
                <View style={styles.attendanceInfo}>
                  <Text style={styles.date}>
                    {format(new Date(item.date), 'MMM dd, yyyy')}
                  </Text>
                  {item.remarks && (
                    <Text style={styles.remarks}>{item.remarks}</Text>
                  )}
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                  textStyle={styles.statusText}
                >
                  {item.status.toUpperCase()}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No attendance records found</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceInfo: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  remarks: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



