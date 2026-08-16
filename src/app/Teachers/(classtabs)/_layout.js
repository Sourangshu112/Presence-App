import { createContext, useEffect, useState } from 'react';
import { Stack, Tabs, useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useClassroomDataApi } from '@/api/classroomData.api';
import { useAttendanceApi } from '@/api/attendance.api';
import { normalDate } from '@/utils/dateTime';


export const DataContext = createContext();


export default function TabLayout() {
  const router = useRouter();
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  const {getAnnouncements, getclassRoster} = useClassroomDataApi();
  const {getAttendanceOverview} = useAttendanceApi();
  
  const classroomHeader = {
  id: classroomDetails.id,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  joinedAt: normalDate(classroomDetails.created_at),
  joinCode: classroomDetails.join_code
};
  const userRole = 'TEACHER';
  const [announcements, setAnnouncements] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [attendanceOverview, setAttendanceOverview] = useState(null);
  const [error, setError] = useState({fetchClassroom: false, fetchAnnouncement: false, fetchAttendance: false});
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
        setError(preError => ({...preError, fetchAttendance: false}))
        const attendanceOverviewData = await getAttendanceOverview(classroomDetails.id);
        setAttendanceOverview(attendanceOverviewData);
      } catch (error) {
        setError(preError => ({...preError, fetchAttendance: true}))
      }
  }

  const fetchClassroom = async () => {
    try{
      setError(preError => ({...preError, fetchClassroom: false}))
        const classroomData = await getclassRoster(classroomDetails.id);
        setClassroomData(classroomData);
      } catch (error) {
        setError(preError => ({...preError, fetchClassroom: true}))
      }
  }

  const fetchAnnouncement = async () => {
    try {
        setError(preError => ({...preError, fetchAnnouncement: false}))
        const announcementData = await getAnnouncements(classroomDetails.id);
        setAnnouncements(announcementData.announcements);
      } catch (error) {
        setError(preError => ({...preError, fetchAnnouncement: true}))
      }
  }

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        fetchAnnouncement();
        fetchClassroom();
        fetchAttendance();
      } catch {

      }finally{
          setLoading(false)
        }

      }
  fetchdata();
  },[])


  return (
    <DataContext.Provider value={{
      classroomDetails, 
      announcements, 
      setAnnouncements, 
      classroomData, 
      attendanceOverview, 
      fetchClassroom, 
      fetchAttendance,
      loading,
      error
      }}>
      <Tabs 
      initialRouteName="Home"
      screenOptions={{header: () => <SubjectBanner subject={classroomHeader} />}}
      >
          <Tabs.Screen name="Home" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> 
            }} />
          
          <Tabs.Screen name="People" options={
            { headerShown: true, 
              tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people":"people-outline"} size={24} color={color} />,
              title: "Students"
            }} />
          
          <Tabs.Screen name="sessionCalender" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar": "calendar-outline"} size={24} color={color} />,
            title: "Sessions",    
            }} />

          <Tabs.Screen name="markAttendance" options={
            { headerShown: true, 
            tabBarIcon: ({ color, focused }) => <AntDesign name={focused ? "usergroup-add":"usergroup-add"} size={24} color={color} />,
            title: "Attendance"  
            }} />

          <Tabs.Screen 
            name="viewAttendancePerSession" 
            options={{ 
              href: null,
              headerShown: true ,
              tabBarStyle: { display: 'none' }
            }} 
          />

          <Tabs.Screen 
            name="viewAttendancePerStudent" 
            options={{ 
              href: null, // This completely hides it from the bottom tab bar!
              headerShown: true ,
              tabBarStyle: { display: 'none' }
            }} 
          />
          
      </Tabs>
    </DataContext.Provider>
  );
}
