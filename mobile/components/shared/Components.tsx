import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/theme/theme';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    style?: any;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
}) => {
    const getButtonStyle = () => {
        const baseStyles = [styles.button];

        if (variant === 'primary') {
            baseStyles.push(styles.primaryButton);
        } else if (variant === 'secondary') {
            baseStyles.push(styles.secondaryButton);
        } else if (variant === 'outline') {
            baseStyles.push(styles.outlineButton);
        }

        if (size === 'small') {
            baseStyles.push(styles.smallButton);
        } else if (size === 'large') {
            baseStyles.push(styles.largeButton);
        }

        if (disabled) {
            baseStyles.push(styles.disabledButton);
        }

        return style ? [...baseStyles, style] : baseStyles;
    };

    const getTextStyle = () => {
        const baseStyles = [styles.buttonText];

        if (variant === 'primary') {
            baseStyles.push(styles.primaryButtonText);
        } else if (variant === 'secondary') {
            baseStyles.push(styles.secondaryButtonText);
        } else if (variant === 'outline') {
            baseStyles.push(styles.outlineButtonText);
        }

        if (size === 'small') {
            baseStyles.push(styles.smallButtonText);
        } else if (size === 'large') {
            baseStyles.push(styles.largeButtonText);
        }

        if (disabled) {
            baseStyles.push(styles.disabledButtonText);
        }

        return baseStyles;
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={16}
                    color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.primary}
                    style={styles.buttonIcon}
                />
            )}
            <Text style={getTextStyle()}>
                {loading ? 'Loading...' : title}
            </Text>
        </TouchableOpacity>
    );
};

interface LogoHeaderProps {
    showBackButton?: boolean;
    onBackPress?: () => void;
    title?: string;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({
    showBackButton = false,
    onBackPress,
    title,
}) => {
    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            )}

            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name="school" size={32} color={theme.colors.primary} />
                </View>
                <Text style={styles.brandName}>edumanage.</Text>
                <Text style={styles.tagline}>SCHOOL MANAGEMENT MADE EASY</Text>
                {title && <Text style={styles.headerTitle}>{title}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Button Styles
    button: {
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    smallButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    largeButton: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    disabledButton: {
        backgroundColor: theme.colors.surfaceVariant,
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
    },
    primaryButtonText: {
        color: theme.colors.onPrimary,
    },
    secondaryButtonText: {
        color: theme.colors.onSecondary,
    },
    outlineButtonText: {
        color: theme.colors.primary,
    },
    smallButtonText: {
        fontSize: 14,
    },
    largeButtonText: {
        fontSize: 18,
    },
    disabledButtonText: {
        color: theme.colors.textSecondary,
    },
    buttonIcon: {
        marginRight: spacing.sm,
    },

    // Header Styles
    headerContainer: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    backButton: {
        alignSelf: 'flex-start' as const,
        marginBottom: spacing.lg,
        padding: spacing.sm,
    },
    logoSection: {
        alignItems: 'center' as const,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginBottom: spacing.md,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: theme.colors.primary,
        letterSpacing: -0.5,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: 10,
        fontWeight: '500' as const,
        color: theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '600' as const,
        color: theme.colors.text,
        marginTop: spacing.md,
    },
});