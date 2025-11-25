import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius } from '@/theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface RoleOptionProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    role: string;
    onPress: () => void;
    isSelected?: boolean;
}

const RoleOption: React.FC<RoleOptionProps> = ({ icon, title, role, onPress, isSelected }) => (
    <TouchableOpacity
        style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
            <Ionicons
                name={icon}
                size={32}
                color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
            />
        </View>
        <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{title}</Text>
    </TouchableOpacity>
);

export default function RoleSelectionScreen() {
    const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (selectedRole) {
            router.push(`/(auth)/login?role=${selectedRole}`);
        }
    };

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/welcome');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.content}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={32} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.brandName}>edumanage.</Text>
                    <Text style={styles.tagline}>SCHOOL MANAGEMENT MADE EASY</Text>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Let's Get You Started</Text>
                    <Text style={styles.subtitle}>Choose How You'd Like to Continue</Text>
                </View>

                {/* Role Options */}
                <View style={styles.rolesContainer}>
                    <RoleOption
                        icon="person-outline"
                        title="Continue as Student"
                        role="student"
                        onPress={() => handleRoleSelect('student')}
                        isSelected={selectedRole === 'student'}
                    />

                    <RoleOption
                        icon="library-outline"
                        title="Continue as Teacher"
                        role="teacher"
                        onPress={() => handleRoleSelect('teacher')}
                        isSelected={selectedRole === 'teacher'}
                    />

                    <RoleOption
                        icon="people-outline"
                        title="Continue as Parent"
                        role="parent"
                        onPress={() => handleRoleSelect('parent')}
                        isSelected={selectedRole === 'parent'}
                    />
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        selectedRole ? styles.continueButtonActive : styles.continueButtonInactive
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedRole}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.continueButtonText,
                        selectedRole ? styles.continueButtonTextActive : styles.continueButtonTextInactive
                    ]}>
                        CONTINUE
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
        padding: spacing.sm,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.primary,
        letterSpacing: -0.5,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: 10,
        fontWeight: '500',
        color: theme.colors.textSecondary,
        letterSpacing: 1.5,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: theme.colors.textSecondary,
    },
    rolesContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: spacing.lg,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: theme.colors.surfaceVariant,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    roleOptionSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryContainer,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    iconContainerSelected: {
        backgroundColor: theme.colors.surface,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.colors.text,
        flex: 1,
    },
    roleTitleSelected: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    continueButton: {
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    continueButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    continueButtonInactive: {
        backgroundColor: theme.colors.surfaceVariant,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    continueButtonTextActive: {
        color: theme.colors.onPrimary,
    },
    continueButtonTextInactive: {
        color: theme.colors.textSecondary,
    },
});