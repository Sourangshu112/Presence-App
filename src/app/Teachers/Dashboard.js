import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import ClassroomDashboard from '@/components/ClassroomDashboard';
import CreateClassModal from '@/components/modals/createClassModal';

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        
        if (!token) {
          router.replace('/auth/Login');
          return;
        }

        const response = await fetch('http://10.215.120.11:8000/classroom/teacher/dashboard/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setTeacherInfo(data.teacher);
          setTeachingClasses(data.teaching_classes);
        } else {
          Alert.alert("Error", data.error || "Failed to load dashboard");
          if (response.status === 403) router.replace('/auth/Login');
        }

      } catch (error) {
        console.error("Network Error:", error);
        Alert.alert("Network Error", "Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);



  if (isLoading) {
      return <LoadingScreen />
    }
  
    if (!teacherInfo.is_active){
      return(
        <View style={[styles.container, styles.centered]}>
          <Text styles={styles.WarnText}>Something Wrong Happened Please contact your admin</Text>
        </View>
      )
    }
  
    return (
      <> 
        <ClassroomDashboard
        role="TEACHER"
        userName={teacherInfo.name}
        classes={teachingClasses}
        onClassPress={() => {console.log("Class is pressed")}}
        onFabPress={() => setModalVisible(true)}
      />

      <CreateClassModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchDashboardData} // Automatically refresh the list when a class is made!
      />
      </>
    );
  }
  
  // Basic styling to make it look clean
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    WarnText: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  });