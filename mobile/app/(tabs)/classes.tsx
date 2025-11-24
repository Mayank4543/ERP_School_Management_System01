import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, ActivityIndicator, Chip } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { teachersService } from '@/services/api/teachers';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';

export default function ClassesScreen() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const teacher = await teachersService.getTeacherByUserId(user?.id || '');
      if (teacher?._id) {
        const classesData = await teachersService.getClasses(teacher._id);
        setClasses(classesData?.data || classesData || []);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
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
        <Text style={styles.title}>My Classes</Text>
      </View>

      {classes.length > 0 ? (
        classes.map((classItem, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/classes/[id]',
                params: { id: classItem._id || classItem.id },
              });
            }}
          >
            <Card.Content>
              <View style={styles.classHeader}>
                <Text style={styles.className}>
                  {classItem.class_name || `${classItem.standard} - ${classItem.section}`}
                </Text>
                <Chip style={styles.subjectChip}>
                  {classItem.subject}
                </Chip>
              </View>
              <Text style={styles.studentsCount}>
                Students: {classItem.students_count || 0}
              </Text>
              {classItem.schedule && (
                <Text style={styles.schedule}>
                  Schedule: {classItem.schedule}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No classes assigned</Text>
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
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  subjectChip: {
    marginLeft: 8,
    backgroundColor: theme.colors.primary,
  },
  studentsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  schedule: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



