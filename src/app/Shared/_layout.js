import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack>
      <Stack.Screen name="Details" options={{ headerShown: true, title: 'Details' }} />
    </Stack>
  );
}