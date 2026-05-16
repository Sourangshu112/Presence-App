import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuthApi } from '@/api/auth.api';

export default function Index() {
  const router = useRouter();
  const { verifySession } = useAuthApi();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // The API client automatically checks the token and handles 401 redirects
        const data = await verifySession();
        
        // Route based on role
        if (data && data.user) {
          const userRole = data.user.role;

          if (userRole === 'STUDENT') router.replace('/Students/StudentDashboard');
          else if (userRole === 'TEACHER') router.replace('/Teachers/TeacherDashboard');
          else router.replace('/Shared/Details');
        } else {
          router.replace('/auth/Login');
        }
      } catch (error) {
        console.log("Session verification failed:", error);
      }
    };

    checkExistingSession();
  }, []); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1976D2' }}>
      <LoadingScreen />
    </View>
  );
}