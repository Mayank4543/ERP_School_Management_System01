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

interface TeacherDashboardProps {
  user: any;
  data: any;
  onRefresh: () => void;
  refreshing: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  data,
  onRefresh,
  refreshing,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const categories = [
    { title: 'My Classes', icon: 'people-outline' as const, color: '#4CAF50' },
    { title: 'Attendance', icon: 'calendar-outline' as const, color: '#2196F3' },
    { title: 'Assignments', icon: 'document-text-outline' as const, color: '#FF9800' },
    { title: 'Grading', icon: 'checkmark-circle-outline' as const, color: '#9C27B0' },
    { title: 'Reports', icon: 'bar-chart-outline' as const, color: '#F44336' },
    { title: 'Schedule', icon: 'time-outline' as const, color: '#00BCD4' },
  ];

  const classes = [
    {
      title: 'Mathematics - Grade 10A',
      duration: '45 min',
      lessons: 32,
      students: 28,
    },
    {
      title: 'Mathematics - Grade 10B',
      duration: '45 min',
      lessons: 30,
      students: 25,
    },
    {
      title: 'Advanced Mathematics',
      duration: '60 min',
      lessons: 24,
      students: 15,
    },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: data?.students_count || '68',
      icon: 'people-outline' as const,
      color: '#4CAF50',
      subtitle: 'Across all classes',
    },
    {
      title: 'Classes Today',
      value: data?.today_classes || '5',
      icon: 'school-outline' as const,
      color: '#2196F3',
      subtitle: '2 completed',
    },
    {
      title: 'Pending Grading',
      value: data?.pending_grading || '12',
      icon: 'document-text-outline' as const,
      color: '#FF9800',
      subtitle: 'Assignments',
    },
    {
      title: 'Average Score',
      value: '87.5%',
      icon: 'trophy-outline' as const,
      color: '#9C27B0',
      subtitle: 'Class average',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <DashboardHeader
        userName={`${user?.first_name} ${user?.last_name}`}
        userRole="Teacher"
        profileImage={user?.profile_image}
        onProfilePress={() => { }}
        onNotificationPress={() => { }}
        onMenuPress={() => setSidebarVisible(true)}
        notificationCount={5}
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
            <Text style={styles.sectionTitle}>Quick Actions</Text>
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

        {/* Teaching Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Overview</Text>
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

        {/* My Classes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Classes</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Manage All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.classesScroll}
          >
            {classes.map((classItem, index) => (
              <View key={index} style={styles.courseCardContainer}>
                <CourseCard
                  title={classItem.title}
                  duration={classItem.duration}
                  lessons={classItem.lessons}
                  students={classItem.students}
                  onPress={() => { }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.scheduleCard}>
            {data?.today_schedule?.length > 0 ? (
              data.today_schedule.map((item: any, index: number) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleTime}>
                    <Text style={styles.scheduleTimeText}>{item.time}</Text>
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleSubject}>
                      {item.subject} - {item.class}
                    </Text>
                    <Text style={styles.scheduleRoom}>Room: {item.room}</Text>
                    <Text style={styles.scheduleStudents}>
                      {item.students_count} students
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.takeAttendanceBtn}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.takeAttendanceText}>Take Attendance</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No classes scheduled today</Text>
                <Text style={styles.emptySubtext}>Enjoy your preparation time!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pending Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Tasks</Text>
          <View style={styles.tasksContainer}>
            <TouchableOpacity style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Ionicons name="document-text-outline" size={24} color={theme.colors.warning} />
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>Grade Mathematics Test</Text>
                <Text style={styles.taskSubtitle}>Grade 10A • 28 submissions</Text>
              </View>
              <View style={styles.taskBadge}>
                <Text style={styles.taskBadgeText}>Due Tomorrow</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>Submit Attendance Report</Text>
                <Text style={styles.taskSubtitle}>Weekly report for administration</Text>
              </View>
              <View style={[styles.taskBadge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.taskBadgeText}>Overdue</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.success} />
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>Prepare Lesson Plan</Text>
                <Text style={styles.taskSubtitle}>Advanced Mathematics - Chapter 5</Text>
              </View>
              <View style={[styles.taskBadge, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.taskBadgeText}>This Week</Text>
              </View>
            </TouchableOpacity>
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
  classesScroll: {
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
  scheduleRoom: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  scheduleStudents: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  takeAttendanceBtn: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  takeAttendanceText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '500',
    marginTop: spacing.xs,
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
  tasksContainer: {
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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  taskSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  taskBadge: {
    backgroundColor: theme.colors.warning,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  taskBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});