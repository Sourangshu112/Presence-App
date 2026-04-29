// src/app/_layout.js
import { Stack } from 'expo-router';
// Import your global providers here
// import { AuthProvider } from '../context/AuthContext'; 

export default function RootLayout() {
  return (
    // <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Initial Loading/Routing Screen */}
        <Stack.Screen name="index" />

        {/* The Authentication Flow */}
        <Stack.Screen name="auth" />

        {/* The Role-Based Flows */}
        <Stack.Screen name="Students" />
        <Stack.Screen name="Teachers" />

        {/* Screens accessible from anywhere */}
        <Stack.Screen name="Shared" />
      </Stack>
    // </AuthProvider>
  );
}