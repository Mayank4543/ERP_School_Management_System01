import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { studentsService } from '@/services/api/students';
import { teachersService } from '@/services/api/teachers';
import { format } from 'date-fns';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';

export default function AssignmentsScreen() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const role = user?.roles?.[0] || user?.usergroup_id;

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      let data: any[] = [];

      if (role === 'student') {
        const student = await studentsService.getStudentByUserId(user?.id || '');
        if (student?._id) {
          const assignmentsData = await studentsService.getAssignments(student._id);
          data = assignmentsData?.data || assignmentsData || [];
        }
      } else if (role === 'teacher') {
        const teacher = await teachersService.getTeacherByUserId(user?.id || '');
        if (teacher?._id) {
          const assignmentsData = await teachersService.getAssignments(teacher._id);
          data = assignmentsData?.data || assignmentsData || [];
        }
      }

      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'submitted' || status === 'graded') {
      return '#4CAF50';
    }
    const due = new Date(dueDate);
    const now = new Date();
    if (due < now) {
      return '#F44336';
    }
    return '#FF9800';
  };

  const getStatusText = (assignment: any) => {
    if (assignment.submission_status === 'submitted' || assignment.submission_status === 'graded') {
      return 'Submitted';
    }
    const due = new Date(assignment.due_date);
    const now = new Date();
    if (due < now) {
      return 'Overdue';
    }
    return 'Pending';
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
        <Text style={styles.title}>Assignments</Text>
        {role === 'teacher' && (
          <Button
            mode="contained"
            onPress={() => router.push('/assignments/create')}
            style={styles.createButton}
          >
            Create Assignment
          </Button>
        )}
      </View>

      {assignments.length > 0 ? (
        assignments.map((assignment, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => {
              if (role === 'student') {
                router.push(`/assignments/${assignment._id}`);
              } else {
                router.push(`/assignments/${assignment._id}/submissions`);
              }
            }}
          >
            <Card.Content>
              <View style={styles.assignmentHeader}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Chip
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: getStatusColor(
                        assignment.submission_status || 'pending',
                        assignment.due_date
                      ),
                    },
                  ]}
                  textStyle={styles.statusText}
                >
                  {getStatusText(assignment)}
                </Chip>
              </View>
              <Text style={styles.subject}>{assignment.subject}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {assignment.description}
              </Text>
              <View style={styles.assignmentFooter}>
                <Text style={styles.dueDate}>
                  Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                </Text>
                {assignment.grade && (
                  <Text style={styles.grade}>Grade: {assignment.grade}</Text>
                )}
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No assignments found</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  createButton: {
    marginLeft: 12,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    marginLeft: 'auto',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  subject: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  grade: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



