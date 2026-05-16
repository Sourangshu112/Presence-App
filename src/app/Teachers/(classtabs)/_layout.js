import { Tabs } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHeader from '@/components/ui/SubjectHeader';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { useApi } from '@/context/APIContext';
import * as SecureStore from 'expo-secure-store';


export const DataContext = createContext();


export default function TabLayout() {
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  
  const classroomHeader = {
  id: classroomDetails.id,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  createdAt: classroomDetails.created_at.slice(0,10)
};
  const userRole = 'teacher';
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiurl = useApi()

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('access_token');
        
        if (!token) {
          router.replace('/auth/Login');
          return;
        }
        const obj = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        /*const [announcementRes, attendanceRes, 
                peopleRes, markAttendanceRes] = await Promise.allSettled(
                  fetch(),
                  fetch(),
                  fetch(),
                  fetch()
                )*/
        const announcementRes = await fetch(`${apiurl}/classroom_data/${classroomHeader.id}/announcements/`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await announcementRes.json();
        if (announcementRes.ok) {
          // 3. Save the data to state so React can render it
          console.log(data);
        } else {
          // Handle specific backend errors (like inactive account)
          Alert.alert("Error", data.error || "Failed to load dashboard");
          if (announcementRes.status === 403) router.replace('/auth/Login');
        }
    } catch (error) {
    console.log(error);
  }
  finally{
    setLoading(false)
  }
  }
  fetchdata();
  },[])


  return (
    <View style={{flex: 1}}>
      <View>
          <RenderHeader subject={classroomHeader} userRole={userRole} />
      </View>
      <Tabs>
          <Tabs.Screen name="Home" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> 
            }} />
          {/* <Tabs.Screen name="CheckAttendance" options={
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
            }} /> */}
      </Tabs>
    </View>
  );
}
