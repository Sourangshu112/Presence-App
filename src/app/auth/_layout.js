import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: true, title: 'Login/SignUp' }} />
    </Stack>
  );
}