import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//General
import LoginScreen from './src/app/auth/Login';
import DetailScreen from './src/app/Shared/Details';

//Student
import AddFaceDataScreen from './src/app/Students/AddFaceData';
import StudentDashboard from './src/app/Students/Dashboard';
import StudentLayout from './src/app/Students/_layout';

//Teacher
import TeacherDashboard from './src/app/Teachers/Dashboard';

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <CameraScreen /> */}
      {/* <LoginScreen /> */}
      {/* <DetailScreen /> */}
      {/* <AddFaceDataScreen /> */}
      {/* <StudentDashboard /> */}
      <StudentLayout />
      {/* <TeacherDashboard /> */}
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
