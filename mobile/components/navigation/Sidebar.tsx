import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    Animated,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { theme, spacing, borderRadius } from '@/theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(320, SCREEN_WIDTH * 0.8);

interface SidebarProps {
    isVisible: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
    const { user, logout } = useAuth();

    if (!isVisible) return null;

    const role = user?.roles?.[0] || user?.usergroup_id;

    const getMenuItems = () => {
        const commonItems = [
            { title: 'Dashboard', icon: 'home-outline' as const, route: '/(tabs)/' },
            { title: 'Profile', icon: 'person-outline' as const, route: '/(tabs)/profile' },
        ];

        switch (role) {
            case 'student':
                return [
                    ...commonItems,
                    { title: 'Courses', icon: 'book-outline' as const, route: '/courses' },
                    { title: 'Assignments', icon: 'document-text-outline' as const, route: '/(tabs)/assignments' },
                    { title: 'Attendance', icon: 'calendar-outline' as const, route: '/(tabs)/attendance' },
                    { title: 'Exams', icon: 'school-outline' as const, route: '/(tabs)/exams' },
                    { title: 'Grades', icon: 'trophy-outline' as const, route: '/grades' },
                    { title: 'Library', icon: 'library-outline' as const, route: '/library' },
                    { title: 'Events', icon: 'calendar-clear-outline' as const, route: '/events' },
                    { title: 'Fees', icon: 'card-outline' as const, route: '/fees' },
                    { title: 'Messages', icon: 'mail-outline' as const, route: '/messages' },
                    { title: 'Downloads', icon: 'download-outline' as const, route: '/downloads' },
                ];
            case 'teacher':
                return [
                    ...commonItems,
                    { title: 'My Classes', icon: 'people-outline' as const, route: '/(tabs)/classes' },
                    { title: 'Attendance', icon: 'calendar-outline' as const, route: '/(tabs)/attendance' },
                    { title: 'Assignments', icon: 'document-text-outline' as const, route: '/(tabs)/assignments' },
                    { title: 'Grading', icon: 'checkmark-circle-outline' as const, route: '/grading' },
                    { title: 'Reports', icon: 'bar-chart-outline' as const, route: '/reports' },
                    { title: 'Schedule', icon: 'time-outline' as const, route: '/schedule' },
                    { title: 'Students', icon: 'school-outline' as const, route: '/students' },
                    { title: 'Messages', icon: 'mail-outline' as const, route: '/messages' },
                    { title: 'Resources', icon: 'folder-outline' as const, route: '/resources' },
                ];
            case 'parent':
                return [
                    ...commonItems,
                    { title: 'My Children', icon: 'people-outline' as const, route: '/(tabs)/children' },
                    { title: 'Attendance', icon: 'calendar-outline' as const, route: '/(tabs)/attendance' },
                    { title: 'Grades', icon: 'trophy-outline' as const, route: '/grades' },
                    { title: 'Fees', icon: 'card-outline' as const, route: '/(tabs)/fees' },
                    { title: 'Messages', icon: 'mail-outline' as const, route: '/messages' },
                    { title: 'Events', icon: 'calendar-clear-outline' as const, route: '/events' },
                    { title: 'Transport', icon: 'bus-outline' as const, route: '/transport' },
                    { title: 'Reports', icon: 'document-outline' as const, route: '/reports' },
                    { title: 'Meetings', icon: 'videocam-outline' as const, route: '/meetings' },
                ];
            default:
                return commonItems;
        }
    };

    const menuItems = getMenuItems();

    const handleNavigation = (route: string) => {
        onClose();
        if (route.startsWith('/(tabs)')) {
            router.push(route as any);
        } else {
            // For non-tab routes, you might want to handle differently
            Alert.alert('Coming Soon', 'This feature will be available soon!');
        }
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
                    onClose();
                },
            },
        ]);
    };

    const getRoleColor = () => {
        switch (role) {
            case 'student':
                return '#4CAF50';
            case 'teacher':
                return '#2196F3';
            case 'parent':
                return '#9C27B0';
            default:
                return theme.colors.primary;
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.sidebar}>
                <SafeAreaView style={styles.sidebarContent}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.userSection}>
                            <TouchableOpacity
                                style={styles.profileImageContainer}
                                onPress={() => handleNavigation('/(tabs)/profile')}
                                activeOpacity={0.8}
                            >
                                {user?.profile_picture ? (
                                    <Image
                                        source={{ uri: user.profile_picture }}
                                        style={styles.profileImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.userAvatar, { backgroundColor: getRoleColor() }]}>
                                        <Text style={styles.userInitials}>
                                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.profileBadge}>
                                    <Ionicons name="camera" size={12} color={theme.colors.onPrimary} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName} numberOfLines={2}>
                                    {user?.first_name} {user?.last_name}
                                </Text>
                                <Text style={styles.userRole} numberOfLines={1}>
                                    {(role === 'student' && 'Student') ||
                                        (role === 'teacher' && 'Teacher') ||
                                        (role === 'parent' && 'Parent') ||
                                        'User'}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleNavigation('/(tabs)/profile')}
                                    style={styles.viewProfileButton}
                                >
                                    <Text style={styles.viewProfile}>View Profile</Text>
                                    <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleNavigation(item.route)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuIconContainer}>
                                    <Ionicons name={item.icon} size={22} color={theme.colors.text} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <View style={styles.logoutIconContainer}>
                                <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                            </View>
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>

                        <View style={styles.appVersionContainer}>
                            <Text style={styles.appVersion}>App Version - 10.0</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        backgroundColor: theme.colors.surface,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sidebarContent: {
        flex: 1,
    },
    header: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        paddingBottom: spacing.md,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    userInitials: {
        color: theme.colors.onPrimary,
        fontSize: 20,
        fontWeight: '600',
    },
    profileBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: theme.colors.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    userInfo: {
        flex: 1,
        paddingTop: spacing.xs,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: spacing.xs / 2,
        lineHeight: 20,
    },
    userRole: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    viewProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    viewProfile: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
        marginRight: spacing.xs,
    },
    menuContainer: {
        flex: 1,
        paddingTop: spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
    },
    menuIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '400',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
        paddingTop: spacing.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
    },
    logoutIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: spacing.md,
    },
    logoutText: {
        fontSize: 16,
        color: theme.colors.error,
        fontWeight: '500',
    },
    appVersionContainer: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: '#E3F2FD',
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.md,
    },
    appVersion: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },
});