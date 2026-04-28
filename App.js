import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraScreen from './src/components/CameraScreen';
import LoginScreen from './src/screens/Shared/Login';
import DetailScreen from './src/screens/Shared/Details';
import AddFaceDataScreen from './src/screens/Students/AddFaceData';

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <CameraScreen /> */}
      {/* <LoginScreen /> */}
      {/* <DetailScreen /> */}
      {/* <AddFaceDataScreen /> */}
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
