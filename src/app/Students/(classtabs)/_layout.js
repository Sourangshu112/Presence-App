import { Tabs, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createContext, useEffect, useState } from 'react';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useClassroomDataApi } from '@/api/classroomData.api';
import { normalDate } from '@/utils/dateTime';
import { useAttendanceApi } from '@/api/attendance.api';

export const DataContext = createContext();

export default function TabLayout() {
  const classroomDetails = useLocalSearchParams();
  const { getAnnouncements, getclassRoster } = useClassroomDataApi();
  const { getAttendanceData } = useAttendanceApi();
  
  const classroomHeader = {
    id: classroomDetails.classroom,
    name: classroomDetails.classroom_name,
    teacherName: classroomDetails.teacher_name,
    bannerColor: classroomDetails.color_code,
    joinedAt: normalDate(classroomDetails.joined_at),
    joinCode: classroomDetails.join_code
  };
  
  const [announcements, setAnnouncements] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({fetchClassroom: false, fetchAnnouncement: false, fetchAttendance: false}); // <-- New error state

  const fetchClassroom = async () => {
    try {
      setError(preError => ({...preError, fetchClassroom: false}))
      const classroomRes = await getclassRoster(classroomDetails.classroom);
      setClassroomData(classroomRes);
    } catch (error) {
      setError(preError => ({...preError, fetchClassroom: true}))
    }
  }

  const fetchAnnouncement = async () => {
    try {
      setError(preError => ({...preError, fetchAnnouncement: false}))
      const announcementRes = await getAnnouncements(classroomDetails.classroom);
      setAnnouncements(announcementRes.announcements);
    } catch (error) {
      setError(preError => ({...preError, fetchAnnouncement: true}))
    }
  }

  const fetchAttendance = async () => {
    try {
      setError(preError => ({...preError, fetchAttendance: false}))
      const attendanceRes = await getAttendanceData(classroomDetails.classroom);
      setAttendanceData(attendanceRes.record);
    } catch (error) {
        setError(preError => ({...preError, fetchAttendance: true}))
    }
  }

  // Wrapped fetch function to handle all APIs and the global error/loading states
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Execute all fetches concurrently for better performance
      await Promise.all([
        fetchAnnouncement(),
        fetchClassroom(),
        fetchAttendance()
      ]);
    } catch (err) {} 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // <-- If there is an error, show the SubjectBanner and the ErrorScreen
  

  return (
    <DataContext.Provider 
      value={{
        classroomData, 
        announcements, 
        attendanceData, 
        fetchAttendance, 
        classroomDetails, 
        attendanceMarked, 
        setAttendanceMarked, 
        loading,
        error,
      }} 
    >
      <Tabs 
        initialRouteName="Home"
        screenOptions={{ header: () => <SubjectBanner subject={classroomHeader} /> }}
      >
          <Tabs.Screen name="Home" options={{ 
            headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
            title:"Home"
          }} />
          <Tabs.Screen name="CheckAttendance" options={{ 
            headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar": "calendar-outline"} size={24} color={color} />,
            title:"Attendance"  
          }} />
          <Tabs.Screen name="People" options={{ 
            headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people":"people-outline"} size={24} color={color} />,
            title:"Classmates"  
          }} />
          <Tabs.Screen name="MarkAttendance" options={{ 
            headerShown: true, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "camera":"camera-outline"} size={24} color={color} /> ,
            title:"Give Attendance"
          }} />
      </Tabs>
    </DataContext.Provider>
  );
}