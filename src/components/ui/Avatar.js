import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const UserAvatar = ({ name, isTeacher }) => (
  <View style={[styles.avatar, { backgroundColor: isTeacher ? '#4A90E2' : '#BDBDBD' }]}>
    <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : '?'}</Text>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserAvatar;