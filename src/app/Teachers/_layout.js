import { Stack } from 'expo-router';

export default function TeacherLayout() {
  return (
    <Stack>
      <Stack.Screen name="Dashboard" options={{ headerShown: true, title: 'Dashboard' }} />
    </Stack>
  );
}