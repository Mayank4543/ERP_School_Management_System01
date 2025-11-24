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
import { format, isAfter, isBefore } from 'date-fns';
import { theme } from '@/theme/theme';

export default function ExamsScreen() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const student = await studentsService.getStudentByUserId(user?.id || '');
      if (student?._id) {
        const examsData = await studentsService.getExams(student._id);
        setExams(examsData?.data || examsData || []);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExams();
    setRefreshing(false);
  };

  const getExamStatus = (examDate: string) => {
    const exam = new Date(examDate);
    const now = new Date();
    
    if (isBefore(exam, now)) {
      return { status: 'completed', color: '#4CAF50', label: 'Completed' };
    } else if (isAfter(exam, now)) {
      return { status: 'upcoming', color: '#2196F3', label: 'Upcoming' };
    } else {
      return { status: 'today', color: '#FF9800', label: 'Today' };
    }
  };

  const upcomingExams = exams.filter((exam) => {
    const examDate = new Date(exam.exam_date);
    return isAfter(examDate, new Date()) || examDate.toDateString() === new Date().toDateString();
  });

  const pastExams = exams.filter((exam) => {
    const examDate = new Date(exam.exam_date);
    return isBefore(examDate, new Date());
  });

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
        <Text style={styles.title}>Exams</Text>
      </View>

      {upcomingExams.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming Exams</Text>
          {upcomingExams.map((exam, index) => {
            const examStatus = getExamStatus(exam.exam_date);
            return (
              <Card key={index} style={styles.card}>
                <Card.Content>
                  <View style={styles.examHeader}>
                    <Text style={styles.examName}>{exam.name || exam.subject}</Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: examStatus.color },
                      ]}
                      textStyle={styles.statusText}
                    >
                      {examStatus.label}
                    </Chip>
                  </View>
                  <Text style={styles.examSubject}>Subject: {exam.subject}</Text>
                  <Text style={styles.examDate}>
                    Date: {format(new Date(exam.exam_date), 'MMM dd, yyyy')}
                  </Text>
                  <View style={styles.examDetails}>
                    <Text style={styles.examMarks}>
                      Total Marks: {exam.total_marks}
                    </Text>
                    <Text style={styles.examMarks}>
                      Passing: {exam.passing_marks}
                    </Text>
                  </View>
                  {exam.marks_obtained !== undefined && (
                    <View style={styles.resultContainer}>
                      <Text style={styles.resultLabel}>Your Score:</Text>
                      <Text style={styles.resultScore}>
                        {exam.marks_obtained} / {exam.total_marks}
                      </Text>
                      <Text
                        style={[
                          styles.resultStatus,
                          {
                            color:
                              exam.marks_obtained >= exam.passing_marks
                                ? '#4CAF50'
                                : '#F44336',
                          },
                        ]}
                      >
                        {exam.marks_obtained >= exam.passing_marks
                          ? 'Passed'
                          : 'Failed'}
                      </Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </>
      )}

      {pastExams.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Past Exams</Text>
          {pastExams.map((exam, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.examName}>{exam.name || exam.subject}</Text>
                <Text style={styles.examSubject}>Subject: {exam.subject}</Text>
                <Text style={styles.examDate}>
                  Date: {format(new Date(exam.exam_date), 'MMM dd, yyyy')}
                </Text>
                {exam.marks_obtained !== undefined ? (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Score:</Text>
                    <Text style={styles.resultScore}>
                      {exam.marks_obtained} / {exam.total_marks}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noResult}>Results not available</Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </>
      )}

      {exams.length === 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No exams found</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  examSubject: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  examDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  examMarks: {
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  noResult: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



