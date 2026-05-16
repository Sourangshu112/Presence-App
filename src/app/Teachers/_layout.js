import { Stack } from 'expo-router';

export default function TeacherLayout() {
  return (
    <Stack>
      <Stack.Screen name="TeacherDashboard" options={{ headerShown: true, title: 'Dashboard' }} />
      <Stack.Screen name="(classtabs)" options={{ headerShown: false }} />
    </Stack>
  );
}