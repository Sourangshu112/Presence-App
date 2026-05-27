import { createContext, useEffect, useState } from 'react';
import { Tabs, useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SubjectBanner from '@/components/ui/SubjectBanner';
import { useClassroomDataApi } from '@/api/classroomData.api';
import { classDate } from '@/utils/dateTime';


export const DataContext = createContext();


export default function TabLayout() {
  const router = useRouter();
  const color = "black";
  const classroomDetails = useLocalSearchParams();
  const {getAnnouncements, getclassRoster, getAttendanceOverview} = useClassroomDataApi();
  
  const classroomHeader = {
  id: classroomDetails.id,
  name: classroomDetails.classroom_name,
  teacherName: classroomDetails.teacher_name,
  bannerColor: classroomDetails.color_code,
  joinedAt: classDate(classroomDetails.created_at),
  joinCode: classroomDetails.join_code
};
  const userRole = 'TEACHER';
  const [announcements, setAnnouncements] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [attendanceOverview, setAttendanceOverview] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      /*const [announcementRes, attendanceRes, 
        peopleRes, markAttendanceRes] = await Promise.allSettled(
          fetch(),
          fetch(),
          fetch(),
          fetch()
        )*/
      try {
        const announcementData = await getAnnouncements(classroomDetails.id);
        setAnnouncements(announcementData.announcements);
      } catch (error) {
        Alert.alert("Failed", "Could not load announcements, something went wrong");
      }
      try{
        const classroomData = await getclassRoster(classroomDetails.id);
        setClassroomData(classroomData);
      } catch (error) {
        Alert.alert("Failed", "Could not load Students, something went wrong");
      }
      try {
        const attendanceOverviewData = await getAttendanceOverview(classroomDetails.id);
        setAttendanceOverview(attendanceOverviewData);
      } catch (error) {
        Alert.alert("Failed", "Could not load Students Attendance, something went wrong");
      } finally{
          setLoading(false)
        }

      }
  fetchdata();
  },[])


  return (
    <DataContext.Provider value={{classroomDetails, announcements, setAnnouncements, classroomData, attendanceOverview}}>
    <View style={{flex: 1}}>
      <View>
          <SubjectBanner subject={classroomHeader}  />
      </View>
      <Tabs>
          <Tabs.Screen name="Home" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> 
            }} />
          
          <Tabs.Screen name="People" options={
            { headerShown: false, 
              tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people":"people-outline"} size={24} color={color} />,
              title: "Students"
            }} />
          
          <Tabs.Screen name="sessionCalender" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar": "calendar-outline"} size={24} color={color} />,
            title: "Sessions",    
            }} />
          {/* 
          <Tabs.Screen name="MarkAttendance" options={
            { headerShown: false, 
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "camera":"camera-outline"} size={24} color={color} />  
            }} /> */}
      </Tabs>
    </View>
    </DataContext.Provider>
  );
}
