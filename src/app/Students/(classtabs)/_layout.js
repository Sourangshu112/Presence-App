import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createContext, useEffect, useState } from 'react';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useClassroomDataApi } from '@/api/classroomData.api';



export const DataContext = createContext();


export default function TabLayout() {
  const router = useRouter()
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  const {getAnnouncements} = useClassroomDataApi();
  
  const classroomHeader = {
  id: classroomDetails.classroom,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  joinedAt: classroomDetails.joined_at.slice(0,10)
};
  const userRole = 'STUDENT';
  const [announcements, setAnnouncements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        /*const [announcementRes, attendanceRes, 
                peopleRes, markAttendanceRes] = await Promise.allSettled(
                  fetch(),
                  fetch(),
                  fetch(),
                  fetch()
                )*/

        const announcementdata = getAnnouncements(classroomDetails.id);
        setAnnouncements(announcementdata.announcements);
        } catch (error) {
          Alert.alert("Failed", "Could not load announcements, something went wrong");
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
          <SubjectBanner subject={classroomHeader} />
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
