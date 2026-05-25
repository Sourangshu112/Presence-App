// src/components/PersonRow.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UserAvatar from './Avatar';
import AntDesign from '@expo/vector-icons/AntDesign';

// The Main Row Component
export function PersonRowWithoutAction({ item, isTeacher }) {
  return (
    <View style={styles.personRow}>
      <View style={styles.personNameContainer}>
        <UserAvatar name={item.name} isTeacher={isTeacher} />
        <Text style={styles.personName}>{item.name}</Text>
      </View>
    </View>
  );
}

export function PersonRowWithAction({item}){
  
  return (
    <TouchableOpacity style={styles.personRow}>
      <View style={styles.personNameContainer}>
        <UserAvatar name={item.name} isTeacher={false} />
        <Text style={styles.personName}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={handlePress}>
        <AntDesign name="more" size={22} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  personName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  personNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});