import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

export default function TabsLayout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Show only 4 main tabs for all users
  const getTabs = () => {
    return [
      { name: 'index', title: 'Home', icon: 'home' },
      { name: 'assignments', title: 'Tasks', icon: 'clipboard-list' },
      { name: 'attendance', title: 'Attendance', icon: 'calendar-check' },
      { name: 'profile', title: 'Profile', icon: 'account' },
    ];
  };

  const tabs = getTabs();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}



