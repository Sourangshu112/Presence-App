import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack>
      <Stack.Screen name="(classtabs)" options={{ headerShown: false }} />
      <Stack.Screen name="StudentDashboard" options={{ headerShown: true, title: 'Dashboard' }} />
    </Stack>
  );
}