import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ role }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {role === 'TEACHER' ? "You haven't created any classes yet." : "You haven't joined any classes yet."}
      </Text>
      <Text style={styles.emptySubText}>Tap the + button to get started.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#3c4043', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#5f6368' },
});