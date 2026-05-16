import React from 'react';
import { View, Text, StyleSheet } from "react-native";

export default function SubjectBanner({ subject }) {
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.banner, { backgroundColor: subject.bannerColor || '#1a73e8' }]}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.teacherName}>Teacher: {subject.teacherName}</Text>
        <Text style={styles.teacherName}>Joined on: {subject.joinedAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 5,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  banner: {
    borderRadius: 12,
    padding: 20,
    height: 140,
    justifyContent: 'flex-end',
    marginBottom: 16,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
  },
});