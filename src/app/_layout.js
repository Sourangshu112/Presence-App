// src/app/_layout.js
import { Stack } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// Import your global providers here
// import { AuthProvider } from '../context/AuthContext'; 
import { AuthProvider } from '../context/AuthContext';


// Add this at the very top of your App.js file
const originalWarn = console.error;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    args[0].includes('A props object containing a "key" prop is being spread into JSX')
  ) {
    return; // Ignore this specific annoyance
  }
  originalWarn(...args);
};

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