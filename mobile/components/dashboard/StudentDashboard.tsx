import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/theme/theme';
import {
  DashboardHeader,
  CategoryCard,
  CourseCard,
  StatsCard,
} from '@/components/dashboard/DashboardComponents';
import { Sidebar } from '@/components/navigation/Sidebar';

interface StudentDashboardProps {
  user: any;
  data: any;
  onRefresh: () => void;
  refreshing: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  data,
  onRefresh,
  refreshing,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const categories = [
    { title: 'Attendance', icon: 'calendar-outline' as const, color: '#4CAF50' },
    { title: 'Assignments', icon: 'document-text-outline' as const, color: '#2196F3' },
    { title: 'Exams', icon: 'school-outline' as const, color: '#FF9800' },
    { title: 'Results', icon: 'trophy-outline' as const, color: '#9C27B0' },
    { title: 'Fees', icon: 'card-outline' as const, color: '#F44336' },
    { title: 'Timetable', icon: 'time-outline' as const, color: '#00BCD4' },
  ];

  const courses = [
    {
      title: 'Mathematics',
      instructor: 'Mrs. Sarah Johnson',
      duration: '45 min',
      lessons: 24,
      progress: 75,
    },
    {
      title: 'Science',
      instructor: 'Mr. David Wilson',
      duration: '40 min',
      lessons: 18,
      progress: 60,
    },
    {
      title: 'English Literature',
      instructor: 'Ms. Emily Davis',
      duration: '50 min',
      lessons: 20,
      progress: 85,
    },
  ];

  const stats = [
    {
      title: 'Attendance Rate',
      value: data?.attendance_percentage || '95%',
      icon: 'calendar-outline' as const,
      color: '#4CAF50',
      subtitle: 'This month',
    },
    {
      title: 'Average Grade',
      value: data?.average_score || 'A-',
      icon: 'trophy-outline' as const,
      color: '#FF9800',
      subtitle: 'All subjects',
    },
    {
      title: 'Class Rank',
      value: data?.class_rank || '5th',
      icon: 'medal-outline' as const,
      color: '#9C27B0',
      subtitle: 'Out of 45 students',
    },
    {
      title: 'Completed Tasks',
      value: '18/25',
      icon: 'checkmark-circle-outline' as const,
      color: '#2196F3',
      subtitle: 'This week',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <DashboardHeader
        userName={`${user?.first_name} ${user?.last_name}`}
        userRole="Student"
        profileImage={user?.profile_image}
        onProfilePress={() => { }}
        onNotificationPress={() => { }}
        onMenuPress={() => setSidebarVisible(true)}
        notificationCount={3}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                icon={category.icon}
                color={category.color}
                onPress={() => { }}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCardContainer}>
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  subtitle={stat.subtitle}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Current Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Courses</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.coursesScroll}
          >
            {courses.map((course, index) => (
              <View key={index} style={styles.courseCardContainer}>
                <CourseCard
                  title={course.title}
                  instructor={course.instructor}
                  duration={course.duration}
                  lessons={course.lessons}
                  progress={course.progress}
                  onPress={() => { }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <View style={styles.scheduleCard}>
            {data?.today_schedule?.length > 0 ? (
              data.today_schedule.map((item: any, index: number) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleTime}>
                    <Text style={styles.scheduleTimeText}>{item.time}</Text>
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleSubject}>{item.subject}</Text>
                    <Text style={styles.scheduleTeacher}>{item.teacher}</Text>
                    <Text style={styles.scheduleRoom}>Room: {item.room}</Text>
                  </View>
                  <View style={styles.scheduleStatus}>
                    <Ionicons
                      name="ellipse"
                      size={12}
                      color={item.status === 'ongoing' ? '#4CAF50' : '#FF9800'}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No classes scheduled today</Text>
                <Text style={styles.emptySubtext}>Enjoy your day off!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Announcements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <Ionicons name="megaphone-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.announcementTitle}>School Sports Day</Text>
            </View>
            <Text style={styles.announcementText}>
              Annual sports day will be held on December 15th. All students are required to participate.
            </Text>
            <Text style={styles.announcementDate}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCardContainer: {
    width: '48%',
  },
  coursesScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  courseCardContainer: {
    width: 280,
    marginRight: spacing.md,
  },
  scheduleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  scheduleTime: {
    width: 80,
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  scheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  scheduleTeacher: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  scheduleRoom: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  scheduleStatus: {
    marginLeft: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  announcementCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: spacing.sm,
  },
  announcementText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  announcementDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});