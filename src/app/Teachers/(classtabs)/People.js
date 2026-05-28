// src/app/(teacher)/(classtabs)/People.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from './_layout';
import { PersonRowWithAction, PersonRowWithoutAction } from '@/components/ui/PersonRow';
import { useRouter } from 'expo-router';
import { useClassroomDataApi } from '@/api/classroomData.api';
import LoadingScreen from '@/components/LoadingScreen';

export default function TeacherPeopleScreen() {
  const router = useRouter()
  const {classroomData, attendanceOverview, refetchClassroom, refetchAttendance} = useContext(DataContext);
  const {removeStudent} = useClassroomDataApi();
  const [loading, setLoading] = useState(false)
  
  const handleAddStudent = () => {
    Alert.alert("Invite Student", "Open modal to add student email or send invite link.");
  };

  const handleCheckAttendance = (student_id) => {
    router.push({
      pathname: "./viewAttendancePerStudent",
      params: {
          stuId: student_id
      }
    })
  };

  const handleDelete = async (student_id) => {
    try{
      setLoading(true);
      const responce = await removeStudent(classroomData.classroom_id, student_id);
      if (responce.message === "Successfully removed from the class."){
        refetchClassroom();
        refetchAttendance();
        Alert.alert("Success",responce.message);
      }
      else throw new Error;
    } catch (error){
      Alert.alert("Failed", "Failed to remove Student");
    } finally {
      setLoading(false);
    }
  }

  return (
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
            <TouchableOpacity onPress={handleAddStudent} style={styles.addIcon}>
              <Ionicons name="person-add" size={22} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />
        <ScrollView>
        { !(loading) ? 
          classroomData?.students && classroomData.students.map((student)=>(
            <PersonRowWithAction key={student.student_id} item={student} onPressCheckAttendance={handleCheckAttendance} onPressDelete={handleDelete} />
          ))
          : <LoadingScreen />
        }
        </ScrollView>
      </View>
    </View>
  );
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