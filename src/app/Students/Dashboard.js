// src/screens/student/StudentDashboard.js
import React from 'react';
import { Alert } from 'react-native';
import ClassroomDashboard from '../../components/ClassroomDashboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentDashboard({ navigation }) {
  // In a real app, this comes from your backend database
  const myClasses = [
    { id: 1, title: 'Mathematics 101', section: 'Morning Batch', teacherName: 'Mr. Anderson', themeColor: '#1a73e8' },
    { id: 2, title: 'Physics', section: 'Lab Group A', teacherName: 'Dr. Banner', themeColor: '#188038' },
  ];

  return (
    <ClassroomDashboard
      role="student"
      userName="Alex"
      classes={myClasses}
      onClassPress={(cls) => navigation.navigate('ClassDetails', { classId: cls.id })}
      onFabPress={() => Alert.alert('Join Class', 'Open camera to scan QR code?')}
    />
  );
}