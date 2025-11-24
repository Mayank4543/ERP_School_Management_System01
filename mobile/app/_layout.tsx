import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/theme/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}



