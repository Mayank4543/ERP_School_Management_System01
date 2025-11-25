import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  profileImage?: string;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  onMenuPress: () => void;
  notificationCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userRole,
  profileImage,
  onProfilePress,
  onNotificationPress,
  onMenuPress,
  notificationCount = 0,
}) => {
  return (
    <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>Search here</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>


          <View style={styles.logoContainer}>
            <Ionicons name="school" size={32} color={theme.colors.primary} />
            <Text style={styles.schoolName}>EduManage</Text>
            <Text style={styles.schoolTagline}>School Management System</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface CategoryCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

interface CourseCardProps {
  title: string;
  instructor?: string;
  duration: string;
  lessons: number;
  students?: number;
  image?: string;
  progress?: number;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  duration,
  lessons,
  students,
  image,
  progress,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress}>
      <View style={styles.courseImageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.courseImage} />
        ) : (
          <View style={styles.defaultCourseImage}>
            <Ionicons name="book" size={32} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{title}</Text>
        {instructor && (
          <Text style={styles.courseInstructor}>by {instructor}</Text>
        )}

        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.courseStatText}>{duration}</Text>
          </View>

          <View style={styles.courseStat}>
            <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.courseStatText}>{lessons} Lessons</Text>
          </View>

          {students && (
            <View style={styles.courseStat}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.courseStatText}>{students}+ students</Text>
            </View>
          )}
        </View>

        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsIconContainer}>
        <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>

      <View style={styles.statsContent}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.statsSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header Styles
  headerSafeArea: {
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.background,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 56, // Ensures minimum touch target
  },
  menuButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxWidth: SCREEN_WIDTH * 0.6, // Responsive width
  },
  searchPlaceholder: {
    marginLeft: spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  notificationButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  profileSection: {
    paddingHorizontal: spacing.lg,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileImageContainer: {
    marginRight: spacing.md,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.onPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  viewProfile: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: spacing.xs,
  },
  schoolTagline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Category Card Styles
  categoryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: spacing.md,
    width: (SCREEN_WIDTH - (spacing.lg * 2) - (spacing.sm * 2)) / 3,
    minHeight: 100,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },

  // Course Card Styles
  courseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: spacing.md,
  },
  courseImageContainer: {
    marginBottom: spacing.md,
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
  },
  defaultCourseImage: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  courseInstructor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseStatText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 3,
    marginRight: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
  },

  // Stats Card Styles
  statsCard: {
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
    marginBottom: spacing.md,
  },
  statsIconContainer: {
    marginBottom: spacing.sm,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  statsSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});