// src/app/_layout.js
import { Stack } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// Import your global providers here
// import { AuthProvider } from '../context/AuthContext'; 
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="Students" />
            <Stack.Screen name="Teachers" />
            <Stack.Screen name="Shared" />
          </Stack>
      </AuthProvider>
        </SafeAreaView>
      </SafeAreaProvider>
  );
}