import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraScreen from './components/CameraScreen';
import LoginScreen from './screens/Login';
import DetailScreen from './screens/Details';

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <CameraScreen /> */}
      <LoginScreen />
      {/* <DetailScreen /> */}
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
