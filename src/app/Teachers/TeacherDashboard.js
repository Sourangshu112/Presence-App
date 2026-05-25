import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Modular Imports
import LoadingScreen from '@/components/LoadingScreen';
import CreateClassModal from '@/components/modals/createClassModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ClassCard from '@/components/dashboard/ClassCard';
import EmptyState from '@/components/dashboard/EmptyState';
import FAB from '@/components/dashboard/FAB';
import { useClassroomApi } from '@/api/classroom.api';

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();
  const {getTeacherDashboard} = useClassroomApi();

  const fetchDashboardData = async () => {
    try {
      const data = await getTeacherDashboard();
      setTeacherInfo(data.teacher);
      setTeachingClasses(data.teaching_classes)
    } catch (error) {
      Alert.alert("Network Error", "Could not load the dashboard");
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (isLoading) return <LoadingScreen />;
  if (!teacherInfo?.is_active) {
    return (
      <View style={styles.centered}>
        <Text style={styles.WarnText}>Something went wrong. Please contact your admin.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader userName={teacherInfo.name} role="TEACHER" />
      
      <FlatList
        data={teachingClasses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ClassCard 
            item={item} 
            role="TEACHER" 
            onPress={(classItem) => router.push({ pathname: "./(classtabs)/", params: classItem })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState role="TEACHER" />}
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={() => setModalVisible(true)} />

      <CreateClassModal 
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