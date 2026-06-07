import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderAnnouncement from '@/components/ui/Announcement';
import { DataContext } from './_layout';




export default function SubjectHome() {
  // In reality, you'd get these from Context/Auth and Expo Router params
  // const { subjectId, name, teacher } = useLocalSearchParams();
  const {announcements} = useContext(DataContext);


  // --- MAIN RENDER ---
  return (
    <View style={styles.container}>
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
});