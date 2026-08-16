import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderAnnouncement from '@/components/ui/Announcement';
import CreateAnnouncement from '@/components/ui/CreateAnnouncement';
import { DataContext } from './_layout';
import { useClassroomDataApi } from '@/api/classroomData.api';
import LoadingScreen, {LoadingScreenSmall} from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';

export default function SubjectHome() { 
  const {postAnnouncement} = useClassroomDataApi()
  const {classroomDetails} = useContext(DataContext)
  const {announcements,setAnnouncements, error, loading, fetchAnnouncement} = useContext(DataContext);
  const [posting, setPosting] = useState(false);
  

  const addAnnouncement = async (announcement) => {
    try{
        setPosting(true)
        const data = await postAnnouncement(classroomDetails.id, announcement)
        if (data.message === "Announcement posted successfully"){
          setAnnouncements(prevAnnouncements => [data.announcement,...prevAnnouncements]);
        }
      } catch (error){
      Alert.alert("Failed", "Could not Post announcement. Try again!")
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <LoadingScreen />

  if (error.fetchAnnouncement){
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <ErrorScreen onRetry={fetchAnnouncement} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {posting ? <LoadingScreenSmall />:<CreateAnnouncement onPostAnnouncement={addAnnouncement} />}
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={RenderAnnouncement}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // A light, neutral background
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
})
