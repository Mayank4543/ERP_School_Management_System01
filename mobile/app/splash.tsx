import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, spacing } from '@/theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        // Start the animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to welcome screen after 2 seconds
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            <LinearGradient
                colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
                style={styles.gradient}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={64} color={theme.colors.onPrimary} />
                    </View>
                    <Text style={styles.brandName}>edumanage.</Text>
                    <Text style={styles.tagline}>SCHOOL MANAGEMENT MADE EASY</Text>
                </Animated.View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    brandName: {
        fontSize: 40,
        fontWeight: '700',
        color: theme.colors.onPrimary,
        letterSpacing: -1,
        marginBottom: spacing.md,
    },
    tagline: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.onPrimary,
        letterSpacing: 3,
        opacity: 0.9,
        textAlign: 'center',
    },
});