import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { parentsService } from '@/services/api/parents';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';

export default function ChildrenScreen() {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const childrenData = await parentsService.getChildren(user?.id || '');
      setChildren(childrenData?.data || childrenData || []);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChildren();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Children</Text>
      </View>

      {children.length > 0 ? (
        children.map((child, index) => (
          <Card
            key={index}
            style={[
              styles.card,
              selectedChild === child._id && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedChild(child._id);
              // Store selected child for other screens
            }}
          >
            <Card.Content>
              <Text style={styles.childName}>
                {child.first_name} {child.last_name}
              </Text>
              <Text style={styles.childInfo}>
                Admission No: {child.admission_no}
              </Text>
              <Text style={styles.childInfo}>
                Class: {child.standard} - {child.section}
              </Text>
              <View style={styles.childStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {child.attendance_percentage || 'N/A'}%
                  </Text>
                  <Text style={styles.statLabel}>Attendance</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {child.average_score || 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No children found</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  childName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  childInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  childStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



