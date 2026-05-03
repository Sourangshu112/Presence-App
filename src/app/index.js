import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // 1. Wrap the async logic in a function inside useEffect
    const checkExistingSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        
        // 2. Use router.replace() instead of returning <Redirect />
        if (!token) {
          router.replace('/auth/Login');
          return; // Stop execution here
        }

        const response = await fetch('http://10.195.176.11:8000/auth/verify_session/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // 3. Handle expired tokens (401 Unauthorized)
        if (!response.ok) {
            router.replace('/auth/Login');
            return;
        }

        const data = await response.json();
        
        // 4. Route based on role
        if (data && data.user) {
          const userRole = data.user.role;

          if (userRole === 'STUDENT') router.replace('/Students/Dashboard');
          else if (userRole === 'TEACHER') router.replace('/Teachers/Dashboard');
          else router.replace('/Shared/Details');
        } else {
          router.replace('/auth/Login');
        }

      } catch (error) {
        console.log("Network or Storage Error: ", error);
        router.replace('/auth/Login');
      }
    };

    checkExistingSession();
  }, []); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1976D2' }}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}