import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius } from '@/theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const handleGetStarted = () => {
        router.push('/role-selection');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            <LinearGradient
                colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="school" size={48} color={theme.colors.onPrimary} />
                        </View>
                        <Text style={styles.brandName}>edumanage.</Text>
                        <Text style={styles.tagline}>SCHOOL MANAGEMENT MADE EASY</Text>
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        <Text style={styles.heroTitle}>
                            Master School Management with{'\n'}
                            Clarity & Confidence
                        </Text>
                        <Text style={styles.subtitle}>
                            Your one stop solution for comprehensive{'\n'}
                            school management system.
                        </Text>
                    </View>

                    {/* Action Button */}
                    <View style={styles.actionSection}>
                        <TouchableOpacity
                            style={styles.getStartedButton}
                            onPress={handleGetStarted}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-forward" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'space-between',
        paddingVertical: spacing.xxl,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: spacing.xxl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    brandName: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.onPrimary,
        letterSpacing: -0.5,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.onPrimary,
        letterSpacing: 2,
        opacity: 0.9,
    },
    mainContent: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.onPrimary,
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: spacing.lg,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: theme.colors.onPrimary,
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
    },
    actionSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    getStartedButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.onPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});