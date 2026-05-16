import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderAnnouncement from '@/components/ui/Announcement';
import CreateAnnouncement from '@/components/ui/CreateAnnouncement';
import { useApi } from '@/context/APIContext';
import { DataContext } from './_layout';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';


// import { useLocalSearchParams } from 'expo-router'; // You'll use this later to get subject details

// --- MOCK DATA (To be replaced by Backend API later) ---



export default function SubjectHome() { 


  const router = useRouter()
  const {classroomDetails} = useContext(DataContext)
  const {announcements,setAnnouncements} = useContext(DataContext);
  const apiurl = useApi();

  const addAnnouncement = async (announcement) => {
    try{
      const token = await SecureStore.getItemAsync('access_token');
        
        if (!token) {
          router.replace('/auth/Login');
          return;
        }
        console.log(announcement);
      const responce = await fetch(`${apiurl}/classroom_data/${classroomDetails.id}/announcements/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body : JSON.stringify({content: announcement})
        });
        const data = await responce.json();
        if (responce.ok){
          if (data.message === "Announcement posted successfully"){
            setAnnouncements(prevAnnouncements => [data.announcement,...prevAnnouncements]);
          }
        } else {
          Alert.alert("Error", data.error || "Failed to Process");
          if (announcementRes.status === 401) {
            Alert.alert("Session Expired", "Please log in again.");
            router.replace('/auth/Login')
          };
          if (response.status === 403) {
            Alert.alert("Access Denied", data.error || "You do not have permission to view this.");
          }
        }
    } catch (error){
      console.log(error)
    }
  }

  // --- MAIN RENDER ---
  return (
    <View style={styles.container}>
      <CreateAnnouncement onPostAnnouncement={addAnnouncement} />
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
