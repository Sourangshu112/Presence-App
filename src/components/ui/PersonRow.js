// src/components/PersonRow.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserAvatar from './Avatar';


// The Main Row Component
export default function PersonRow({ item, isTeacher }) {
  return (
    <View style={styles.personRow}>
      <UserAvatar name={item.name} isTeacher={isTeacher} />
      <Text style={styles.personName}>{item.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  personName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
});