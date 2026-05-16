import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardHeader({ userName, role }) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, {userName?.split(' ')[0] || 'User'}</Text>
      <Text style={styles.roleBadge}>{role.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greeting: { fontSize: 24, fontWeight: '700', color: '#202124' },
  roleBadge: {
    fontSize: 12, fontWeight: '600', color: '#5f6368', backgroundColor: '#e8eaed',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden',
  },
});