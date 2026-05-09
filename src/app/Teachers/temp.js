// src/screens/teacher/TeacherDashboard.js
import React from 'react';
import { Alert } from 'react-native';
import ClassroomDashboard from '@/components/ClassroomDashboard';

export default function TeacherDashboard({ navigation }) {
  // Notice the data is slightly different here (studentCount instead of teacherName)
  const myTeachingClasses = [
    { id: 1, title: 'Mathematics 101', section: 'Morning Batch', studentCount: 42, themeColor: '#1a73e8' },
    { id: 2, title: 'Advanced Calculus', section: 'Evening Batch', studentCount: 15, themeColor: '#d93025' },
  ];

  return (
    <ClassroomDashboard
      role="TEACHER"
      userName="Mr. Anderson"
      classes={myTeachingClasses}
      onClassPress={(cls) => navigation.navigate('AttendanceReport', { classId: cls.id })}
      onFabPress={() => Alert.alert('Create Class', 'Open modal to enter class details?')}
    />
  );
}