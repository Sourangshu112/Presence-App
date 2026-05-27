import { Stack } from 'expo-router';

export default function ViewAttendanceLayout() {
  return (
    <Stack>
        <Stack.Screen name="viewSession" options={{ headerShown: false }} />
        <Stack.Screen name="viewAttendancePerSession" options={{ headerShown: false }} />
        <Stack.Screen name="viewAttendancePerStudent" options={{ headerShown: false }} />
    </Stack>
  );
}