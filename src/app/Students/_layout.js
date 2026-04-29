import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack>
      <Stack.Screen name="(classtabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AddFaceData" options={{ headerShown: true, title: 'Adding Face'}} />
      <Stack.Screen name="Dashboard" options={{ headerShown: true, title: 'Dashboard' }} />
    </Stack>
  );
}