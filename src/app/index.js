// src/app/index.js
import { View, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // <-- Import your custom hook

export default function TemporaryLogin() {
  const router = useRouter();
  const { userRole, mockLogin } = useAuth(); // <-- Grab the state and function

  const handleSimulatedLogin = (role) => {
    // 1. Set the role globally in Context
    mockLogin(role);
    
    // 2. Route the user based on the role
    if (role === 'student') {
      router.replace('/Students/Dashboard');
    } else if (role === 'teacher') {
      router.replace('/Teachers/Dashboard');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 20 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
        Current Global Role: {userRole || 'Not Logged In'}
      </Text>

      <Button 
        title="Login as Student" 
        onPress={() => handleSimulatedLogin('student')} 
      />
      
      <Button 
        title="Login as Teacher" 
        onPress={() => handleSimulatedLogin('teacher')} 
      />
        <Button 
          title="🐛 Open Sitemap (Debug)" 
          color="purple"
          onPress={() => router.push('/_sitemap')} 
        />
    </View>
  );
}