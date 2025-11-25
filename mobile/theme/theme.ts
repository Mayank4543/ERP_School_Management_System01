import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2', // Deep blue from reference
    primaryContainer: '#E3F2FD',
    secondary: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#F5F5F5',
    text: '#1a1a1a',
    textSecondary: '#666666',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    accent: '#00BCD4', // Teal accent
    gradient: {
      start: '#1976D2',
      end: '#42A5F5',
    },
  },
};

// Custom typography for consistency
export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: theme.colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Common border radius values
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};



