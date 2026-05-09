import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import ClassroomDashboard from '@/components/ClassroomDashboard';
import JoinClassModal from '@/components/modals/joinclassmodal';

export default function StudentDashboard() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardData = async () => {
      try {
        // 1. Get the Key Card (Token)
        const token = await SecureStore.getItemAsync('access_token');
        
        if (!token) {
          router.replace('/auth/Login');
          return;
        }

        // 2. Make the GET request to Django
        // Note: Update the URL if your urls.py path is different
        const response = await fetch('http://10.215.120.11:8000/classroom/student/dashboard/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // The magic bouncer pass
          }
        });

        const data = await response.json();

        if (response.ok) {
          // 3. Save the data to state so React can render it
          setStudentInfo(data.student);
          setEnrolledClasses(data.enrolled_classes);
        } else {
          // Handle specific backend errors (like inactive account)
          Alert.alert("Error", data.error || "Failed to load dashboard");
          if (response.status === 403) router.replace('/auth/Login');
        }

      } catch (error) {
        console.error("Network Error:", error);
        Alert.alert("Network Error", "Could not connect to the server.");
      } finally {
        setIsLoading(false); // Turn off the loading spinner
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty array means this runs exactly once when the screen opens

  // --- RENDERING ---

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!studentInfo.is_active){
    return(
      <View style={[styles.container, styles.centered]}>
        <Text styles={styles.WarnText}>Something Wrong Happened Please contact your admin</Text>
      </View>
    )
  }

  return ( 
    <>
      <ClassroomDashboard
      role="STUDENT"
      userName={studentInfo.name}
      classes={enrolledClasses}
      onClassPress={(item) => {router.push({
        pathname : "./(classtabs)/",
        params: item
      })}}
      onFabPress={() => setModalVisible(true)}
    />
    <JoinClassModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchDashboardData}
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