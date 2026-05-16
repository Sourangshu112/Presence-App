import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderAnnouncement from '@/components/ui/Announcement';
import CreateAnnouncement from '@/components/ui/CreateAnnouncement';
import { DataContext } from './_layout';
import { useClassroomDataApi } from '@/api/classroomData.api';
// import { useLocalSearchParams } from 'expo-router'; // You'll use this later to get subject details


export default function SubjectHome() { 
  const {postAnnouncement} = useClassroomDataApi()
  const {classroomDetails} = useContext(DataContext)
  const {announcements,setAnnouncements} = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  

  const addAnnouncement = async (announcement) => {
    try{
        setLoading(true)
        const data = await postAnnouncement(classroomDetails.id, announcement)
        if (data.message === "Announcement posted successfully"){
          setAnnouncements(prevAnnouncements => [data.announcement,...prevAnnouncements]);
        }
      } catch (error){
      Alert.alert("Failed", "Could not Post announcement. Try again!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {loading ? <Text>Loading</Text>:<CreateAnnouncement onPostAnnouncement={addAnnouncement} />}
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
