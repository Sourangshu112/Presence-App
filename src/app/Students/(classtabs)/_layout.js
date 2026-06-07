import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createContext, useEffect, useState } from 'react';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useClassroomDataApi } from '@/api/classroomData.api';
import { normalDate } from '@/utils/dateTime';
import { useAttendanceApi } from '@/api/attendance.api';

export const DataContext = createContext();


export default function TabLayout() {
  const router = useRouter()
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  const {getAnnouncements, getclassRoster} = useClassroomDataApi();
  const {getAttendanceData} = useAttendanceApi();
  
  const classroomHeader = {
  id: classroomDetails.classroom,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  joinedAt: normalDate(classroomDetails.joined_at),
  joinCode: classroomDetails.join_code
};
  const userRole = 'STUDENT';
  const [announcements, setAnnouncements] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);


   const fetchClassroom = async () => {
    try{
        const classroomRes = await getclassRoster(classroomDetails.classroom);
        setClassroomData(classroomRes);
      } catch (error) {
        Alert.alert("Failed", "Could not load Students, something went wrong");
      }
  }

  const fetchAnnouncement = async () => {
    try {
        const announcementRes = await getAnnouncements(classroomDetails.classroom);
        setAnnouncements(announcementRes.announcements);
      } catch (error) {
        Alert.alert("Failed", "Could not load announcements, something went wrong");
      }
  }

  const fetchAttendance = async () => {
    try{
      const attendanceRes = await getAttendanceData(classroomDetails.classroom);
      setAttendanceData(attendanceRes.record)
    } catch (error){
      Alert.alert("Failed", "Could not load attendance, something went wrong");
    }
  }

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        fetchAnnouncement();
        fetchClassroom();
        fetchAttendance();
        } catch (error) {
        }
        finally{
          setLoading(false)
        }
      }
  fetchdata();
  },[])

  return (
    <DataContext.Provider value={{classroomData, announcements, attendanceData, fetchAttendance}} >
      <Tabs 
        initialRouteName="Home"
        screenOptions={{header: () => <SubjectBanner subject={classroomHeader} />}}
      >
          <Tabs.Screen name="Home" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> ,
            title:"Home"
            }} />
          <Tabs.Screen name="CheckAttendance" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar": "calendar-outline"} size={24} color={color} />,
            title:"Attendance"  
            }} />
          <Tabs.Screen name="People" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people":"people-outline"} size={24} color={color} />,
            title:"Classmates"  
            }} />
          <Tabs.Screen name="MarkAttendance" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "camera":"camera-outline"} size={24} color={color} /> ,
            title:"Give Attendance"
            }} />
      </Tabs>
    </DataContext.Provider>
  );
}
