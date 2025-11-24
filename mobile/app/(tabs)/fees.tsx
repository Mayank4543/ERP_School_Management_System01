import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { studentsService } from '@/services/api/students';
import { parentsService } from '@/services/api/parents';
import { format } from 'date-fns';
import { theme } from '@/theme/theme';

export default function FeesScreen() {
  const { user } = useAuth();
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const role = user?.roles?.[0] || user?.usergroup_id;

  useEffect(() => {
    loadFees();
  }, [selectedChild]);

  const loadFees = async () => {
    try {
      setLoading(true);
      let data: any[] = [];

      if (role === 'student') {
        const student = await studentsService.getStudentByUserId(user?.id || '');
        if (student?._id) {
          const feesData = await studentsService.getFees(student._id);
          data = feesData?.data || feesData || [];
        }
      } else if (role === 'parent') {
        if (selectedChild) {
          const feesData = await parentsService.getChildFees(selectedChild);
          data = feesData?.data || feesData || [];
        }
      }

      setFees(data);
    } catch (error) {
      console.error('Error loading fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFees();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'overdue':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const calculateTotal = () => {
    const total = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const paid = fees
      .filter((fee) => fee.status === 'paid')
      .reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const pending = total - paid;

    return { total, paid, pending };
  };

  const stats = calculateTotal();

  const handlePayFee = async (feeId: string) => {
    // Implement payment flow
    // This would typically open a payment gateway
    console.log('Pay fee:', feeId);
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
        <Text style={styles.title}>Fees</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>₹{stats.total}</Text>
            <Text style={styles.statLabel}>Total Fees</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              ₹{stats.paid}
            </Text>
            <Text style={styles.statLabel}>Paid</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              ₹{stats.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Fee Details</Text>
      {fees.length > 0 ? (
        fees.map((fee, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.feeHeader}>
                <Text style={styles.feeType}>{fee.fee_type}</Text>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(fee.status) },
                  ]}
                  textStyle={styles.statusText}
                >
                  {fee.status.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.feeAmount}>₹{fee.amount}</Text>
              <Text style={styles.feeDate}>
                Due Date: {format(new Date(fee.due_date), 'MMM dd, yyyy')}
              </Text>
              {fee.paid_date && (
                <Text style={styles.paidDate}>
                  Paid On: {format(new Date(fee.paid_date), 'MMM dd, yyyy')}
                </Text>
              )}
              {fee.status === 'pending' && (
                <Button
                  mode="contained"
                  onPress={() => handlePayFee(fee._id)}
                  style={styles.payButton}
                >
                  Pay Now
                </Button>
              )}
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.emptyText}>No fees found</Text>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  feeType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  feeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
  },
  feeDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  paidDate: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  payButton: {
    marginTop: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});



