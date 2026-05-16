import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FAB({ onPress }) {
  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 60, height: 60,
    borderRadius: 30, backgroundColor: '#1a73e8', justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#1a73e8', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  fabIcon: { fontSize: 32, color: '#fff', fontWeight: '300', lineHeight: 34 },
});