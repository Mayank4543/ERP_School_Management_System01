// src/screens/admin/AdminHomeScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, useTheme, Avatar } from 'react-native-paper';

const AdminHomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const features = [
    { 
      title: 'Students', 
      icon: 'account-school',
      count: 245,
      onPress: () => navigation.navigate('StudentManagement')
    },
    { 
      title: 'Teachers', 
      icon: 'teach',
      count: 32,
      onPress: () => navigation.navigate('TeacherManagement')
    },
    { 
      title: 'Parents', 
      icon: 'account-group',
      count: 180,
      onPress: () => navigation.navigate('ParentManagement')
    },
    { 
      title: 'Classes', 
      icon: 'school',
      count: 12,
      onPress: () => navigation.navigate('ClassManagement')
    },
    { 
      title: 'Attendance', 
      icon: 'calendar-check',
      onPress: () => navigation.navigate('AttendanceManagement')
    },
    { 
      title: 'Exams', 
      icon: 'file-document',
      onPress: () => navigation.navigate('ExamManagement')
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Welcome, Admin</Title>
        <Paragraph>Manage your school efficiently</Paragraph>
      </View>

      <View style={styles.grid}>
        {features.map((feature, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={feature.onPress}
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon 
                icon={feature.icon} 
                size={50} 
                style={{ backgroundColor: colors.primaryContainer }}
                color={colors.primary}
              />
              <Title style={styles.cardTitle}>{feature.title}</Title>
              {feature.count !== undefined && (
                <Paragraph style={styles.cardCount}>{feature.count}</Paragraph>
              )}
            </Card.Content>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default AdminHomeScreen;