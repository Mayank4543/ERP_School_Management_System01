import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

export default function TabsLayout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Determine tabs based on user role
  const getTabs = () => {
    const role = user?.roles?.[0] || user?.usergroup_id;
    
    switch (role) {
      case 'student':
        return [
          { name: 'index', title: 'Dashboard', icon: 'view-dashboard' },
          { name: 'attendance', title: 'Attendance', icon: 'calendar-check' },
          { name: 'assignments', title: 'Assignments', icon: 'file-document' },
          { name: 'exams', title: 'Exams', icon: 'school' },
          { name: 'profile', title: 'Profile', icon: 'account' },
        ];
      case 'teacher':
        return [
          { name: 'index', title: 'Dashboard', icon: 'view-dashboard' },
          { name: 'classes', title: 'Classes', icon: 'account-group' },
          { name: 'attendance', title: 'Attendance', icon: 'calendar-check' },
          { name: 'assignments', title: 'Assignments', icon: 'file-document' },
          { name: 'profile', title: 'Profile', icon: 'account' },
        ];
      case 'parent':
        return [
          { name: 'index', title: 'Dashboard', icon: 'view-dashboard' },
          { name: 'children', title: 'Children', icon: 'account-group' },
          { name: 'attendance', title: 'Attendance', icon: 'calendar-check' },
          { name: 'fees', title: 'Fees', icon: 'cash' },
          { name: 'profile', title: 'Profile', icon: 'account' },
        ];
      default:
        return [
          { name: 'index', title: 'Dashboard', icon: 'view-dashboard' },
          { name: 'profile', title: 'Profile', icon: 'account' },
        ];
    }
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



