import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHeader from '@/components/ui/SubjectHeader';


export default function TabLayout() {
  const color = "red";
  const MOCK_SUBJECT = {
  id: '101',
  name: 'Control Systems',
  teacherName: 'Dr. A. Sharma',
  bannerColor: '#4A90E2', // You can store distinct colors per subject in your DB
};
  const userRole = 'student';
  return (
    <View style={{flex: 1}}>
      <View>
          <RenderHeader subject={MOCK_SUBJECT} userRole={userRole} />
      </View>
      <Tabs>
          <Tabs.Screen name="Home" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> 
            }} />
          <Tabs.Screen name="CheckAttendance" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar": "calendar-outline"} size={24} color={color} />  
            }} />
          <Tabs.Screen name="People" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people":"people-outline"} size={24} color={color} />  
            }} />
          <Tabs.Screen name="MarkAttendance" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "camera":"camera-outline"} size={24} color={color} />  
            }} />
      </Tabs>
    </View>
  );
}