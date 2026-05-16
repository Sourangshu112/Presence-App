import { Tabs } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { useApi } from '@/context/APIContext';
import * as SecureStore from 'expo-secure-store';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useRouter } from 'expo-router';


export const DataContext = createContext();


export default function TabLayout() {
  const router = useRouter();
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  
  const classroomHeader = {
  id: classroomDetails.id,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  createdAt: classroomDetails.created_at.slice(0,10)
};
  const userRole = 'TEACHER';
  const [announcements, setAnnouncements] = useState(null);
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
        const announcementRes = await fetch(`${apiurl}/classroom_data/${classroomDetails.id}/announcements/`,{
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
          setAnnouncements(data.announcements)
        } else {
          // Handle specific backend errors (like inactive account)
          Alert.alert("Error", data.error || "Failed to load");
          if (announcementRes.status === 401) {
            Alert.alert("Session Expired", "Please log in again.");
            router.replace('/auth/Login')
          };
          if (response.status === 403) {
            Alert.alert("Access Denied", data.error || "You do not have permission to view this.");
          }
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
    <DataContext.Provider value={{classroomDetails, announcements, setAnnouncements}}>
    <View style={{flex: 1}}>
      <View>
          <SubjectBanner subject={classroomHeader} />
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
    </DataContext.Provider>
  );
}
