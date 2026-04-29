import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function TabLayout() {
  return (
    <Tabs>
        <Tabs.Screen name="Home" options={{ title: 'Home' }} />
        <Tabs.Screen name="Attendance" options={{ title: 'Check Attendance' }} />
        <Tabs.Screen name="People" options={{ title: 'People' }} />
        <Tabs.Screen name="MarkAttendance" options={{ title: 'Mark Attendance' }} />
    </Tabs>
  );
}