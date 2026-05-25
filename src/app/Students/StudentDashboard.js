import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useClassroomApi } from '@/api/classroom.api';

// Modular Imports
import LoadingScreen from '@/components/LoadingScreen';
import JoinClassModal from '@/components/modals/joinclassmodal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ClassCard from '@/components/dashboard/ClassCard';
import EmptyState from '@/components/dashboard/EmptyState';
import FAB from '@/components/dashboard/FAB';



export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();
  const { getStudentDashboard } = useClassroomApi();

  const fetchDashboardData = async () => {
    try {
      const data = await getStudentDashboard();
      setStudentInfo(data.student);
      setEnrolledClasses(data.enrolled_classes);
    } catch (err) {
      Alert.alert("Error", "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (isLoading) return <LoadingScreen />;
  if (!studentInfo?.is_active) {
    return (
      <View style={styles.centered}>
        <Text style={styles.WarnText}>Something went wrong. Please contact your admin.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader userName={studentInfo.name} role="STUDENT" />
      
      <FlatList
        data={enrolledClasses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ClassCard 
            item={item} 
            role="STUDENT" 
            onPress={(classItem) => router.push({ pathname: "./(classtabs)/", params: classItem })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState role="STUDENT" />}
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={() => setModalVisible(true)} />

      <JoinClassModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchDashboardData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  listContent: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  WarnText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});