import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack>
      <Stack.Screen name="Details" options={{ headerShown: false, title: 'Details' }} />
      <Stack.Screen name="AddFaceData" options={{ headerShown: false, title: 'Adding Face'}} />
      <Stack.Screen name="ProcessData" options={{ headerShown: false, title: 'Processing'}} />
    </Stack>
  );
}