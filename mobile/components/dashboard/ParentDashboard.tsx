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

interface ParentDashboardProps {
  user: any;
  data: any;
  onRefresh: () => void;
  refreshing: boolean;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  user,
  data,
  onRefresh,
  refreshing,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const categories = [
    { title: 'My Children', icon: 'people-outline' as const, color: '#4CAF50' },
    { title: 'Attendance', icon: 'calendar-outline' as const, color: '#2196F3' },
    { title: 'Grades', icon: 'school-outline' as const, color: '#9C27B0' },
    { title: 'Messages', icon: 'mail-outline' as const, color: '#FF9800' },
    { title: 'Events', icon: 'calendar-clear-outline' as const, color: '#F44336' },
    { title: 'Fees', icon: 'card-outline' as const, color: '#00BCD4' },
  ];

  const children = [
    {
      name: 'Sarah Johnson',
      grade: 'Grade 10A',
      attendance: '95%',
      average: '88.5%',
      avatar: null, // We'll use initials instead
    },
    {
      name: 'Michael Johnson',
      grade: 'Grade 7B',
      attendance: '92%',
      average: '91.2%',
      avatar: null, // We'll use initials instead
    },
  ];

  const stats = [
    {
      title: 'Children',
      value: data?.children_count || '2',
      icon: 'people-outline' as const,
      color: '#4CAF50',
      subtitle: 'Active students',
    },
    {
      title: 'Avg Attendance',
      value: '93.5%',
      icon: 'calendar-outline' as const,
      color: '#2196F3',
      subtitle: 'This month',
    },
    {
      title: 'Avg Grades',
      value: '89.8%',
      icon: 'trophy-outline' as const,
      color: '#9C27B0',
      subtitle: 'Overall average',
    },
    {
      title: 'Unread Messages',
      value: data?.unread_messages || '3',
      icon: 'mail-outline' as const,
      color: '#FF9800',
      subtitle: 'From teachers',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Parent-Teacher Meeting',
      date: 'Dec 15, 2023',
      time: '2:00 PM',
      type: 'meeting',
    },
    {
      title: 'Science Fair',
      date: 'Dec 18, 2023',
      time: '10:00 AM',
      type: 'event',
    },
    {
      title: 'Winter Break Starts',
      date: 'Dec 22, 2023',
      time: 'All Day',
      type: 'holiday',
    },
  ];

  const recentActivities = [
    {
      child: 'Sarah Johnson',
      activity: 'Submitted Mathematics Assignment',
      time: '2 hours ago',
      grade: 'A',
    },
    {
      child: 'Michael Johnson',
      activity: 'Attended Science Class',
      time: '5 hours ago',
      grade: null,
    },
    {
      child: 'Sarah Johnson',
      activity: 'Quiz - English Literature',
      time: '1 day ago',
      grade: 'B+',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <DashboardHeader
        userName={`${user?.first_name} ${user?.last_name}`}
        userRole="Parent"
        profileImage={user?.profile_image}
        onProfilePress={() => { }}
        onNotificationPress={() => { }}
        onMenuPress={() => setSidebarVisible(true)}
        notificationCount={7}
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
            <Text style={styles.sectionTitle}>Quick Access</Text>
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

        {/* Family Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Overview</Text>
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

        {/* My Children */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Children</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.childrenContainer}>
            {children.map((child, index) => (
              <TouchableOpacity key={index} style={styles.childCard}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childInitials}>
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childGrade}>{child.grade}</Text>
                  <View style={styles.childStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="calendar-outline" size={14} color={theme.colors.primary} />
                      <Text style={styles.statText}>Attendance: {child.attendance}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="school-outline" size={14} color={theme.colors.success} />
                      <Text style={styles.statText}>Average: {child.average}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewDetailsBtn}>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.eventsContainer}>
            {upcomingEvents.map((event, index) => (
              <TouchableOpacity key={index} style={styles.eventItem}>
                <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) }]}>
                  <Ionicons
                    name={getEventIcon(event.type)}
                    size={20}
                    color={theme.colors.onPrimary}
                  />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventTimeContainer}>
                    <Ionicons name="calendar-outline" size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} style={styles.timeIcon} />
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addToCalendarBtn}>
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name={activity.grade ? "school-outline" : "checkmark-circle-outline"}
                    size={20}
                    color={activity.grade ? theme.colors.success : theme.colors.primary}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTitle}>{activity.activity}</Text>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityChild}>{activity.child}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
                {activity.grade && (
                  <View style={styles.gradeContainer}>
                    <Text style={styles.gradeText}>{activity.grade}</Text>
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.viewAllActivities}>
              <Text style={styles.viewAllActivitiesText}>View All Activities</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Communication Center */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Center</Text>
          <View style={styles.communicationContainer}>
            <TouchableOpacity style={styles.communicationItem}>
              <View style={[styles.communicationIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="mail-outline" size={24} color={theme.colors.onPrimary} />
              </View>
              <View style={styles.communicationDetails}>
                <Text style={styles.communicationTitle}>Messages from Teachers</Text>
                <Text style={styles.communicationSubtitle}>3 unread messages</Text>
              </View>
              <View style={styles.communicationBadge}>
                <Text style={styles.communicationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.communicationItem}>
              <View style={[styles.communicationIcon, { backgroundColor: theme.colors.warning }]}>
                <Ionicons name="megaphone-outline" size={24} color={theme.colors.onPrimary} />
              </View>
              <View style={styles.communicationDetails}>
                <Text style={styles.communicationTitle}>School Announcements</Text>
                <Text style={styles.communicationSubtitle}>Latest news and updates</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.communicationItem}>
              <View style={[styles.communicationIcon, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="call-outline" size={24} color={theme.colors.onPrimary} />
              </View>
              <View style={styles.communicationDetails}>
                <Text style={styles.communicationTitle}>Contact School</Text>
                <Text style={styles.communicationSubtitle}>Phone, email, or schedule meeting</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
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

const getEventIcon = (type: string): any => {
  switch (type) {
    case 'meeting':
      return 'people-outline';
    case 'event':
      return 'calendar-outline';
    case 'holiday':
      return 'sunny-outline';
    default:
      return 'calendar-outline';
  }
};

const getEventColor = (type: string): string => {
  switch (type) {
    case 'meeting':
      return theme.colors.primary;
    case 'event':
      return theme.colors.success;
    case 'holiday':
      return theme.colors.warning;
    default:
      return theme.colors.primary;
  }
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
  childrenContainer: {
    gap: spacing.md,
  },
  childCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInitials: {
    color: theme.colors.onPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  childGrade: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  childStats: {
    gap: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  viewDetailsBtn: {
    padding: spacing.sm,
  },
  eventsContainer: {
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
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  timeIcon: {
    marginLeft: spacing.sm,
  },
  eventTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  addToCalendarBtn: {
    padding: spacing.sm,
  },
  activitiesContainer: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityChild: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  gradeContainer: {
    backgroundColor: theme.colors.success,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginLeft: spacing.sm,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  viewAllActivities: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  viewAllActivitiesText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  communicationContainer: {
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
  communicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  communicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  communicationDetails: {
    flex: 1,
  },
  communicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  communicationSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  communicationBadge: {
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communicationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});