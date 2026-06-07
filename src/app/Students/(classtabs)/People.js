// src/app/(student)/(classtabs)/People.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from './_layout';
import { PersonRowWithoutAction } from '@/components/ui/PersonRow';


export default  function StudentPeopleScreen () {
  const {classroomData} = useContext(DataContext);
  return(
  <View style={styles.container}>
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionHeaderTop}>
          <Text style={styles.sectionTitle}>TEACHER</Text>
        </View>
        <View style={styles.divider} />
        {
          classroomData?.teachers && classroomData.teachers.map((teacher) => 
          <PersonRowWithoutAction key={teacher.user_id} item={teacher} isTeacher={true} />
        )
        }
      </View>
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionHeaderTop}>
          <Text style={styles.sectionTitle}>STUDENT</Text>
            <View style={styles.actionHeaderRight}>
            {/* Utilize the total_students field from your payload */}
            <Text style={styles.studentCount}>
              {classroomData?.total_students} students
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <ScrollView>
         { classroomData?.students && classroomData.students.map((student)=>(
            <PersonRowWithoutAction key={student.student_id} item={student} isTeacher={false}/>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  sectionHeaderContainer: { 
    // marginTop: 10, 
    // marginBottom: 15,
    margin: 15 
  },
  sectionHeaderTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 8 
  },
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: '400',
    color: '#4A90E2' 
  },
  actionHeaderRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  studentCount: { 
    fontSize: 14, 
    color: '#4A90E2', 
    fontWeight: '500', 
    marginRight: 12 
  },
  addIcon: { 
    padding: 4 
  },
  divider: { 
    height: 2, 
    backgroundColor: '#4A90E2', 
    width: '100%' 
  },
});
